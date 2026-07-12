// src/components/common/PageHeader.jsx

export default function PageHeader({
  title,
  subtitle,
  description,
  actionLabel,
  onAction,
  actions,
}) {
  const supportingText = subtitle || description;

  return (
    <div className="page-header">
      <div className="page-header-copy">
        <h1 className="page-header-title">{title}</h1>

        {supportingText && (
          <p className="page-header-description">
            {supportingText}
          </p>
        )}
      </div>

      <div className="page-header-actions">
        {actions}

        {actionLabel && onAction && (
          <button
            type="button"
            className="btn btn-brand"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}