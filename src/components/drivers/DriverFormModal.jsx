import { useState, useEffect } from 'react';
import FormModal from '../common/FormModal';
import { DRIVER_STATUSES, LICENSE_CATEGORIES } from '../../utils/constants';
import { validateDriverForm, trimStringFields } from '../../utils/validationUtils';
import './DriverFormModal.css';

const EMPTY_FORM = {
  name: '',
  licenseNumber: '',
  licenseCategory: '',
  licenseExpiryDate: '',
  contactNumber: '',
  safetyScore: '',
  status: 'Available',
};

export default function DriverFormModal({ show, driver, onClose, onSubmit, submitting, serverError }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(driver);

  useEffect(() => {
    if (show) {
      setValues(driver ? { ...driver } : EMPTY_FORM);
      setErrors({});
    }
  }, [show, driver]);

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
    const trimmed = trimStringFields(values, ['name', 'licenseNumber', 'licenseCategory', 'contactNumber']);
    const validationErrors = validateDriverForm(trimmed);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      ...trimmed,
      safetyScore: Number(trimmed.safetyScore),
    });
  }

  return (
    <FormModal
      show={show}
      title={isEditing ? 'Edit Driver' : 'Add Driver'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" form="driver-form" className="btn btn-brand" disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Driver'}
          </button>
        </>
      }
    >
      <form id="driver-form" onSubmit={handleSubmit} noValidate className="driver-form-grid">
        <div>
          <label htmlFor="name" className="form-label">Name</label>
          <input
            id="name"
            type="text"
            className={`form-control ${errors.name ? 'is-invalid-field' : ''}`}
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <div className="field-error-text">{errors.name}</div>}
        </div>

        <div>
          <label htmlFor="licenseNumber" className="form-label">License Number</label>
          <input
            id="licenseNumber"
            type="text"
            className={`form-control ${errors.licenseNumber ? 'is-invalid-field' : ''}`}
            value={values.licenseNumber}
            onChange={(e) => handleChange('licenseNumber', e.target.value)}
          />
          {errors.licenseNumber && <div className="field-error-text">{errors.licenseNumber}</div>}
        </div>

        <div>
          <label htmlFor="licenseCategory" className="form-label">License Category</label>
          <select
            id="licenseCategory"
            className={`form-select ${errors.licenseCategory ? 'is-invalid-field' : ''}`}
            value={values.licenseCategory}
            onChange={(e) => handleChange('licenseCategory', e.target.value)}
          >
            <option value="">Select category</option>
            {LICENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.licenseCategory && <div className="field-error-text">{errors.licenseCategory}</div>}
        </div>

        <div>
          <label htmlFor="licenseExpiryDate" className="form-label">License Expiry Date</label>
          <input
            id="licenseExpiryDate"
            type="date"
            className={`form-control ${errors.licenseExpiryDate ? 'is-invalid-field' : ''}`}
            value={values.licenseExpiryDate}
            onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
          />
          {errors.licenseExpiryDate && <div className="field-error-text">{errors.licenseExpiryDate}</div>}
        </div>

        <div>
          <label htmlFor="contactNumber" className="form-label">Contact Number</label>
          <input
            id="contactNumber"
            type="text"
            className={`form-control ${errors.contactNumber ? 'is-invalid-field' : ''}`}
            value={values.contactNumber}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
          />
          {errors.contactNumber && <div className="field-error-text">{errors.contactNumber}</div>}
        </div>

        <div>
          <label htmlFor="safetyScore" className="form-label">Safety Score (0-100)</label>
          <input
            id="safetyScore"
            type="number"
            min="0"
            max="100"
            className={`form-control ${errors.safetyScore ? 'is-invalid-field' : ''}`}
            value={values.safetyScore}
            onChange={(e) => handleChange('safetyScore', e.target.value)}
          />
          {errors.safetyScore && <div className="field-error-text">{errors.safetyScore}</div>}
        </div>

        <div>
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            className={`form-select ${errors.status ? 'is-invalid-field' : ''}`}
            value={values.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {DRIVER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.status && <div className="field-error-text">{errors.status}</div>}
        </div>
      </form>
    </FormModal>
  );
}
