"use client";
import React from "react";

interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function PremiumButton({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  icon,
  className = "",
  ...props
}: PremiumButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-primary text-surface-light border border-primary hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 active:scale-95",
    secondary:
      "bg-surface-light border border-border-light text-text-primary hover:bg-white/10 hover:border-border active:scale-95",
    tertiary:
      "bg-transparent border border-border-light text-text-primary hover:bg-white/5 active:scale-95",
  };

  return (
    <button
      className={`relative font-semibold rounded-lg transition-all duration-200 overflow-hidden group flex items-center justify-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
      )}
    </button>
  );
}
