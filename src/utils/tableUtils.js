// Generic comparator used by useTableControls for sorting arrays of objects
// by an arbitrary field, handling strings, numbers, and dates consistently.
export function compareValues(a, b, field, direction) {
  let valA = a[field];
  let valB = b[field];

  // Try to detect date-like strings (e.g. licenseExpiryDate) for correct ordering
  const dateA = new Date(valA);
  const dateB = new Date(valB);
  const looksLikeDate =
    typeof valA === 'string' &&
    typeof valB === 'string' &&
    !Number.isNaN(dateA.getTime()) &&
    !Number.isNaN(dateB.getTime()) &&
    /^\d{4}-\d{2}-\d{2}/.test(valA);

  if (looksLikeDate) {
    valA = dateA.getTime();
    valB = dateB.getTime();
  } else if (typeof valA === 'string' && typeof valB === 'string') {
    valA = valA.toLowerCase();
    valB = valB.toLowerCase();
  }

  if (valA < valB) return direction === 'asc' ? -1 : 1;
  if (valA > valB) return direction === 'asc' ? 1 : -1;
  return 0;
}
