"use client";
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`rounded-xl bg-[var(--card)] shadow-xl p-4 ${className}`} {...props}>
      {children}
    </div>
  )
);
Card.displayName = "Card";
