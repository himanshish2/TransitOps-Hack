// Catches thrown errors (including Prisma constraint violations) and returns
// the shape the frontend contract expects: { message, field? }
function errorHandler(err, req, res, next) {
  console.error(err);

  // Prisma unique constraint violation, e.g. duplicate registrationNumber
  if (err.code === "P2002") {
    const field = Array.isArray(err.meta?.target) ? err.meta.target[0] : err.meta?.target;
    return res.status(409).json({
      message: `${field ? field : "Field"} already exists`,
      field,
    });
  }

  // Prisma "record not found"
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Record not found" });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error", ...(err.field ? { field: err.field } : {}) });
}

module.exports = errorHandler;
