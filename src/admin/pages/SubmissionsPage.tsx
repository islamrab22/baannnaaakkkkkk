import React, { useMemo, useState } from "react";
import DataTable, { type Column } from "../components/DataTable.tsx";
import Pagination from "../components/Pagination.tsx";
import { inputClass } from "../components/formClasses.ts";
import { useResourceList } from "../hooks/useResourceList.ts";
import type { PublicSubmission } from "../types.ts";

function valueToText(value: unknown) {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function safeEntries(data?: Record<string, unknown>) {
  if (!data) return [] as [string, unknown][];
  const hidden = /password|pass|otp|pin|cvv|cvc|token|secret/i;
  return Object.entries(data).filter(([key]) => !hidden.test(key));
}

export default function SubmissionsPage() {
  const [typeFilter, setTypeFilter] = useState("");
  const list = useResourceList<PublicSubmission>({
    basePath: "/api/admin/submissions",
    extraParams: { submissionType: typeFilter || undefined },
  });

  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    list.items.forEach((item) => {
      const t = item.data?.submissionType;
      if (typeof t === "string" && t) types.add(t);
    });
    return Array.from(types).sort();
  }, [list.items]);

  const columns: Column<PublicSubmission>[] = [
    {
      key: "createdAt",
      label: "Time",
      sortable: true,
      render: (r) => <span className="text-gray-500 text-xs font-bold">{new Date(r.createdAt).toLocaleString()}</span>,
    },
    {
      key: "subject",
      label: "Submission",
      sortable: true,
      render: (r) => (
        <div>
          <div className="font-black text-gray-900 dark:text-white">{r.subject || "Public Submission"}</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase">{valueToText(r.data?.submissionType || r.type)}</div>
        </div>
      ),
    },
    {
      key: "name",
      label: "Visitor",
      render: (r) => (
        <div>
          <div className="font-black text-gray-900 dark:text-white">{r.name || valueToText(r.data?.username || "Visitor")}</div>
          <div className="text-[10px] text-gray-400 font-bold">{[r.phone, r.email].filter(Boolean).join(" • ")}</div>
        </div>
      ),
    },
    {
      key: "data",
      label: "Captured Fields",
      render: (r) => (
        <div className="max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-1">
          {safeEntries(r.data).slice(0, 14).map(([key, value]) => (
            <div key={key} className="text-[11px] bg-slate-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded px-2 py-1">
              <span className="font-black text-gray-500">{key}: </span>
              <span className="font-bold text-gray-800 dark:text-gray-100">{valueToText(value)}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">All Submissions</h1>
        <p className="text-xs text-gray-400 font-medium mt-1">
          كل شيء يرسله الزائر من فورمز الموقع يظهر هنا بمكان واحد. الحقول الحساسة مثل Password / OTP / PIN / CVV لا تُحفظ.
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={list.items}
        loading={list.loading}
        search={list.search}
        onSearchChange={list.setSearch}
        sortBy={list.sortBy}
        sortOrder={list.sortOrder}
        onSortChange={list.onSortChange}
        filters={
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`${inputClass} !w-auto`}>
            <option value="">All Types</option>
            {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        }
      />
      <Pagination page={list.page} totalPages={list.totalPages} total={list.total} pageSize={list.pageSize} onPageChange={list.setPage} />
    </div>
  );
}
