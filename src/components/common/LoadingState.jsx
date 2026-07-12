export default function LoadingState({ rows = 5, type = 'table' }) {
  if (type === 'kpi') {
    return (
      <div className="row g-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <div className="skeleton-block" style={{ height: 96, borderRadius: 'var(--radius-lg)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return <div className="skeleton-block" style={{ height: 280, borderRadius: 'var(--radius-lg)' }} />;
  }

  return (
    <div className="d-flex flex-column gap-sm p-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-block" style={{ height: 40 }} />
      ))}
    </div>
  );
}
