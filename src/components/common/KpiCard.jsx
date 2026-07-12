// src/components/common/KpiCard.jsx

import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";

export default function KpiCard({
  icon,
  label,
  value,
  variant = "default",
  suffix = "",
  description = "",
  details = [],
}) {
  const [isExpanded, setIsExpanded] =
    useState(false);

  const iconColorMap = {
    default: "var(--primary-orange)",
    success: "var(--success-color)",
    warning: "var(--warning-color)",
    danger: "var(--danger-color)",
    info: "var(--info-color)",
  };

  const normalizedDetails = Array.isArray(details)
    ? details
    : [];

  const hasInformation =
    Boolean(description) ||
    normalizedDetails.length > 0;

  const renderIcon = () => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        size: 18,
        "aria-hidden": true,
      });
    }

    if (typeof icon === "function") {
      const IconComponent = icon;

      return (
        <IconComponent
          size={18}
          aria-hidden="true"
        />
      );
    }

    return null;
  };

  return (
    <article
      className={`surface-card kpi-card h-100 ${
        isExpanded ? "kpi-card-expanded" : ""
      }`}
    >
      <div className="d-flex align-items-start justify-content-between gap-sm">
        <div>
          <span
            className="text-muted-custom fw-medium"
            style={{
              fontSize: "var(--font-size-sm)",
            }}
          >
            {label}
          </span>

          <div
            className="fw-semibold mt-2"
            style={{
              fontSize:
                "var(--font-size-2xl)",
              color: "var(--text-primary)",
            }}
          >
            {value}
            {suffix}
          </div>
        </div>

        <div className="d-flex align-items-center gap-xs">
          {hasInformation && (
            <button
              type="button"
              className="kpi-info-button"
              aria-label={`Show information about ${label}`}
              aria-expanded={isExpanded}
              onClick={() =>
                setIsExpanded(
                  (previous) => !previous
                )
              }
            >
              <FiInfo size={15} />
            </button>
          )}

          {icon && (
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 36,
                height: 36,
                backgroundColor:
                  "var(--orange-soft)",
                color:
                  iconColorMap[variant] ||
                  iconColorMap.default,
                flexShrink: 0,
              }}
            >
              {renderIcon()}
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="kpi-information-panel">
          {description && (
            <p className="mb-2">
              {description}
            </p>
          )}

          {normalizedDetails.length > 0 && (
            <ul className="mb-0">
              {normalizedDetails
                .slice(0, 6)
                .map((detail, index) => (
                  <li
                    key={`${label}-${index}`}
                  >
                    {detail}
                  </li>
                ))}
            </ul>
          )}

          {normalizedDetails.length > 6 && (
            <p className="kpi-more-text mb-0 mt-2">
              +
              {normalizedDetails.length - 6}{" "}
              more
            </p>
          )}
        </div>
      )}
    </article>
  );
}