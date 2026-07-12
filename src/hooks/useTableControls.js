import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

import { compareValues } from "../utils/tableUtils";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";

export function useTableControls(data = [], options = {}) {
  const {
    searchFields = [],
    initialFilters = {},
    customFilter = null,
    initialSortField = null,
    pageSize = DEFAULT_PAGE_SIZE || 10,
  } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortField, sortDirection]);

  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? [...data] : [];

    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item?.[field] ?? "")
            .toLowerCase()
            .includes(normalizedSearch)
        )
      );
    }

    result = result.filter((item) => {
      const directFiltersMatch = Object.entries(filters).every(
        ([key, value]) => {
          if (
            value === "" ||
            value === null ||
            value === undefined
          ) {
            return true;
          }

          // Custom/derived filters are handled separately.
          if (
            customFilter &&
            key === "licenseValidity"
          ) {
            return true;
          }

          return String(item?.[key] ?? "").toLowerCase() ===
            String(value).toLowerCase();
        }
      );

      if (!directFiltersMatch) {
        return false;
      }

      return customFilter
        ? customFilter(item, filters)
        : true;
    });

    if (sortField) {
      result.sort((a, b) =>
        compareValues(
          a,
          b,
          sortField,
          sortDirection
        )
      );
    }

    return result;
  }, [
    data,
    searchTerm,
    filters,
    sortField,
    sortDirection,
    searchFields,
    customFilter,
  ]);

  const safePageSize =
    Number(pageSize) > 0 ? Number(pageSize) : 10;

  const totalItems = filteredData.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / safePageSize)
  );

  const safePage = Math.min(
    Math.max(1, currentPage),
    totalPages
  );

  const paginatedData = useMemo(() => {
    const startIndex =
      (safePage - 1) * safePageSize;

    return filteredData.slice(
      startIndex,
      startIndex + safePageSize
    );
  }, [filteredData, safePage, safePageSize]);

  const handleSort = useCallback((field) => {
    setSortField((previousField) => {
      if (previousField === field) {
        setSortDirection((previousDirection) =>
          previousDirection === "asc"
            ? "desc"
            : "asc"
        );

        return field;
      }

      setSortDirection("asc");
      return field;
    });
  }, []);

  const updateFilter = useCallback(
    (key, value) => {
      setFilters((previousFilters) => ({
        ...previousFilters,
        [key]: value,
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilters({ ...initialFilters });
    setSortField(initialSortField);
    setSortDirection("asc");
    setCurrentPage(1);
  }, [initialFilters, initialSortField]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sortField,
    sortDirection,
    handleSort,
    currentPage: safePage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize: safePageSize,
    paginatedData,
    filteredData,
  };
}