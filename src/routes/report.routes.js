const express = require("express");
const { Parser } = require("json2csv");
const prisma = require("../utils/prisma");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// Shared computation: per-vehicle fuel efficiency, cost, ROI
async function buildVehicleReport() {
  const vehicles = await prisma.vehicle.findMany({
    include: { fuelLogs: true, maintenanceLogs: true, trips: true, expenses: true },
  });

  return vehicles.map((v) => {
    const totalFuelCost = v.fuelLogs.reduce((sum, f) => sum + f.cost, 0);
    const totalFuelLiters = v.fuelLogs.reduce((sum, f) => sum + f.liters, 0);
    const totalMaintenanceCost = v.maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);
    const totalExpenses = v.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalDistance = v.trips
      .filter((t) => t.status === "Completed")
      .reduce((sum, t) => sum + (t.actualDistance || 0), 0);

    // operationalCost matches the PDF spec exactly: Fuel + Maintenance only.
    const operationalCost = totalFuelCost + totalMaintenanceCost;
    // totalCostWithExpenses is the fuller figure (Fuel + Maintenance + Other
    // Expenses) for anyone who wants the complete picture including tolls/misc.
    const totalCostWithExpenses = operationalCost + totalExpenses;

    const fuelEfficiency = totalFuelLiters > 0 ? totalDistance / totalFuelLiters : null;

    // Revenue isn't in the current schema — placeholder for whoever wires up
    // billing/revenue data; ROI = (Revenue - (Maintenance + Fuel)) / AcquisitionCost
    const revenue = 0;
    const roi = v.acquisitionCost > 0 ? (revenue - (totalMaintenanceCost + totalFuelCost)) / v.acquisitionCost : null;

    return {
      vehicleId: v.id,
      registrationNumber: v.registrationNumber,
      vehicleModel: v.vehicleModel,
      status: v.status,
      totalDistance,
      totalFuelLiters,
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenses,
      operationalCost,
      totalCostWithExpenses,
      fuelEfficiency,
      roi,
    };
  });
}

// GET /api/reports/vehicle-costs — JSON
router.get("/vehicle-costs", authorize("FLEET_MANAGER", "FINANCIAL_ANALYST"), async (req, res, next) => {
  try {
    const report = await buildVehicleReport();
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// GET /api/reports/vehicle-costs/export — CSV
router.get("/vehicle-costs/export", authorize("FLEET_MANAGER", "FINANCIAL_ANALYST"), async (req, res, next) => {
  try {
    const report = await buildVehicleReport();
    const parser = new Parser();
    const csv = parser.parse(report);
    res.header("Content-Type", "text/csv");
    res.attachment("vehicle-cost-report.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

module.exports = router;