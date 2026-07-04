import React, { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import DataTable, { type Column } from "../components/DataTable.tsx";
import Pagination from "../components/Pagination.tsx";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import StatusBadge from "../components/StatusBadge.tsx";
import { inputClass, iconButtonDangerClass } from "../components/formClasses.ts";
import { useResourceList } from "../hooks/useResourceList.ts";
import { api, ApiClientError } from "../api/client.ts";
import type { LoanRequest, RequestStatus } from "../types.ts";
import { useAuth } from "../context/AuthContext.tsx";

const STATUSES: RequestStatus[] = ["PENDING", "CONTACTED", "APPROVED", "REJECTED"];

export default function LoanRequestsPage() {
  const { user } = useAuth();
  const canUpdate = user?.role === "ADMIN" || user?.role === "EDITOR";
  const canDelete = user?.role === "ADMIN";

  const [statusFilter, setStatusFilter] = useState("");
  const list = useResourceList<LoanRequest>({ basePath: "/api/admin/loan-requests", extraParams: { status: statusFilter || undefined } });
  const [deleteTarget, setDeleteTarget] = useState<LoanRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  const updateStatus = async (id: string, status: RequestStatus) => {
    try {
      await api.patch(`/api/admin/loan-requests/${id}`, { status });
      toast.success("Status updated");
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/loan-requests/${deleteTarget.id}`);
      toast.success("Request deleted");
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to delete request");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<LoanRequest>[] = [
    { key: "name", label: "Applicant", sortable: true, render: (r) => (
      <div>
        <div className="font-black text-gray-900 dark:text-white">{r.name}</div>
        <div className="text-[10px] text-gray-400 font-bold">{r.phone}{r.email ? ` • ${r.email}` : ""}</div>
      </div>
    ) },
    { key: "loanType", label: "Loan Type", sortable: true, render: (r) => <span className="font-bold">{r.loanType}</span> },
    { key: "amount", label: "Amount", sortable: true, render: (r) => <span className="font-mono">{r.amount ? `$${r.amount.toLocaleString()}` : "-"}</span> },
    { key: "createdAt", label: "Submitted", render: (r) => <span className="text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: "status", label: "Status", render: (r) => canUpdate ? (
      <select
        value={r.status}
        onChange={(e) => updateStatus(r.id, e.target.value as RequestStatus)}
        className="bg-slate-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded px-2 py-1 text-[10px] font-black"
      >
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    ) : <StatusBadge status={r.status} /> },
    { key: "actions", label: "Actions", render: (r) => canDelete ? (
      <button className={iconButtonDangerClass} onClick={() => setDeleteTarget(r)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
    ) : null },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">Loan Requests</h1>
        <p className="text-xs text-gray-400 font-medium mt-1">Track and process customer loan inquiries.</p>
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
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} !w-auto`}>
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        }
      />
      <Pagination page={list.page} totalPages={list.totalPages} total={list.total} pageSize={list.pageSize} onPageChange={list.setPage} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Loan Request"
        message={`Are you sure you want to delete the request from "${deleteTarget?.name}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
