import FilterSelect from "../common/FilterSelect";
import SearchInput from "../common/SearchInput";

import {
  DRIVER_STATUSES,
  LICENSE_CATEGORIES,
} from "../../utils/constants";

const LICENSE_VALIDITY_OPTIONS = [
  "Valid",
  "Expiring Soon",
  "Expired",
];

export default function DriverFilters({
  searchTerm = "",
  onSearchChange,
  filters = {},
  onFilterChange,
  onClear,
}) {
  const hasActiveFilters = Boolean(
    searchTerm ||
      filters.status ||
      filters.licenseCategory ||
      filters.licenseValidity
  );

  return (
    <div className="d-flex flex-wrap align-items-center gap-sm mb-3">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search name, licence number or category"
      />

      <FilterSelect
        label="Status"
        value={filters.status || ""}
        onChange={(value) =>
          onFilterChange?.("status", value)
        }
        options={DRIVER_STATUSES}
      />

      <FilterSelect
        label="License Category"
        value={
          filters.licenseCategory || ""
        }
        onChange={(value) =>
          onFilterChange?.(
            "licenseCategory",
            value
          )
        }
        options={LICENSE_CATEGORIES}
      />

      <FilterSelect
        label="License Validity"
        value={
          filters.licenseValidity || ""
        }
        onChange={(value) =>
          onFilterChange?.(
            "licenseValidity",
            value
          )
        }
        options={LICENSE_VALIDITY_OPTIONS}
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