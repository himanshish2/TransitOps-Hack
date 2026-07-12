const STATUS_VARIANT_MAP = {
  // Vehicle statuses
  Available: 'success',
  'On Trip': 'info',
  'In Shop': 'warning',
  Retired: 'neutral',

  // Driver statuses
  'Off Duty': 'neutral',
  Suspended: 'danger',

  // License / eligibility statuses
  Valid: 'success',
  'Expiring Soon': 'warning',
  Expired: 'danger',
  Eligible: 'success',
  'Not Eligible': 'danger',
};

export default function StatusBadge({ status, variantOverride }) {
  const variant = variantOverride || STATUS_VARIANT_MAP[status] || 'neutral';
  return <span className={`status-badge status-${variant}`}>{status}</span>;
}
