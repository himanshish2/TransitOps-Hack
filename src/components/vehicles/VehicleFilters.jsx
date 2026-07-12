import FilterSelect from "../common/FilterSelect";
import SearchInput from "../common/SearchInput";

import {
  VEHICLE_TYPES,
  VEHICLE_STATUSES,
  REGIONS,
} from "../../utils/constants";

export default function VehicleFilters({
  searchTerm = "",
  onSearchChange,
  filters = {},
  onFilterChange,
  onClear,
}) {
  const hasActiveFilters = Boolean(
    searchTerm ||
      filters.type ||
      filters.status ||
      filters.region
  );

  return (
    <div className="d-flex flex-wrap align-items-center gap-sm mb-3">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search registration, model, type or region"
      />

      <FilterSelect
        label="Type"
        value={filters.type || ""}
        onChange={(value) =>
          onFilterChange?.("type", value)
        }
        options={VEHICLE_TYPES}
      />

      <FilterSelect
        label="Status"
        value={filters.status || ""}
        onChange={(value) =>
          onFilterChange?.("status", value)
        }
        options={VEHICLE_STATUSES}
      />

      <FilterSelect
        label="Region"
        value={filters.region || ""}
        onChange={(value) =>
          onFilterChange?.("region", value)
        }
        options={REGIONS}
      />

      {hasActiveFilters && (
        <button
          type="button"
          className="btn btn-brand-outline btn-sm"
          onClick={onClear}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}