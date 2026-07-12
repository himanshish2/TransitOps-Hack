const express = require("express");
const prisma = require("../utils/prisma");
const { authenticate, authorize } = require("../middleware/auth");
const { VEHICLE_STATUS } = require("../utils/constants");

const router = express.Router();
router.use(authenticate);

// GET /api/vehicles?status=Available&type=Truck&region=North
router.get("/", async (req, res, next) => {
  try {
    const { status, type, region } = req.query;
    const vehicles = await prisma.vehicle.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(region ? { region } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

// GET /api/vehicles/:id
router.get("/:id", async (req, res, next) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
});

// POST /api/vehicles — Fleet Manager only
router.post("/", authorize("FLEET_MANAGER"), async (req, res, next) => {
  try {
    const { registrationNumber, vehicleModel, type, maxLoadCapacity, odometer, acquisitionCost, region, status } = req.body;
    if (!registrationNumber || !vehicleModel || !type || !maxLoadCapacity || !acquisitionCost) {
      return res.status(400).json({ message: "Missing required vehicle fields" });
    }
    if (status && !VEHICLE_STATUS.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${VEHICLE_STATUS.join(", ")}`, field: "status" });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber,
        vehicleModel,
        type,
        maxLoadCapacity,
        odometer: odometer || 0,
        acquisitionCost,
        region: region || "",
        status: status || "Available",
      },
    });
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
});

// PUT /api/vehicles/:id — Fleet Manager only
router.put("/:id", authorize("FLEET_MANAGER"), async (req, res, next) => {
  try {
    const { vehicleModel, type, maxLoadCapacity, odometer, acquisitionCost, region, status } = req.body;
    if (status && !VEHICLE_STATUS.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${VEHICLE_STATUS.join(", ")}`, field: "status" });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: { vehicleModel, type, maxLoadCapacity, odometer, acquisitionCost, region, status },
    });
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/vehicles/:id — Fleet Manager only
router.delete("/:id", authorize("FLEET_MANAGER"), async (req, res, next) => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
