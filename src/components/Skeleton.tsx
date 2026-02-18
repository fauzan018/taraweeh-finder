"use client";

export function MosqueCardSkeleton() {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-[var(--card)] to-[#1a1a2e] border border-[var(--card)]/50 rounded-2xl p-6 animate-pulse">
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-[var(--surface)]/50 rounded-lg w-3/4"></div>
            <div className="h-4 bg-[var(--surface)]/30 rounded-full w-1/3"></div>
          </div>
          <div className="h-10 w-16 bg-[var(--surface)]/50 rounded-lg flex-shrink-0"></div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <div className="h-4 bg-[var(--surface)]/40 rounded w-full"></div>
          <div className="h-4 bg-[var(--surface)]/40 rounded w-2/3"></div>
        </div>

        {/* Date section */}
        <div className="bg-[var(--background)]/50 backdrop-blur-sm border border-[var(--card)]/30 rounded-lg p-3">
          <div className="h-4 bg-[var(--surface)]/40 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-[var(--surface)]/30 rounded w-3/4"></div>
        </div>

        {/* Sweet section */}
        <div className="bg-[var(--background)]/50 border border-[var(--card)]/30 rounded-lg p-3">
          <div className="h-4 bg-[var(--surface)]/40 rounded w-1/2"></div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--card)]/30">
          <div className="flex gap-4">
            <div className="h-3 bg-[var(--surface)]/30 rounded w-20"></div>
            <div className="h-3 bg-[var(--surface)]/30 rounded w-24"></div>
          </div>
          <div className="h-3 bg-[var(--surface)]/30 rounded w-20"></div>
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
