import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination as PaginationData } from '@/types/link';

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-900/5 pt-4 dark:border-white/5">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Page {page} of {totalPages} &middot; {total} total
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex size-9 items-center justify-center rounded-lg border border-gray-200/80 text-gray-600 transition-colors hover:bg-gray-900/5 disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex size-9 items-center justify-center rounded-lg border border-gray-200/80 text-gray-600 transition-colors hover:bg-gray-900/5 disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
