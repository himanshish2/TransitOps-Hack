// Formatting helpers used across Vehicle Registry and Driver Management tables/forms.

export function formatINR(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatOdometer(value) {
  const km = Number(value) || 0;
  return `${new Intl.NumberFormat('en-IN').format(km)} km`;
}

export function formatLoadCapacity(value) {
  const kg = Number(value) || 0;
  return `${new Intl.NumberFormat('en-IN').format(kg)} kg`;
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
