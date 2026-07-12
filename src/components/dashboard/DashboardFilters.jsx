import FilterSelect from '../common/FilterSelect';
import { VEHICLE_TYPES, VEHICLE_STATUSES, REGIONS } from '../../utils/constants';
import './DashboardFilters.css';

export default function DashboardFilters({ filters, onChange, onClear }) {
  const hasActiveFilters = filters.vehicleType || filters.status || filters.region;

  return (
    <div className="dashboard-filters-bar surface-card d-flex flex-wrap align-items-center gap-sm mb-4">
      <FilterSelect
        label="Vehicle Type"
        value={filters.vehicleType}
        onChange={(val) => onChange('vehicleType', val)}
        options={VEHICLE_TYPES}
      />
      <FilterSelect
        label="Status"
        value={filters.status}
        onChange={(val) => onChange('status', val)}
        options={VEHICLE_STATUSES}
      />
      <FilterSelect
        label="Region"
        value={filters.region}
        onChange={(val) => onChange('region', val)}
        options={REGIONS}
      />
      {hasActiveFilters && (
        <button type="button" className="btn btn-brand-outline btn-sm ms-auto" onClick={onClear}>
          Clear Filters
        </button>
      )}
    </div>
  );
}
