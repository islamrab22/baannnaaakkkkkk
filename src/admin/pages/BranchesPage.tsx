import React, { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, MapPinned } from "lucide-react";
import DataTable, { type Column } from "../components/DataTable.tsx";
import Pagination from "../components/Pagination.tsx";
import Modal from "../components/Modal.tsx";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import { inputClass, labelClass, buttonPrimaryClass, buttonSecondaryClass, iconButtonClass, iconButtonDangerClass } from "../components/formClasses.ts";
import { useResourceList } from "../hooks/useResourceList.ts";
import { api, ApiClientError } from "../api/client.ts";
import type { Branch } from "../types.ts";
import { useAuth } from "../context/AuthContext.tsx";

type BranchForm = {
  nameAr: string; nameEn: string; addressAr: string; addressEn: string;
  lat: string; lng: string; hoursAr: string; hoursEn: string; phone: string; email: string;
};

const EMPTY_FORM: BranchForm = {
  nameAr: "", nameEn: "", addressAr: "", addressEn: "", lat: "", lng: "", hoursAr: "", hoursEn: "", phone: "", email: "",
};

export default function BranchesPage() {
  const { user } = useAuth();
  const canWrite = user?.role === "ADMIN" || user?.role === "EDITOR";
  const canDelete = user?.role === "ADMIN";

  const list = useResourceList<Branch>({ basePath: "/api/admin/branches", defaultSortBy: "nameEn" });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [form, setForm] = useState<BranchForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (b: Branch) => {
    setEditing(b);
    setForm({
      nameAr: b.nameAr, nameEn: b.nameEn, addressAr: b.addressAr, addressEn: b.addressEn,
      lat: String(b.lat), lng: String(b.lng), hoursAr: b.hoursAr, hoursEn: b.hoursEn,
      phone: b.phone, email: b.email ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) };
      if (editing) {
        await api.patch(`/api/admin/branches/${editing.id}`, payload);
        toast.success("Branch updated");
      } else {
        await api.post("/api/admin/branches", payload);
        toast.success("Branch created");
      }
      setModalOpen(false);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to save branch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/branches/${deleteTarget.id}`);
      toast.success("Branch deleted");
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to delete branch");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Branch>[] = [
    { key: "nameEn", label: "Branch", sortable: true, render: (b) => (
      <div>
        <div className="font-black text-gray-900 dark:text-white">{b.nameEn}</div>
        <div className="text-[10px] text-gray-400 font-bold mt-0.5">{b.addressEn}</div>
      </div>
    ) },
    { key: "coords", label: "Coordinates", render: (b) => (
      <a
        href={`https://maps.google.com/?q=${b.lat},${b.lng}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-brand hover:underline font-mono"
      >
        <MapPinned className="w-3.5 h-3.5" /> {b.lat.toFixed(4)}, {b.lng.toFixed(4)}
      </a>
    ) },
    { key: "phone", label: "Phone", render: (b) => <span className="font-mono text-gray-500">{b.phone}</span> },
    { key: "hours", label: "Hours", render: (b) => <span className="text-gray-500">{b.hoursEn}</span> },
    { key: "actions", label: "Actions", render: (b) => (
      <div className="flex items-center gap-2">
        <button className={iconButtonClass} onClick={() => openEdit(b)} title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
        {canDelete && <button className={iconButtonDangerClass} onClick={() => setDeleteTarget(b)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Branches</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">Manage physical branch locations and working hours.</p>
        </div>
        {canWrite && <button onClick={openCreate} className={`${buttonPrimaryClass} flex items-center gap-1.5`}><Plus className="w-4 h-4" /> New Branch</button>}
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
      />
      <Pagination page={list.page} totalPages={list.totalPages} total={list.total} pageSize={list.pageSize} onPageChange={list.setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Branch" : "Create Branch"} wide>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name (Arabic)</label>
            <input required dir="rtl" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Name (English)</label>
            <input required value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address (Arabic)</label>
            <input required dir="rtl" value={form.addressAr} onChange={(e) => setForm({ ...form, addressAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address (English)</label>
            <input required value={form.addressEn} onChange={(e) => setForm({ ...form, addressEn: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Latitude</label>
            <input required type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className={`${inputClass} font-mono`} />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input required type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className={`${inputClass} font-mono`} />
          </div>
          <div>
            <label className={labelClass}>Working Hours (Arabic)</label>
            <input required dir="rtl" value={form.hoursAr} onChange={(e) => setForm({ ...form, hoursAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Working Hours (English)</label>
            <input required value={form.hoursEn} onChange={(e) => setForm({ ...form, hoursEn: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`${inputClass} font-mono`} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className={buttonSecondaryClass}>Cancel</button>
            <button type="submit" disabled={saving} className={buttonPrimaryClass}>{saving ? "Saving..." : "Save Branch"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Branch"
        message={`Are you sure you want to delete "${deleteTarget?.nameEn}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
