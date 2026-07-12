import { LICENSE_EXPIRY_THRESHOLD_DAYS } from './constants';

// Derives a license status ("Valid" | "Expiring Soon" | "Expired") purely
// from licenseExpiryDate. Not persisted - always computed on the fly so it
// stays accurate as time passes.
export function getLicenseExpiryStatus(licenseExpiryDate) {
  if (!licenseExpiryDate) return 'Expired';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(licenseExpiryDate);
  expiryDate.setHours(0, 0, 0, 0);

  const diffMs = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays <= LICENSE_EXPIRY_THRESHOLD_DAYS) return 'Expiring Soon';
  return 'Valid';
}

export function getLicenseStatusVariant(status) {
  switch (status) {
    case 'Valid':
      return 'success';
    case 'Expiring Soon':
      return 'warning';
    case 'Expired':
      return 'danger';
    default:
      return 'neutral';
  }
}
