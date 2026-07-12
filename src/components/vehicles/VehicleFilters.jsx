import FilterSelect from '../common/FilterSelect';
import SearchInput from '../common/SearchInput';
import { VEHICLE_TYPES, VEHICLE_STATUSES, REGIONS } from '../../utils/constants';

export default function VehicleFilters({ searchTerm, onSearchChange, filters, onFilterChange, onClear }) {
  const hasActiveFilters = searchTerm || filters.type || filters.status || filters.region;

  return (
    <div className="d-flex flex-wrap align-items-center gap-sm mb-3">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search by registration number or model"
      />
      <FilterSelect label="Type" value={filters.type} onChange={(val) => onFilterChange('type', val)} options={VEHICLE_TYPES} />
      <FilterSelect label="Status" value={filters.status} onChange={(val) => onFilterChange('status', val)} options={VEHICLE_STATUSES} />
      <FilterSelect label="Region" value={filters.region} onChange={(val) => onFilterChange('region', val)} options={REGIONS} />
      {hasActiveFilters && (
        <button type="button" className="btn btn-brand-outline btn-sm" onClick={onClear}>
          Clear Filters
        </button>
      )}
    </div>
  );
}
