import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-1 py-3 text-xs font-bold text-gray-500 dark:text-gray-400">
      <span>
        {start}-{end} of {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-neutral-800"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-neutral-800"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
