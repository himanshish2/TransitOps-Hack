import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'No records found', message = 'Try adjusting your search or filters.', icon: Icon = FiInbox }) {
  return (
    <div className="empty-state-wrapper">
      <Icon size={40} />
      <h3 className="fs-6 fw-semibold mb-1">{title}</h3>
      <p className="mb-0" style={{ fontSize: 'var(--font-size-sm)' }}>{message}</p>
    </div>
  );
}
