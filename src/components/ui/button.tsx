"use client";
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", ...props }, ref) => (
    <button ref={ref} className={`px-4 py-2 rounded-xl font-semibold transition-all ${className}`} {...props}>
      {children}
    </button>
  )
);
Button.displayName = "Button";
