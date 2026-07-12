import FormModal from '../common/FormModal';
import StatusBadge from '../common/StatusBadge';
import SafetyScoreBadge from './SafetyScoreBadge';
import { formatDate } from '../../utils/formatUtils';
import { getLicenseExpiryStatus } from '../../utils/licenseUtils';
import { getDispatchEligibility } from '../../utils/eligibilityUtils';

export default function DriverViewModal({ show, driver, onClose }) {
  if (!driver) return null;

  const licenseStatus = getLicenseExpiryStatus(driver.licenseExpiryDate);
  const eligibility = getDispatchEligibility(driver);

  const rows = [
    { label: 'License Number', value: driver.licenseNumber },
    { label: 'License Category', value: driver.licenseCategory },
    { label: 'License Expiry', value: `${formatDate(driver.licenseExpiryDate)} (${licenseStatus})` },
    { label: 'Contact Number', value: driver.contactNumber },
    { label: 'Dispatch Eligibility', value: eligibility },
  ];

  return (
    <FormModal
      show={show}
      title="Driver Details"
      onClose={onClose}
      footer={<button type="button" className="btn btn-brand" onClick={onClose}>Close</button>}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="fs-5 mb-0">{driver.name}</h3>
        <StatusBadge status={driver.status} />
      </div>
      <div className="mb-3">
        <span className="text-muted-custom" style={{ fontSize: 'var(--font-size-sm)' }}>Safety Score: </span>
        <SafetyScoreBadge score={driver.safetyScore} />
      </div>
      <dl className="mb-0">
        {rows.map((row) => (
          <div key={row.label} className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <dt className="text-muted-custom fw-medium" style={{ fontSize: 'var(--font-size-sm)' }}>{row.label}</dt>
            <dd className="mb-0" style={{ fontSize: 'var(--font-size-sm)' }}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </FormModal>
  );
}
