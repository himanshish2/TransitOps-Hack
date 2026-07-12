// src/data/mockDashboard.js

import { mockVehicles } from "./mockVehicles";
import { mockDrivers } from "./mockDrivers";
import { STORAGE_KEYS } from "../utils/constants";
import { getStorageItem } from "../utils/storageUtils";
import { getLicenseExpiryStatus } from "../utils/licenseUtils";

function getCurrentVehicles() {
  const storedVehicles = getStorageItem(
    STORAGE_KEYS.VEHICLES,
    null
  );

  return Array.isArray(storedVehicles)
    ? storedVehicles
    : mockVehicles;
}

function getCurrentDrivers() {
  const storedDrivers = getStorageItem(
    STORAGE_KEYS.DRIVERS,
    null
  );

  return Array.isArray(storedDrivers)
    ? storedDrivers
    : mockDrivers;
}

function buildOperationalAlerts(vehicles, drivers) {
  const alerts = [];

  drivers.forEach((driver) => {
    const licenceStatus = getLicenseExpiryStatus(
      driver.licenseExpiryDate
    );

    if (licenceStatus === "Expired") {
      alerts.push({
        id: `license-expired-${driver.id}`,
        type: "LICENSE_EXPIRY",
        severity: "danger",
        title: "Licence Expired",
        message: `${driver.name}'s driving licence has expired.`,
        createdAt: new Date().toISOString(),
      });
    }

    if (licenceStatus === "Expiring Soon") {
      alerts.push({
        id: `license-expiring-${driver.id}`,
        type: "LICENSE_EXPIRY",
        severity: "warning",
        title: "Licence Expiring Soon",
        message: `${driver.name}'s driving licence expires within 30 days.`,
        createdAt: new Date().toISOString(),
      });
    }

    if (driver.status === "Suspended") {
      alerts.push({
        id: `driver-suspended-${driver.id}`,
        type: "DRIVER_SUSPENDED",
        severity: "danger",
        title: "Driver Suspended",
        message: `${driver.name} is suspended and cannot be assigned to a trip.`,
        createdAt: new Date().toISOString(),
      });
    }
  });

  vehicles
    .filter((vehicle) => vehicle.status === "In Shop")
    .forEach((vehicle) => {
      alerts.push({
        id: `vehicle-maintenance-${vehicle.id}`,
        type: "MAINTENANCE_ACTIVE",
        severity: "warning",
        title: "Vehicle in Maintenance",
        message: `${vehicle.registrationNumber} is currently in the maintenance shop.`,
        createdAt: new Date().toISOString(),
      });
    });

  return alerts.slice(0, 10);
}

export function buildMockDashboardData(filters = {}) {
  const { vehicleType, status, region } = filters;

  const allVehicles = getCurrentVehicles();
  const allDrivers = getCurrentDrivers();

  let vehicles = [...allVehicles];

  if (vehicleType) {
    vehicles = vehicles.filter(
      (vehicle) => vehicle.type === vehicleType
    );
  }

  if (status) {
    vehicles = vehicles.filter(
      (vehicle) => vehicle.status === status
    );
  }

  if (region) {
    vehicles = vehicles.filter(
      (vehicle) => vehicle.region === region
    );
  }

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Available"
  );

  const onTripVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "On Trip"
  );

  const maintenanceVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "In Shop"
  );

  const retiredVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Retired"
  );

  const activeVehicles =
    availableVehicles.length + onTripVehicles.length;

  const activeTrips = onTripVehicles.length;

  /*
   * Pending-trip information belongs to the Trip Management module.
   * Until that module is connected, this remains a mock operational count.
   */
  const pendingTrips = Math.max(
    0,
    Math.round(activeTrips * 0.4)
  );

  const driversOnDuty = allDrivers.filter(
    (driver) =>
      driver.status === "Available" ||
      driver.status === "On Trip"
  );

  /*
   * Retired vehicles are excluded because they are no longer operational.
   * Utilisation is currently based on operational vehicles marked On Trip.
   */
  const operationalVehicles = vehicles.filter(
    (vehicle) => vehicle.status !== "Retired"
  );

  const fleetUtilization =
    operationalVehicles.length > 0
      ? Math.round(
          (onTripVehicles.length /
            operationalVehicles.length) *
            100
        )
      : 0;

  const vehicleStatusData = [
    {
      status: "Available",
      count: availableVehicles.length,
    },
    {
      status: "On Trip",
      count: onTripVehicles.length,
    },
    {
      status: "In Shop",
      count: maintenanceVehicles.length,
    },
    {
      status: "Retired",
      count: retiredVehicles.length,
    },
  ];

  /*
   * Historical utilisation is still sample chart data because no trip-history
   * endpoint exists yet. The final point reflects the current live mock value.
   */
  const fleetUtilizationData = [
    { label: "Mon", value: 62 },
    { label: "Tue", value: 68 },
    { label: "Wed", value: 71 },
    { label: "Thu", value: 65 },
    { label: "Fri", value: 74 },
    { label: "Sat", value: 58 },
    { label: "Current", value: fleetUtilization },
  ];

  const regionCounts = {};

  onTripVehicles.forEach((vehicle) => {
    regionCounts[vehicle.region] =
      (regionCounts[vehicle.region] || 0) + 1;
  });

  const tripsByRegion = Object.entries(
    regionCounts
  ).map(([regionName, count]) => ({
    region: regionName,
    count,
  }));

  const alerts = buildOperationalAlerts(
    allVehicles,
    allDrivers
  );

  const kpiDetails = {
    activeVehicles: vehicles
      .filter(
        (vehicle) =>
          vehicle.status === "Available" ||
          vehicle.status === "On Trip"
      )
      .map(
        (vehicle) =>
          `${vehicle.registrationNumber} — ${vehicle.status}`
      ),

    availableVehicles: availableVehicles.map(
      (vehicle) =>
        `${vehicle.registrationNumber} — ${vehicle.vehicleModel}`
    ),

    vehiclesInMaintenance: maintenanceVehicles.map(
      (vehicle) =>
        `${vehicle.registrationNumber} — active maintenance record`
    ),

    activeTrips: onTripVehicles.map(
      (vehicle) =>
        `${vehicle.registrationNumber} — active in ${vehicle.region} region`
    ),

    pendingTrips: [
      "Pending-trip reasons will be supplied by the Trip Management module.",
    ],

    driversOnDuty: driversOnDuty.map(
      (driver) => `${driver.name} — ${driver.status}`
    ),

    fleetUtilization: [
      `${onTripVehicles.length} vehicles are currently On Trip.`,
      `${operationalVehicles.length} non-retired vehicles are included in the calculation.`,
      "Fleet Utilization = On Trip vehicles ÷ operational vehicles × 100.",
    ],
  };

  return {
    activeVehicles,
    availableVehicles: availableVehicles.length,
    vehiclesInMaintenance:
      maintenanceVehicles.length,
    activeTrips,
    pendingTrips,
    driversOnDuty: driversOnDuty.length,
    fleetUtilization,
    vehicleStatusData,
    fleetUtilizationData,
    tripsByRegion,
    alerts,
    kpiDetails,
  };
}