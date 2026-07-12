// Central constants - single source of truth for enums used across the app.
// Keep these aligned exactly with the backend contract.

export const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];

export const DRIVER_STATUSES = ['Available', 'On Trip', 'Off Duty', 'Suspended'];

export const USER_ROLES = {
  FLEET_MANAGER: 'FLEET_MANAGER',
  DRIVER: 'DRIVER',
  SAFETY_OFFICER: 'SAFETY_OFFICER',
  FINANCIAL_ANALYST: 'FINANCIAL_ANALYST',
};

export const LICENSE_EXPIRY_THRESHOLD_DAYS = 30;

export const DEFAULT_PAGE_SIZE = 10;

// localStorage keys used across auth + mock CRUD persistence
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'transitops_token',
  AUTH_USER: 'transitops_user',
  THEME: 'transitops_theme',
  VEHICLES: 'transitops_vehicles',
  DRIVERS: 'transitops_drivers',
};

export const VEHICLE_TYPES = ['Truck', 'Van', 'Mini Truck', 'Trailer', 'Pickup'];

export const REGIONS = ['North', 'South', 'East', 'West', 'Central'];

export const LICENSE_CATEGORIES = ['LMV', 'HMV', 'Transport', 'MCWG'];
