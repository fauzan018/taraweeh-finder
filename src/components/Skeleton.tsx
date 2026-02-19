"use client";

import { Card } from "@/components/ui/Card";

export function MosqueCardSkeleton() {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-surface-light to-surface-light border border-border/50 rounded-2xl p-6 animate-pulse">
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-white/10 rounded-lg w-3/4"></div>
            <div className="h-4 bg-white/5 rounded-full w-1/3"></div>
          </div>
          <div className="h-10 w-16 bg-white/10 rounded-lg flex-shrink-0"></div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <div className="h-4 bg-white/8 rounded w-full"></div>
          <div className="h-4 bg-white/8 rounded w-2/3"></div>
        </div>

        {/* Date section */}
        <div className="bg-white/5 border border-border/30 rounded-lg p-3">
          <div className="h-4 bg-white/8 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-white/5 rounded w-3/4"></div>
        </div>

        {/* Sweet section */}
        <div className="bg-white/5 border border-border/30 rounded-lg p-3">
          <div className="h-4 bg-white/8 rounded w-1/2"></div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex gap-4">
            <div className="h-3 bg-white/5 rounded w-20"></div>
            <div className="h-3 bg-white/5 rounded w-24"></div>
          </div>
          <div className="h-3 bg-white/5 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <MosqueCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-border/50">
      <td className="px-4 py-3">
        <div className="h-4 bg-white/10 rounded w-8"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="h-4 bg-white/10 rounded w-20 ml-auto"></div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="h-4 bg-white/10 rounded w-20 ml-auto"></div>
      </td>
    </tr>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left">
              <div className="h-4 bg-white/20 rounded w-8"></div>
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </th>
            <th className="px-4 py-3 text-right">
              <div className="h-4 bg-white/20 rounded w-20 ml-auto"></div>
            </th>
            <th className="px-4 py-3 text-right">
              <div className="h-4 bg-white/20 rounded w-20 ml-auto"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-white/10 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
        <div className="w-8 h-8 bg-white/10 rounded-lg flex-shrink-0"></div>
      </div>
    </Card>
  );
}

export function FormSectionSkeleton() {
  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-4">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-white/20 rounded w-1/3"></div>
              <div className="h-10 bg-white/10 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
