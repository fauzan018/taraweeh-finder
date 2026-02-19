"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

export interface ToastProps {
  type?: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  onClose?: () => void;
}

export function Toast({
  type = "info",
  title,
  description,
  onClose,
}: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const backgrounds = {
    success: "bg-green-500/10 border-green-500/20",
    error: "bg-red-500/10 border-red-500/20",
    warning: "bg-yellow-500/10 border-yellow-500/20",
    info: "bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 p-4 rounded-lg border backdrop-blur-md",
        "max-w-sm animate-slide-up",
        backgrounds[type]
      )}
    >
      <div className="flex gap-3">
        {icons[type]}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {description && (
            <p className="text-xs text-text-secondary mt-1">{description}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
