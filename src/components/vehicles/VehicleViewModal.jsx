import FormModal from '../common/FormModal';
import StatusBadge from '../common/StatusBadge';
import { formatINR, formatOdometer, formatLoadCapacity } from '../../utils/formatUtils';

export default function VehicleViewModal({ show, vehicle, onClose }) {
  if (!vehicle) return null;

  const rows = [
    { label: 'Registration Number', value: vehicle.registrationNumber },
    { label: 'Vehicle Model', value: vehicle.vehicleModel },
    { label: 'Vehicle Type', value: vehicle.type },
    { label: 'Maximum Load', value: formatLoadCapacity(vehicle.maxLoadCapacity) },
    { label: 'Odometer', value: formatOdometer(vehicle.odometer) },
    { label: 'Acquisition Cost', value: formatINR(vehicle.acquisitionCost) },
    { label: 'Region', value: vehicle.region },
  ];

  return (
    <FormModal
      show={show}
      title="Vehicle Details"
      onClose={onClose}
      footer={<button type="button" className="btn btn-brand" onClick={onClose}>Close</button>}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fs-5 mb-0">{vehicle.vehicleModel}</h3>
        <StatusBadge status={vehicle.status} />
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
