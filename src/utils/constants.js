// Prisma enums can't contain spaces, but the frontend contract requires
// display-style strings like "On Trip" and "In Shop". So these fields are
// plain Strings in the schema, validated against these lists in code.

const VEHICLE_STATUS = ["Available", "On Trip", "In Shop", "Retired"];
const DRIVER_STATUS = ["Available", "On Trip", "Off Duty", "Suspended"];
const TRIP_STATUS = ["Draft", "Dispatched", "Completed", "Cancelled"];
const MAINTENANCE_STATUS = ["Active", "Closed"];
const ROLES = ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"];

module.exports = { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS, MAINTENANCE_STATUS, ROLES };
