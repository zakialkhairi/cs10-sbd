'use client';

export default function Loader({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass overflow-hidden">
          {/* Image skeleton */}
          <div className="skeleton aspect-square rounded-none" />
          {/* Content skeleton */}
          <div className="p-5 space-y-3">
            <div className="skeleton h-5 w-3/4 rounded-md" />
            <div className="skeleton h-3 w-full rounded-md" />
            <div className="skeleton h-3 w-2/3 rounded-md" />
            <div
              className="flex items-center justify-between pt-2"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="skeleton h-6 w-20 rounded-md" />
              <div className="skeleton h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
