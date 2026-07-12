const express = require("express");
const prisma = require("../utils/prisma");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// GET /api/trips
router.get("/", async (req, res, next) => {
  try {
    const { status } = req.query;
    const trips = await prisma.trip.findMany({
      where: status ? { status } : {},
      include: { vehicle: true, driver: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(trips);
  } catch (err) {
    next(err);
  }
});

// GET /api/trips/:id
router.get("/:id", async (req, res, next) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true, driver: true },
    });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    next(err);
  }
});

// POST /api/trips — create a Draft trip (no status locking yet, only capacity check)
router.post("/", authorize("FLEET_MANAGER", "DRIVER"), async (req, res, next) => {
  try {
    const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;
    if (!source || !destination || !vehicleId || !driverId || cargoWeight == null || !plannedDistance) {
      return res.status(400).json({ message: "Missing required trip fields" });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Rule: Cargo Weight must not exceed the vehicle's maximum load capacity
    if (cargoWeight > vehicle.maxLoadCapacity) {
      return res.status(422).json({
        message: `Cargo weight (${cargoWeight}kg) exceeds vehicle max load capacity (${vehicle.maxLoadCapacity}kg)`,
        field: "cargoWeight",
      });
    }

    const trip = await prisma.trip.create({
      data: { source, destination, vehicleId, driverId, cargoWeight, plannedDistance, status: "Draft" },
    });
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
});

// POST /api/trips/:id/dispatch
router.post("/:id/dispatch", authorize("FLEET_MANAGER", "DRIVER"), async (req, res, next) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true, driver: true },
    });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status !== "Draft") {
      return res.status(422).json({ message: `Trip must be in Draft status to dispatch (currently ${trip.status})` });
    }

    const { vehicle, driver } = trip;

    // Rule: Retired or In Shop vehicles must never appear in dispatch
    if (vehicle.status !== "Available") {
      return res.status(422).json({ message: `Vehicle is ${vehicle.status}, must be Available to dispatch`, field: "vehicleId" });
    }
    // Rule: driver already On Trip / Suspended / Off Duty cannot be assigned
    if (driver.status !== "Available") {
      return res.status(422).json({ message: `Driver is ${driver.status}, must be Available to dispatch`, field: "driverId" });
    }
    // Rule: expired license blocks assignment
    if (new Date(driver.licenseExpiryDate) < new Date()) {
      return res.status(422).json({ message: "Driver license has expired.", field: "driverId" });
    }
    // Re-check capacity in case vehicle capacity was edited after draft creation
    if (trip.cargoWeight > vehicle.maxLoadCapacity) {
      return res.status(422).json({ message: "Cargo weight exceeds vehicle max load capacity", field: "cargoWeight" });
    }

    // Atomic: dispatch trip + flip vehicle and driver to On Trip together
    const [updatedTrip] = await prisma.$transaction([
      prisma.trip.update({
        where: { id: trip.id },
        data: { status: "Dispatched", dispatchedAt: new Date() },
      }),
      prisma.vehicle.update({ where: { id: vehicle.id }, data: { status: "On Trip" } }),
      prisma.driver.update({ where: { id: driver.id }, data: { status: "On Trip" } }),
    ]);

    res.json(updatedTrip);
  } catch (err) {
    next(err);
  }
});

// POST /api/trips/:id/complete — body: { finalOdometer, fuelConsumed, actualDistance }
router.post("/:id/complete", authorize("FLEET_MANAGER", "DRIVER"), async (req, res, next) => {
  try {
    const { finalOdometer, fuelConsumed, actualDistance } = req.body;
    const trip = await prisma.trip.findUnique({ where: { id: req.params.id }, include: { vehicle: true } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status !== "Dispatched") {
      return res.status(422).json({ message: `Trip must be Dispatched to complete (currently ${trip.status})` });
    }

    const [updatedTrip] = await prisma.$transaction([
      prisma.trip.update({
        where: { id: trip.id },
        data: {
          status: "Completed",
          completedAt: new Date(),
          actualDistance: actualDistance ?? trip.plannedDistance,
          fuelConsumed: fuelConsumed ?? null,
        },
      }),
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
          status: "Available",
          odometer: finalOdometer ?? trip.vehicle.odometer,
        },
      }),
      prisma.driver.update({ where: { id: trip.driverId }, data: { status: "Available" } }),
      ...(fuelConsumed
        ? [
            prisma.fuelLog.create({
              data: { vehicleId: trip.vehicleId, liters: fuelConsumed, cost: 0 },
            }),
          ]
        : []),
    ]);

    res.json(updatedTrip);
  } catch (err) {
    next(err);
  }
});

// POST /api/trips/:id/cancel
router.post("/:id/cancel", authorize("FLEET_MANAGER", "DRIVER"), async (req, res, next) => {
  try {
    const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (!["Draft", "Dispatched"].includes(trip.status)) {
      return res.status(422).json({ message: `Cannot cancel a trip that is ${trip.status}` });
    }

    const wasDispatched = trip.status === "Dispatched";

    const ops = [
      prisma.trip.update({ where: { id: trip.id }, data: { status: "Cancelled", cancelledAt: new Date() } }),
    ];
    if (wasDispatched) {
      ops.push(prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "Available" } }));
      ops.push(prisma.driver.update({ where: { id: trip.driverId }, data: { status: "Available" } }));
    }

    const [updatedTrip] = await prisma.$transaction(ops);
    res.json(updatedTrip);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
