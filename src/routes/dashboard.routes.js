const express = require("express");
const prisma = require("../utils/prisma");
const { authenticate } = require("../middleware/auth");
const { VEHICLE_STATUS } = require("../utils/constants");

const router = express.Router();
router.use(authenticate);

// GET /api/dashboard?vehicleType=Truck&status=Available&region=North
//
// Filters apply to the vehicle-derived metrics (activeVehicles, availableVehicles,
// vehiclesInMaintenance, vehicleStatusData, fleetUtilization) and to trips whose
// vehicle matches the filtered set. driversOnDuty is not vehicle-scoped (drivers
// aren't tied to a region/type) so it stays fleet-wide.
router.get("/", async (req, res, next) => {
  try {
    const { vehicleType, status, region } = req.query;

    const vehicleWhere = {
      ...(vehicleType ? { type: vehicleType } : {}),
      ...(status ? { status } : {}),
      ...(region ? { region } : {}),
    };

    const vehicles = await prisma.vehicle.findMany({ where: vehicleWhere, select: { id: true, status: true } });
    const vehicleIds = vehicles.map((v) => v.id);

    const totalVehicles = vehicles.length;
    const countByStatus = (s) => vehicles.filter((v) => v.status === s).length;

    const activeVehicles = countByStatus("On Trip");
    const availableVehicles = countByStatus("Available");
    const vehiclesInMaintenance = countByStatus("In Shop");

    const [activeTrips, pendingTrips, driversOnDuty] = await Promise.all([
      prisma.trip.count({ where: { status: "Dispatched", vehicleId: { in: vehicleIds } } }),
      prisma.trip.count({ where: { status: "Draft", vehicleId: { in: vehicleIds } } }),
      prisma.driver.count({ where: { status: "On Trip" } }),
    ]);

    const fleetUtilization = totalVehicles > 0 ? Number(((activeVehicles / totalVehicles) * 100).toFixed(2)) : 0;

    const vehicleStatusData = VEHICLE_STATUS.map((s) => ({ status: s, count: countByStatus(s) }));

    res.json({
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization,
      vehicleStatusData,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
