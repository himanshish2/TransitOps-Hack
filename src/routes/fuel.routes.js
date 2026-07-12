const express = require("express");
const prisma = require("../utils/prisma");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// GET /api/fuel-logs?vehicleId=...
router.get("/", async (req, res, next) => {
  try {
    const { vehicleId } = req.query;
    const logs = await prisma.fuelLog.findMany({
      where: vehicleId ? { vehicleId } : {},
      orderBy: { date: "desc" },
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// POST /api/fuel-logs
router.post("/", authorize("FLEET_MANAGER", "DRIVER"), async (req, res, next) => {
  try {
    const { vehicleId, liters, cost, date } = req.body;
    if (!vehicleId || liters == null || cost == null) {
      return res.status(400).json({ message: "vehicleId, liters, cost are required" });
    }
    const log = await prisma.fuelLog.create({
      data: { vehicleId, liters, cost, date: date ? new Date(date) : undefined },
    });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
