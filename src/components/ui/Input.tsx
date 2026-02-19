"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = "text", ...props }, ref) => (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          className={cn(
            "w-full px-4 py-2.5 bg-surface border border-border rounded-lg",
            "text-text-primary placeholder-text-secondary",
            "transition-all duration-200",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            icon && "pl-10",
            error && "border-error focus:border-error focus:ring-error/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
