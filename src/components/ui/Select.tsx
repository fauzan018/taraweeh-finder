"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, icon, options, ...props }, ref) => (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full px-4 py-2.5 bg-surface border border-border rounded-lg",
            "text-text-primary",
            "transition-all duration-200",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "appearance-none cursor-pointer",
            icon && "pl-10",
            error && "border-error focus:border-error focus:ring-error/50",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
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
Select.displayName = "Select";
