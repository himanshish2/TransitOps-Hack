const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      { email: "fleet@transitops.com", password, name: "Fleet Manager", role: "FLEET_MANAGER" },
      { email: "driver@transitops.com", password, name: "Driver User", role: "DRIVER" },
      { email: "safety@transitops.com", password, name: "Safety Officer", role: "SAFETY_OFFICER" },
      { email: "finance@transitops.com", password, name: "Financial Analyst", role: "FINANCIAL_ANALYST" },
    ],
    skipDuplicates: true,
  });

  const van = await prisma.vehicle.upsert({
    where: { registrationNumber: "VAN-05" },
    update: {},
    create: {
      registrationNumber: "VAN-05",
      vehicleModel: "Van-05",
      type: "Van",
      maxLoadCapacity: 500,
      odometer: 10000,
      acquisitionCost: 25000,
      region: "North",
      status: "Available",
    },
  });

  const alex = await prisma.driver.upsert({
    where: { licenseNumber: "DL-001" },
    update: {},
    create: {
      name: "Alex",
      licenseNumber: "DL-001",
      licenseCategory: "LMV",
      licenseExpiryDate: new Date("2027-01-01"),
      contactNumber: "9999999999",
      safetyScore: 95,
      status: "Available",
    },
  });

  console.log("Seed complete:", { van: van.registrationNumber, driver: alex.name });
  console.log("Login with: fleet@transitops.com / password123 (or driver@/safety@/finance@)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
