import React from "react";
import { useTranslation } from "react-i18next";

const COLOR_MAP: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  DRAFT: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  ARCHIVED: "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400",
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  READ: "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  CONTACTED: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  REJECTED: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  INACTIVE: "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400",
};

const LABEL_KEY_MAP: Record<string, string> = {
  PUBLISHED: "contentStatuses.PUBLISHED",
  DRAFT: "contentStatuses.DRAFT",
  ARCHIVED: "contentStatuses.ARCHIVED",
  NEW: "messageStatuses.NEW",
  READ: "messageStatuses.READ",
  PENDING: "requestStatuses.PENDING",
  CONTACTED: "requestStatuses.CONTACTED",
  APPROVED: "requestStatuses.APPROVED",
  REJECTED: "requestStatuses.REJECTED",
  ACTIVE: "common.active",
  INACTIVE: "common.inactive",
};

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const cls = COLOR_MAP[status] ?? "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400";
  const labelKey = LABEL_KEY_MAP[status];
  return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${cls}`}>{labelKey ? t(labelKey) : status}</span>;
}
