import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function ToastContainer({
  toasts = [],
  onDismiss = () => {},
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="position-fixed d-flex flex-column gap-sm"
      style={{
        bottom: 20,
        right: 20,
        zIndex: 1080,
        maxWidth: 340,
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.variant === "success";

        return (
          <div
            key={toast.id}
            className="surface-card d-flex align-items-start gap-sm"
            style={{
              padding: "var(--space-md)",
              borderLeft: `4px solid ${
                isSuccess
                  ? "var(--success-color)"
                  : "var(--danger-color)"
              }`,
            }}
            role="alert"
          >
            {isSuccess ? (
              <FiCheckCircle
                size={18}
                style={{
                  color: "var(--success-color)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
            ) : (
              <FiXCircle
                size={18}
                style={{
                  color: "var(--danger-color)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
            )}

            <span
              className="flex-grow-1"
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--text-primary)",
              }}
            >
              {toast.message}
            </span>

            <button
              type="button"
              className="btn-close"
              aria-label="Dismiss notification"
              onClick={() => onDismiss(toast.id)}
            />
          </div>
        );
      })}
    </div>
  );
}