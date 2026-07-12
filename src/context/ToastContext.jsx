import {
  createContext,
  useState,
  useCallback,
  useContext,
} from "react";

import ToastContainer from "../components/common/ToastContainer";

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((previousToasts) =>
      previousToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (message, variant = "success") => {
      const normalizedVariant =
        variant === "error" ? "danger" : variant;

      const id = ++toastIdCounter;

      setToasts((previousToasts) => [
        ...previousToasts,
        {
          id,
          message,
          variant: normalizedVariant,
        },
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (message) => {
      showToast(message, "success");
    },
    [showToast]
  );

  const showError = useCallback(
    (message) => {
      showToast(message, "danger");
    },
    [showToast]
  );

  const value = {
    showToast,
    showSuccess,
    showError,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used within a ToastProvider"
    );
  }

  return context;
}