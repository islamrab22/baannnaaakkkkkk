import React, { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DataTable, { type Column } from "../components/DataTable.tsx";
import Pagination from "../components/Pagination.tsx";
import Modal from "../components/Modal.tsx";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import StatusBadge from "../components/StatusBadge.tsx";
import ImageUploader from "../components/ImageUploader.tsx";
import { inputClass, labelClass, buttonPrimaryClass, buttonSecondaryClass, iconButtonClass, iconButtonDangerClass } from "../components/formClasses.ts";
import { useResourceList } from "../hooks/useResourceList.ts";
import { api, ApiClientError } from "../api/client.ts";
import type { Campaign } from "../types.ts";
import { useAuth } from "../context/AuthContext.tsx";

const SEGMENTS = ["PERSONAL", "BUSINESS"];
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

type CampaignForm = {
  titleAr: string; titleEn: string; descAr: string; descEn: string;
  badgeAr: string; badgeEn: string; image: string; link: string;
  segment: string; status: string;
};

const EMPTY_FORM: CampaignForm = {
  titleAr: "", titleEn: "", descAr: "", descEn: "", badgeAr: "", badgeEn: "",
  image: "", link: "cards", segment: "PERSONAL", status: "DRAFT",
};

export default function CampaignsPage() {
  const { user } = useAuth();
  const canWrite = user?.role === "ADMIN" || user?.role === "EDITOR";
  const canDelete = user?.role === "ADMIN";
  const [segmentFilter, setSegmentFilter] = useState("");

  const list = useResourceList<Campaign>({ basePath: "/api/admin/campaigns", extraParams: { segment: segmentFilter || undefined } });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState<CampaignForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (c: Campaign) => {
    setEditing(c);
    setForm({
      titleAr: c.titleAr, titleEn: c.titleEn, descAr: c.descAr, descEn: c.descEn,
      badgeAr: c.badgeAr, badgeEn: c.badgeEn, image: c.image, link: c.link,
      segment: c.segment, status: c.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/api/admin/campaigns/${editing.id}`, form);
        toast.success("Campaign updated");
      } else {
        await api.post("/api/admin/campaigns", form);
        toast.success("Campaign created");
      }
      setModalOpen(false);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to save campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/campaigns/${deleteTarget.id}`);
      toast.success("Campaign deleted");
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to delete campaign");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Campaign>[] = [
    { key: "titleEn", label: "Campaign", sortable: true, render: (c) => (
      <div className="flex items-center gap-3">
        <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
        <div>
          <div className="font-black text-gray-900 dark:text-white">{c.titleEn}</div>
          <div className="text-[10px] text-gray-400 font-bold mt-0.5">{c.badgeEn}</div>
        </div>
      </div>
    ) },
    { key: "segment", label: "Segment", render: (c) => <span className="font-bold">{c.segment}</span> },
    { key: "status", label: "Status", sortable: true, render: (c) => <StatusBadge status={c.status} /> },
    { key: "actions", label: "Actions", render: (c) => (
      <div className="flex items-center gap-2">
        <button className={iconButtonClass} onClick={() => openEdit(c)} title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
        {canDelete && <button className={iconButtonDangerClass} onClick={() => setDeleteTarget(c)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Campaigns</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">Manage seasonal promotions shown on the homepage.</p>
        </div>
        {canWrite && <button onClick={openCreate} className={`${buttonPrimaryClass} flex items-center gap-1.5`}><Plus className="w-4 h-4" /> New Campaign</button>}
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
          <select value={segmentFilter} onChange={(e) => setSegmentFilter(e.target.value)} className={`${inputClass} !w-auto`}>
            <option value="">All Segments</option>
            {SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        }
      />
      <Pagination page={list.page} totalPages={list.totalPages} total={list.total} pageSize={list.pageSize} onPageChange={list.setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Campaign" : "Create Campaign"} wide>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Banner Image</label>
            <ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="campaigns" />
          </div>
          <div>
            <label className={labelClass}>Segment</label>
            <select value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} className={inputClass}>
              {SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Link Target Page</label>
            <input required value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="cards / loans / accounts" className={inputClass} />
          </div>
          <div />
          <div>
            <label className={labelClass}>Badge (Arabic)</label>
            <input required dir="rtl" value={form.badgeAr} onChange={(e) => setForm({ ...form, badgeAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Badge (English)</label>
            <input required value={form.badgeEn} onChange={(e) => setForm({ ...form, badgeEn: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Title (Arabic)</label>
            <input required dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Title (English)</label>
            <input required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description (Arabic)</label>
            <textarea required dir="rtl" rows={3} value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description (English)</label>
            <textarea required rows={3} value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} className={inputClass} />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className={buttonSecondaryClass}>Cancel</button>
            <button type="submit" disabled={saving} className={buttonPrimaryClass}>{saving ? "Saving..." : "Save Campaign"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${deleteTarget?.titleEn}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
