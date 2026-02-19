"use client";
import React from "react";

interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  children: React.ReactNode;
}

export function PremiumButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: PremiumButtonProps) {
  const baseClasses =
    "relative font-semibold rounded-lg transition-all duration-300 overflow-hidden group";

  const variantClasses = {
    primary:
      "px-4 py-2.5 bg-[var(--card)] hover:bg-[var(--card)] border border-[var(--card)] text-white shadow-lg hover:shadow-xl",
    secondary:
      "px-4 py-2 bg-[var(--surface)] hover:bg-[var(--card)] border border-[var(--card)] hover:border-[var(--card)] text-gray-300 hover:text-white",
    tertiary:
      "px-3 py-1.5 bg-[var(--surface)] hover:bg-[var(--card)] text-gray-400 hover:text-white",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {children}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
    </button>
  );
}
