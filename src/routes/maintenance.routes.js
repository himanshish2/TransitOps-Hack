const express = require("express");
const prisma = require("../utils/prisma");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// GET /api/maintenance
router.get("/", async (req, res, next) => {
  try {
    const { vehicleId, status } = req.query;
    const logs = await prisma.maintenanceLog.findMany({
      where: { ...(vehicleId ? { vehicleId } : {}), ...(status ? { status } : {}) },
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// POST /api/maintenance — creating an Active record flips vehicle to In Shop
router.post("/", authorize("FLEET_MANAGER"), async (req, res, next) => {
  try {
    const { vehicleId, description, cost } = req.body;
    if (!vehicleId || !description) {
      return res.status(400).json({ message: "vehicleId and description are required" });
    }
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (vehicle.status === "On Trip") {
      return res.status(422).json({ message: "Cannot start maintenance while vehicle is On Trip", field: "vehicleId" });
    }

    const [log] = await prisma.$transaction([
      prisma.maintenanceLog.create({
        data: { vehicleId, description, cost: cost || 0, status: "Active" },
      }),
      prisma.vehicle.update({ where: { id: vehicleId }, data: { status: "In Shop" } }),
    ]);

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
});

// POST /api/maintenance/:id/close — restores vehicle to Available unless retired
router.post("/:id/close", authorize("FLEET_MANAGER"), async (req, res, next) => {
  try {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true },
    });
    if (!log) return res.status(404).json({ message: "Maintenance log not found" });
    if (log.status === "Closed") return res.status(422).json({ message: "Maintenance log already closed" });

    const restoredStatus = log.vehicle.status === "Retired" ? "Retired" : "Available";

    const [updatedLog] = await prisma.$transaction([
      prisma.maintenanceLog.update({
        where: { id: log.id },
        data: { status: "Closed", closedAt: new Date() },
      }),
      prisma.vehicle.update({ where: { id: log.vehicleId }, data: { status: restoredStatus } }),
    ]);

    res.json(updatedLog);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
