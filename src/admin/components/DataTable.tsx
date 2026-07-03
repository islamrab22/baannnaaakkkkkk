import React from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (key: string) => void;
  toolbar?: React.ReactNode;
  filters?: React.ReactNode;
  emptyLabel?: string;
}

export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  search,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  toolbar,
  filters,
  emptyLabel,
}: DataTableProps<T>) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("common.search")}
            className="w-full bg-slate-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg pr-9 pl-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand text-right"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filters}
          {toolbar}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 dark:bg-neutral-800/60 text-gray-500 dark:text-gray-400 font-extrabold border-b border-gray-200 dark:border-neutral-800">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`p-3 text-right ${col.className ?? ""}`}>
                  {col.sortable && onSortChange ? (
                    <button onClick={() => onSortChange(col.key)} className="flex items-center gap-1 hover:text-brand">
                      <span>{col.label}</span>
                      <ArrowUpDown className={`w-3 h-3 ${sortBy === col.key ? "text-brand" : ""}`} />
                      {sortBy === col.key && <span className="text-[9px]">{sortOrder === "asc" ? t("common.sortAsc") : t("common.sortDesc")}</span>}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-400 font-bold">
                  {t("common.loading")}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-400 font-bold">
                  {emptyLabel ?? t("common.noRecords")}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-neutral-800/40">
                  {columns.map((col) => (
                    <td key={col.key} className={`p-3 align-middle ${col.className ?? ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
