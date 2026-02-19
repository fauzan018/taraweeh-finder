"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        surface: "bg-surface border border-border",
        elevated:
          "bg-surface-light border border-border-light shadow-md hover:shadow-lg",
        glass:
          "bg-white/5 backdrop-blur-md border border-white/10 shadow-glass",
      },
      interactive: {
        true: "cursor-pointer hover:border-border-light",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
    },
    defaultVariants: {
      variant: "surface",
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, padding, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";
