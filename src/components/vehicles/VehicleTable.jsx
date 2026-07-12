import { FiEye, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import StatusBadge from '../common/StatusBadge';
import { formatINR, formatOdometer, formatLoadCapacity } from '../../utils/formatUtils';

const COLUMNS = [
  { field: 'registrationNumber', label: 'Registration Number' },
  { field: 'vehicleModel', label: 'Vehicle Model' },
  { field: 'type', label: 'Vehicle Type' },
  { field: 'maxLoadCapacity', label: 'Maximum Load' },
  { field: 'odometer', label: 'Odometer' },
  { field: 'acquisitionCost', label: 'Acquisition Cost' },
  { field: 'status', label: 'Status' },
  { field: 'region', label: 'Region' },
];

export default function VehicleTable({ vehicles, sortField, sortDirection, onSort, onView, onEdit, onDelete }) {
  return (
    <div className="table-responsive-wrapper">
      <table className="data-table table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.field} className="sortable-th" onClick={() => onSort(col.field)}>
                <span className="d-inline-flex align-items-center gap-xs">
                  {col.label}
                  {sortField === col.field && (
                    sortDirection === 'asc' ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />
                  )}
                </span>
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td className="fw-medium">{vehicle.registrationNumber}</td>
              <td>{vehicle.vehicleModel}</td>
              <td>{vehicle.type}</td>
              <td>{formatLoadCapacity(vehicle.maxLoadCapacity)}</td>
              <td>{formatOdometer(vehicle.odometer)}</td>
              <td>{formatINR(vehicle.acquisitionCost)}</td>
              <td><StatusBadge status={vehicle.status} /></td>
              <td>{vehicle.region}</td>
              <td>
                <div className="d-flex gap-xs">
                  <button type="button" className="btn-icon" aria-label={`View ${vehicle.registrationNumber}`} onClick={() => onView(vehicle)}>
                    <FiEye size={15} />
                  </button>
                  <button type="button" className="btn-icon" aria-label={`Edit ${vehicle.registrationNumber}`} onClick={() => onEdit(vehicle)}>
                    <FiEdit2 size={15} />
                  </button>
                  <button type="button" className="btn-icon danger" aria-label={`Delete ${vehicle.registrationNumber}`} onClick={() => onDelete(vehicle)}>
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
