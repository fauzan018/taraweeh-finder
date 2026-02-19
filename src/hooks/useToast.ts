import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);

    return id;
  }, [removeToast]);

  const success = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'success', title, description }),
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'error', title, description }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'warning', title, description }),
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'info', title, description }),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
