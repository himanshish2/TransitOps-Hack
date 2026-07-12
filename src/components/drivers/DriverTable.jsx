import { FiEye, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import StatusBadge from '../common/StatusBadge';
import SafetyScoreBadge from './SafetyScoreBadge';
import { formatDate } from '../../utils/formatUtils';
import { getLicenseExpiryStatus } from '../../utils/licenseUtils';
import { getDispatchEligibility } from '../../utils/eligibilityUtils';
import './DriverTable.css';

const COLUMNS = [
  { field: 'name', label: 'Driver Name' },
  { field: 'licenseNumber', label: 'License Number' },
  { field: 'licenseCategory', label: 'License Category' },
  { field: 'licenseExpiryDate', label: 'License Expiry' },
  { field: 'contactNumber', label: 'Contact Number' },
  { field: 'safetyScore', label: 'Safety Score' },
  { field: 'status', label: 'Status' },
];

export default function DriverTable({ drivers, sortField, sortDirection, onSort, onView, onEdit, onDelete }) {
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
            <th>Eligibility</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => {
            const licenseStatus = getLicenseExpiryStatus(driver.licenseExpiryDate);
            const eligibility = getDispatchEligibility(driver);
            return (
              <tr key={driver.id}>
                <td className="fw-medium">{driver.name}</td>
                <td>{driver.licenseNumber}</td>
                <td>{driver.licenseCategory}</td>
                <td>
                  <div className="d-flex flex-column">
                    <span>{formatDate(driver.licenseExpiryDate)}</span>
                    <StatusBadge status={licenseStatus} />
                  </div>
                </td>
                <td>{driver.contactNumber}</td>
                <td><SafetyScoreBadge score={driver.safetyScore} /></td>
                <td><StatusBadge status={driver.status} /></td>
                <td><StatusBadge status={eligibility} /></td>
                <td>
                  <div className="d-flex gap-xs">
                    <button type="button" className="btn-icon" aria-label={`View ${driver.name}`} onClick={() => onView(driver)}>
                      <FiEye size={15} />
                    </button>
                    <button type="button" className="btn-icon" aria-label={`Edit ${driver.name}`} onClick={() => onEdit(driver)}>
                      <FiEdit2 size={15} />
                    </button>
                    <button type="button" className="btn-icon danger" aria-label={`Delete ${driver.name}`} onClick={() => onDelete(driver)}>
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
