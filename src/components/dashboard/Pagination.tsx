"use client";

import { usePagination } from "@/hooks/usePagination";
import { cn } from "@/lib/cn";

interface PaginationProps {
  total: number;
  pageSize: number;
  page: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ total, pageSize, page, onPageChange }: PaginationProps) {
  const { items, totalPages } = usePagination({ total, pageSize, page });
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn-outline px-3 py-2 text-xs disabled:opacity-40"
        aria-label="Previous page"
      >
        ←
      </button>
      {items.map((item, idx) =>
        item === "dots" ? (
          <span key={`d-${idx}`} className="px-2 text-ink-400">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              "h-9 min-w-9 rounded-lg border px-3 text-sm font-medium transition-all",
              item === page
                ? "border-ink-950 bg-ink-950 text-white shadow-soft"
                : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"
            )}
          >
            {item}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="btn-outline px-3 py-2 text-xs disabled:opacity-40"
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
}
