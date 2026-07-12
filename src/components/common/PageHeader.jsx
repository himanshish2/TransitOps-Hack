export default function PageHeader({ title, description, actions }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-md mb-4">
      <div>
        <h1 className="fs-3">{title}</h1>
        {description && <p className="text-muted-custom mb-0 mt-1">{description}</p>}
      </div>
      {actions && <div className="d-flex gap-sm flex-wrap">{actions}</div>}
    </div>
  );
}
