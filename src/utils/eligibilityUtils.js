import { getLicenseExpiryStatus } from './licenseUtils';

// Frontend-only display field. Do NOT add this to POST/PUT request payloads -
// it is derived purely for UI display until the backend defines it explicitly.
export function getDispatchEligibility(driver) {
  const licenseStatus = getLicenseExpiryStatus(driver.licenseExpiryDate);

  if (licenseStatus === 'Expired') return 'Not Eligible';
  if (driver.status === 'Suspended') return 'Not Eligible';
  if (driver.status === 'On Trip') return 'Not Eligible';
  return 'Eligible';
}

export function getEligibilityVariant(eligibility) {
  return eligibility === 'Eligible' ? 'success' : 'danger';
}
