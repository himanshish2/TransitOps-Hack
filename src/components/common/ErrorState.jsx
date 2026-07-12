import { FiAlertTriangle } from 'react-icons/fi';

export default function ErrorState({ message = 'Something went wrong while loading data.', onRetry }) {
  return (
    <div className="error-state-wrapper">
      <FiAlertTriangle size={40} style={{ color: 'var(--danger-color)', opacity: 1 }} />
      <h3 className="fs-6 fw-semibold mb-1">Unable to load data</h3>
      <p className="mb-3" style={{ fontSize: 'var(--font-size-sm)' }}>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-brand btn-sm" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
