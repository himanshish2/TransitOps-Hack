const { PrismaClient } = require("@prisma/client");

// Single shared instance — avoids exhausting DB connections in dev
const prisma = new PrismaClient();

module.exports = prisma;
