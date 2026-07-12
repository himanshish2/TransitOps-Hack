import { useMemo, useState, useEffect, useCallback } from 'react';
import { compareValues } from '../utils/tableUtils';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

/**
 * Shared search + filter + sort + pagination controller.
 *
 * @param {Array} data - full dataset (already loaded, e.g. from a service call)
 * @param {Object} options
 * @param {string[]} options.searchFields - fields to match the search term against
 * @param {Object} options.initialFilters - e.g. { status: '', type: '', region: '' }
 * @param {Function} [options.customFilter] - optional (item, filters) => boolean for
 *        filters that need custom logic (e.g. license-validity derived field)
 * @param {string} [options.initialSortField]
 * @param {number} [options.pageSize]
 */
export function useTableControls(data, options) {
  const {
    searchFields = [],
    initialFilters = {},
    customFilter,
    initialSortField = null,
    pageSize = DEFAULT_PAGE_SIZE,
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever search, filters, or sort change - avoids
  // landing on an empty out-of-range page after narrowing results.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortField, sortDirection]);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => String(item[field] ?? '').toLowerCase().includes(term))
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) return;
      if (customFilter) {
        // customFilter handles ALL filter keys it recognizes; for keys it
        // doesn't touch, fall back to direct equality below.
        return;
      }
      result = result.filter((item) => item[key] === value);
    });

    if (customFilter) {
      result = result.filter((item) => customFilter(item, filters));
    }

    if (sortField) {
      result.sort((a, b) => compareValues(a, b, sortField, sortDirection));
    }

    return result;
  }, [data, searchTerm, filters, sortField, sortDirection, searchFields, customFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, safePage, pageSize]);

  const handleSort = useCallback((field) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDirection((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchTerm('');
    setSortField(initialSortField);
    setSortDirection('asc');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    pageSize,
    paginatedData,
    filteredData,
  };
}
