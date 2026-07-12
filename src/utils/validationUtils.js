import { VEHICLE_STATUSES, DRIVER_STATUSES } from './constants';

export function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

export function trimStringFields(obj, fieldNames) {
  const result = { ...obj };
  fieldNames.forEach((field) => {
    if (typeof result[field] === 'string') {
      result[field] = result[field].trim();
    }
  });
  return result;
}

// Returns an object keyed by field name -> error message. Empty object means valid.
export function validateVehicleForm(values, existingVehicles, editingId) {
  const errors = {};

  if (isBlank(values.registrationNumber)) {
    errors.registrationNumber = 'Registration number is required.';
  } else {
    const normalized = values.registrationNumber.trim().toUpperCase();
    const duplicate = existingVehicles.some(
      (v) => v.registrationNumber.trim().toUpperCase() === normalized && v.id !== editingId
    );
    if (duplicate) {
      errors.registrationNumber = 'This registration number already exists.';
    }
  }

  if (isBlank(values.vehicleModel)) {
    errors.vehicleModel = 'Vehicle model is required.';
  }

  if (isBlank(values.type)) {
    errors.type = 'Vehicle type is required.';
  }

  if (values.maxLoadCapacity === '' || values.maxLoadCapacity === null || Number(values.maxLoadCapacity) <= 0) {
    errors.maxLoadCapacity = 'Maximum load capacity must be greater than zero.';
  }

  if (values.odometer === '' || values.odometer === null || Number(values.odometer) < 0) {
    errors.odometer = 'Odometer cannot be negative.';
  }

  if (values.acquisitionCost === '' || values.acquisitionCost === null || Number(values.acquisitionCost) < 0) {
    errors.acquisitionCost = 'Acquisition cost cannot be negative.';
  }

  if (!VEHICLE_STATUSES.includes(values.status)) {
    errors.status = 'Please select a valid status.';
  }

  if (isBlank(values.region)) {
    errors.region = 'Region is required.';
  }

  return errors;
}

export function validateDriverForm(values) {
  const errors = {};

  if (isBlank(values.name)) {
    errors.name = 'Name is required.';
  }

  if (isBlank(values.licenseNumber)) {
    errors.licenseNumber = 'License number is required.';
  }

  if (isBlank(values.licenseCategory)) {
    errors.licenseCategory = 'License category is required.';
  }

  if (isBlank(values.licenseExpiryDate)) {
    errors.licenseExpiryDate = 'License expiry date is required.';
  }

  if (isBlank(values.contactNumber)) {
    errors.contactNumber = 'Contact number is required.';
  }

  if (values.safetyScore === '' || values.safetyScore === null || values.safetyScore === undefined) {
    errors.safetyScore = 'Safety score is required.';
  } else if (Number(values.safetyScore) < 0 || Number(values.safetyScore) > 100) {
    errors.safetyScore = 'Safety score must be between 0 and 100.';
  }

  if (!DRIVER_STATUSES.includes(values.status)) {
    errors.status = 'Please select a valid status.';
  }

  return errors;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
