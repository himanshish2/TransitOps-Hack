import { useState, useEffect } from 'react';
import FormModal from '../common/FormModal';
import { VEHICLE_TYPES, VEHICLE_STATUSES, REGIONS } from '../../utils/constants';
import { validateVehicleForm, trimStringFields } from '../../utils/validationUtils';
import './VehicleFormModal.css';

const EMPTY_FORM = {
  registrationNumber: '',
  vehicleModel: '',
  type: '',
  maxLoadCapacity: '',
  odometer: '',
  acquisitionCost: '',
  status: 'Available',
  region: '',
};

export default function VehicleFormModal({ show, vehicle, existingVehicles, onClose, onSubmit, submitting, serverError }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(vehicle);

  useEffect(() => {
    if (show) {
      setValues(vehicle ? { ...vehicle } : EMPTY_FORM);
      setErrors({});
    }
  }, [show, vehicle]);

  // Surface server-side errors (e.g. duplicate registration caught by backend)
  // onto the relevant field without discarding what the user typed.
  useEffect(() => {
    if (serverError?.field) {
      setErrors((prev) => ({ ...prev, [serverError.field]: serverError.message }));
    }
  }, [serverError]);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = trimStringFields(values, ['registrationNumber', 'vehicleModel', 'type', 'region']);
    const validationErrors = validateVehicleForm(trimmed, existingVehicles, vehicle?.id);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      ...trimmed,
      maxLoadCapacity: Number(trimmed.maxLoadCapacity),
      odometer: Number(trimmed.odometer),
      acquisitionCost: Number(trimmed.acquisitionCost),
    });
  }

  return (
    <FormModal
      show={show}
      title={isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="vehicle-form" className="btn btn-brand" disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </>
      }
    >
      <form id="vehicle-form" onSubmit={handleSubmit} noValidate className="vehicle-form-grid">
        <div>
          <label htmlFor="registrationNumber" className="form-label">Registration Number</label>
          <input
            id="registrationNumber"
            type="text"
            className={`form-control ${errors.registrationNumber ? 'is-invalid-field' : ''}`}
            value={values.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
            aria-invalid={Boolean(errors.registrationNumber)}
            aria-describedby="registrationNumber-error"
          />
          {errors.registrationNumber && <div id="registrationNumber-error" className="field-error-text">{errors.registrationNumber}</div>}
        </div>

        <div>
          <label htmlFor="vehicleModel" className="form-label">Vehicle Model</label>
          <input
            id="vehicleModel"
            type="text"
            className={`form-control ${errors.vehicleModel ? 'is-invalid-field' : ''}`}
            value={values.vehicleModel}
            onChange={(e) => handleChange('vehicleModel', e.target.value)}
            aria-invalid={Boolean(errors.vehicleModel)}
          />
          {errors.vehicleModel && <div className="field-error-text">{errors.vehicleModel}</div>}
        </div>

        <div>
          <label htmlFor="type" className="form-label">Type</label>
          <select
            id="type"
            className={`form-select ${errors.type ? 'is-invalid-field' : ''}`}
            value={values.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="">Select type</option>
            {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.type && <div className="field-error-text">{errors.type}</div>}
        </div>

        <div>
          <label htmlFor="region" className="form-label">Region</label>
          <select
            id="region"
            className={`form-select ${errors.region ? 'is-invalid-field' : ''}`}
            value={values.region}
            onChange={(e) => handleChange('region', e.target.value)}
          >
            <option value="">Select region</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.region && <div className="field-error-text">{errors.region}</div>}
        </div>

        <div>
          <label htmlFor="maxLoadCapacity" className="form-label">Maximum Load Capacity (kg)</label>
          <input
            id="maxLoadCapacity"
            type="number"
            min="0"
            className={`form-control ${errors.maxLoadCapacity ? 'is-invalid-field' : ''}`}
            value={values.maxLoadCapacity}
            onChange={(e) => handleChange('maxLoadCapacity', e.target.value)}
          />
          {errors.maxLoadCapacity && <div className="field-error-text">{errors.maxLoadCapacity}</div>}
        </div>

        <div>
          <label htmlFor="odometer" className="form-label">Odometer (km)</label>
          <input
            id="odometer"
            type="number"
            min="0"
            className={`form-control ${errors.odometer ? 'is-invalid-field' : ''}`}
            value={values.odometer}
            onChange={(e) => handleChange('odometer', e.target.value)}
          />
          {errors.odometer && <div className="field-error-text">{errors.odometer}</div>}
        </div>

        <div>
          <label htmlFor="acquisitionCost" className="form-label">Acquisition Cost (INR)</label>
          <input
            id="acquisitionCost"
            type="number"
            min="0"
            className={`form-control ${errors.acquisitionCost ? 'is-invalid-field' : ''}`}
            value={values.acquisitionCost}
            onChange={(e) => handleChange('acquisitionCost', e.target.value)}
          />
          {errors.acquisitionCost && <div className="field-error-text">{errors.acquisitionCost}</div>}
        </div>

        <div>
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            className={`form-select ${errors.status ? 'is-invalid-field' : ''}`}
            value={values.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {VEHICLE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.status && <div className="field-error-text">{errors.status}</div>}
        </div>
      </form>
    </FormModal>
  );
}
