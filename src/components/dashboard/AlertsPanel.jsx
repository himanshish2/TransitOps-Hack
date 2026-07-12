import { FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';
import EmptyState from '../common/EmptyState';
import { formatDateTime } from '../../utils/formatUtils';
import './AlertsPanel.css';

export default function AlertsPanel({ alerts = [] }) {
  return (
    <div className="surface-card h-100">
      <h2 className="fs-6 fw-semibold mb-3">Recent Operational Alerts</h2>

      {alerts.length === 0 ? (
        <EmptyState title="No alerts" message="Everything looks good right now." />
      ) : (
        <ul className="alerts-list">
          {alerts.map((alert) => (
            <li key={alert.id} className={`alert-item alert-item-${alert.severity}`}>
              <span className="alert-icon">
                {alert.severity === 'danger' ? <FiAlertCircle size={18} /> : <FiAlertTriangle size={18} />}
              </span>
              <div className="flex-grow-1">
                <div className="fw-medium" style={{ fontSize: 'var(--font-size-sm)' }}>{alert.title}</div>
                <div className="text-muted-custom" style={{ fontSize: 'var(--font-size-xs)' }}>{alert.message}</div>
                <div className="text-muted-custom mt-1" style={{ fontSize: 'var(--font-size-xs)' }}>
                  {formatDateTime(alert.createdAt)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
