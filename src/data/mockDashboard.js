import { mockVehicles } from './mockVehicles';
import { mockDrivers } from './mockDrivers';

// Generates dashboard data from the mock vehicle/driver datasets, honoring
// the same vehicleType / status / region filters the real backend expects.
// This keeps mock mode "realistic" rather than a single hardcoded blob.
export function buildMockDashboardData(filters = {}) {
  const { vehicleType, status, region } = filters;

  let vehicles = [...mockVehicles];
  if (vehicleType) vehicles = vehicles.filter((v) => v.type === vehicleType);
  if (status) vehicles = vehicles.filter((v) => v.status === status);
  if (region) vehicles = vehicles.filter((v) => v.region === region);

  const activeVehicles = vehicles.filter((v) => v.status === 'On Trip' || v.status === 'Available').length;
  const availableVehicles = vehicles.filter((v) => v.status === 'Available').length;
  const vehiclesInMaintenance = vehicles.filter((v) => v.status === 'In Shop').length;
  const activeTrips = vehicles.filter((v) => v.status === 'On Trip').length;
  const pendingTrips = Math.max(0, Math.round(activeTrips * 0.4));

  const driversOnDuty = mockDrivers.filter((d) => d.status === 'On Trip' || d.status === 'Available').length;

  const fleetUtilization = vehicles.length > 0
    ? Math.round((activeTrips / vehicles.length) * 100)
    : 0;

  const vehicleStatusData = [
    { status: 'Available', count: vehicles.filter((v) => v.status === 'Available').length },
    { status: 'On Trip', count: vehicles.filter((v) => v.status === 'On Trip').length },
    { status: 'In Shop', count: vehicles.filter((v) => v.status === 'In Shop').length },
    { status: 'Retired', count: vehicles.filter((v) => v.status === 'Retired').length },
  ];

  const fleetUtilizationData = [
    { label: 'Mon', value: 62 },
    { label: 'Tue', value: 68 },
    { label: 'Wed', value: 71 },
    { label: 'Thu', value: 65 },
    { label: 'Fri', value: 74 },
    { label: 'Sat', value: 58 },
    { label: 'Sun', value: 52 },
  ];

  const regionCounts = {};
  vehicles.forEach((v) => {
    regionCounts[v.region] = (regionCounts[v.region] || 0) + (v.status === 'On Trip' ? 1 : 0);
  });
  const tripsByRegion = Object.entries(regionCounts).map(([regionName, count]) => ({ region: regionName, count }));

  const alerts = [
    {
      id: 'alrt-001',
      type: 'LICENSE_EXPIRY',
      severity: 'warning',
      title: 'License Expiring Soon',
      message: 'Suresh Yadav\'s driving license expires within 30 days.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alrt-002',
      type: 'MAINTENANCE_DUE',
      severity: 'warning',
      title: 'Vehicle Due for Service',
      message: 'KA 03 EF 9012 has crossed its scheduled maintenance odometer reading.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alrt-003',
      type: 'LICENSE_EXPIRY',
      severity: 'danger',
      title: 'License Expired',
      message: 'Sanjay Verma\'s driving license has expired and requires renewal.',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization,
    vehicleStatusData,
    fleetUtilizationData,
    tripsByRegion,
    alerts,
  };
}
