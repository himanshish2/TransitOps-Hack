const express = require("express");
const prisma = require("../utils/prisma");
const { authenticate, authorize } = require("../middleware/auth");
const { DRIVER_STATUS } = require("../utils/constants");

const router = express.Router();
router.use(authenticate);

// GET /api/drivers
router.get("/", async (req, res, next) => {
  try {
    const { status } = req.query;
    const drivers = await prisma.driver.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
    });
    res.json(drivers);
  } catch (err) {
    next(err);
  }
});

// GET /api/drivers/:id
router.get("/:id", async (req, res, next) => {
  try {
    const driver = await prisma.driver.findUnique({ where: { id: req.params.id } });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    next(err);
  }
});

// POST /api/drivers — Fleet Manager or Safety Officer
router.post("/", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), async (req, res, next) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;
    if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber) {
      return res.status(400).json({ message: "Missing required driver fields" });
    }
    if (status && !DRIVER_STATUS.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${DRIVER_STATUS.join(", ")}`, field: "status" });
    }
    // Reject an expiry date in the past at creation time too, not just at dispatch
    if (new Date(licenseExpiryDate) < new Date()) {
      return res.status(422).json({ message: "Driver license has expired.", field: "licenseExpiryDate" });
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiryDate: new Date(licenseExpiryDate),
        contactNumber,
        safetyScore: safetyScore ?? 100,
        status: status || "Available",
      },
    });
    res.status(201).json(driver);
  } catch (err) {
    next(err);
  }
});

// PUT /api/drivers/:id
router.put("/:id", authorize("FLEET_MANAGER", "SAFETY_OFFICER"), async (req, res, next) => {
  try {
    const { name, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;
    if (status && !DRIVER_STATUS.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${DRIVER_STATUS.join(", ")}`, field: "status" });
    }
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data: {
        name,
        licenseCategory,
        licenseExpiryDate: licenseExpiryDate ? new Date(licenseExpiryDate) : undefined,
        contactNumber,
        safetyScore,
        status,
      },
    });
    res.json(driver);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/drivers/:id
router.delete("/:id", authorize("FLEET_MANAGER"), async (req, res, next) => {
  try {
    await prisma.driver.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
