import React, { useState } from "react";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import DataTable, { type Column } from "../components/DataTable.tsx";
import Pagination from "../components/Pagination.tsx";
import Modal from "../components/Modal.tsx";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import StatusBadge from "../components/StatusBadge.tsx";
import { inputClass, iconButtonClass, iconButtonDangerClass } from "../components/formClasses.ts";
import { useResourceList } from "../hooks/useResourceList.ts";
import { api, ApiClientError } from "../api/client.ts";
import type { Message } from "../types.ts";
import { useAuth } from "../context/AuthContext.tsx";

const TYPES = ["CONTACT", "NEWSLETTER", "LOAN_INQUIRY", "CARD_INQUIRY", "CAREER"];
const STATUSES = ["NEW", "READ", "ARCHIVED"];

const FIELD_LABELS: Record<string, string> = {
  name: "الاسم",
  email: "البريد الإلكتروني",
  phone: "الهاتف",
  subject: "الموضوع",
  message: "الرسالة",
};

export default function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canUpdate = user?.role === "ADMIN" || user?.role === "EDITOR";
  const canDelete = user?.role === "ADMIN";

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const list = useResourceList<Message>({ basePath: "/api/admin/messages", extraParams: { type: typeFilter || undefined, status: statusFilter || undefined } });

  const [viewing, setViewing] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openView = async (message: Message) => {
    setViewing(message);
    if (canUpdate && message.status === "NEW") {
      try {
        await api.patch(`/api/admin/messages/${message.id}`, { status: "READ" });
        list.refresh();
      } catch {
        // non-critical
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/messages/${deleteTarget.id}`);
      toast.success(t("messages.toasts.deleted"));
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : t("messages.toasts.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Message>[] = [
    { key: "type", label: t("messages.table.type"), render: (m) => <span className="font-black text-[10px] uppercase">{t(`messages.types.${m.type}`, m.type)}</span> },
    { key: "name", label: t("messages.table.from"), render: (m) => (
      <div>
        <div className="font-bold text-gray-900 dark:text-white">{m.name ?? m.email ?? t("common.anonymous")}</div>
        {m.email && <div className="text-[10px] text-gray-400">{m.email}</div>}
      </div>
    ) },
    { key: "createdAt", label: t("messages.table.received"), sortable: true, render: (m) => <span className="text-gray-400">{new Date(m.createdAt).toLocaleString()}</span> },
    { key: "status", label: t("messages.table.status"), render: (m) => <StatusBadge status={m.status} /> },
    { key: "actions", label: t("common.actions"), render: (m) => (
      <div className="flex items-center gap-2">
        <button className={iconButtonClass} onClick={() => openView(m)} title={t("messages.viewDetails")}><Eye className="w-3.5 h-3.5" /></button>
        {canDelete && <button className={iconButtonDangerClass} onClick={() => setDeleteTarget(m)} title={t("common.delete")}><Trash2 className="w-3.5 h-3.5" /></button>}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">{t("messages.title")}</h1>
        <p className="text-xs text-gray-400 font-medium mt-1">{t("messages.subtitle")}</p>
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
          <>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`${inputClass} !w-auto`}>
              <option value="">{t("common.allTypes")}</option>
              {TYPES.map((ty) => <option key={ty} value={ty}>{t(`messages.types.${ty}`)}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} !w-auto`}>
              <option value="">{t("common.allStatuses")}</option>
              {STATUSES.map((s) => <option key={s} value={s}>{t(`messageStatuses.${s}`)}</option>)}
            </select>
          </>
        }
      />
      <Pagination page={list.page} totalPages={list.totalPages} total={list.total} pageSize={list.pageSize} onPageChange={list.setPage} />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={t("messages.modalTitle")}>
        {viewing && (
          <div className="space-y-3 text-xs">
            <div><span className="text-gray-400 block">{t("messages.type")}</span><strong>{t(`messages.types.${viewing.type}`, viewing.type)}</strong></div>
            <div><span className="text-gray-400 block">{t("messages.receivedAt")}</span><strong>{new Date(viewing.createdAt).toLocaleString()}</strong></div>
            <div className="bg-slate-50 dark:bg-neutral-800 p-3.5 rounded-lg space-y-2">
              {Object.entries({ name: viewing.name, email: viewing.email, phone: viewing.phone, subject: viewing.subject, message: viewing.message, ...(viewing.data ?? {}) })
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="border-b border-slate-200 dark:border-neutral-700 pb-1.5 last:border-0">
                    <span className="text-[10px] font-black text-brand uppercase block">{FIELD_LABELS[k] ?? k}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold block mt-0.5 whitespace-pre-wrap">{String(v)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t("messages.deleteTitle")}
        message={t("messages.deleteMessage")}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
