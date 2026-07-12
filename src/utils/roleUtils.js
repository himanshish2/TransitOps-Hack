import { USER_ROLES } from './constants';

const ROLE_LABELS = {
  [USER_ROLES.FLEET_MANAGER]: 'Fleet Manager',
  [USER_ROLES.DRIVER]: 'Driver',
  [USER_ROLES.SAFETY_OFFICER]: 'Safety Officer',
  [USER_ROLES.FINANCIAL_ANALYST]: 'Financial Analyst',
};

// Converts a raw backend role value (e.g. "FLEET_MANAGER") into a
// human-readable label (e.g. "Fleet Manager") for display in the UI.
export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role || 'Unknown Role';
}

// All roles currently have access to Dashboard, Vehicles, and Drivers.
// Kept as a function (rather than a flat true/false) so role-aware access
// rules can be tightened later without touching ProtectedRoute.
export function canAccessModule(_role, _moduleKey) {
  return true;
}
