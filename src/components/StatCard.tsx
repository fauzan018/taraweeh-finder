"use client";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
  description?: string;
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  trendPositive = true,
  description,
}: StatCardProps) {
  return (
    <Card variant="elevated" padding="lg" className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xl flex-shrink-0">
          {icon}
        </div>
        {trend && (
          <Badge
            variant={trendPositive ? "success" : "error"}
            size="sm"
          >
            {trend}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <h3 className="text-3xl font-semibold text-text-primary">{value}</h3>
        {description && (
          <p className="text-xs text-text-secondary">{description}</p>
        )}
      </div>
    </Card>
  );
}
