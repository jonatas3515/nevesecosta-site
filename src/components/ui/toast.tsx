"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "success" | "error" | "info";
  durationMs?: number;
};

const ToastCtx = createContext<{
  toasts: Toast[];
  show: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, durationMs: 3500, variant: "info", ...t };
    setToasts((prev) => [...prev, toast]);
    const duration = toast.durationMs ?? 3500;
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  const value = useMemo(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed z-[9999] top-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-[380px] rounded-md shadow-lg px-4 py-3 text-white ${
              t.variant === "success"
                ? "bg-green-600"
                : t.variant === "error"
                ? "bg-red-600"
                : "bg-gray-900"
            }`}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm opacity-90">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
