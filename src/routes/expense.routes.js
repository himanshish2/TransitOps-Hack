const express = require("express");
const prisma = require("../utils/prisma");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// GET /api/expenses?vehicleId=...
router.get("/", async (req, res, next) => {
  try {
    const { vehicleId } = req.query;
    const expenses = await prisma.expense.findMany({
      where: vehicleId ? { vehicleId } : {},
      orderBy: { date: "desc" },
    });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

// POST /api/expenses  — e.g. tolls, misc costs (maintenance/fuel have their own tables)
router.post("/", authorize("FLEET_MANAGER", "DRIVER", "FINANCIAL_ANALYST"), async (req, res, next) => {
  try {
    const { vehicleId, type, amount, date } = req.body;
    if (!vehicleId || !type || amount == null) {
      return res.status(400).json({ message: "vehicleId, type, amount are required" });
    }
    const expense = await prisma.expense.create({
      data: { vehicleId, type, amount, date: date ? new Date(date) : undefined },
    });
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
