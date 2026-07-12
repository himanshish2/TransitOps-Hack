import React from "react";

export default function KpiCard({
  icon,
  label,
  value,
  variant = "default",
  suffix = "",
}) {
  const iconColorMap = {
    default: "var(--primary-orange)",
    success: "var(--success-color)",
    warning: "var(--warning-color)",
    danger: "var(--danger-color)",
    info: "var(--info-color)",
  };

  const renderIcon = () => {
    if (!icon) return null;

    // Supports an already-created element such as icon={<FiTruck />}
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        size: 18,
        "aria-hidden": true,
      });
    }

    // Also supports passing the component itself such as icon={FiTruck}
    if (typeof icon === "function") {
      const IconComponent = icon;

      return <IconComponent size={18} aria-hidden="true" />;
    }

    return null;
  };

  return (
    <div className="surface-card h-100">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span
          className="text-muted-custom fw-medium"
          style={{ fontSize: "var(--font-size-sm)" }}
        >
          {label}
        </span>

        {icon && (
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 36,
              height: 36,
              backgroundColor: "var(--orange-soft)",
              color: iconColorMap[variant] || iconColorMap.default,
              flexShrink: 0,
            }}
          >
            {renderIcon()}
          </span>
        )}
      </div>

      <div
        className="fw-semibold"
        style={{
          fontSize: "var(--font-size-2xl)",
          color: "var(--text-primary)",
        }}
      >
        {value}
        {suffix}
      </div>
    </div>
  );
}