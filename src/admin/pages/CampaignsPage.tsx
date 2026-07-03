import React, { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        toast.success(t("campaigns.toasts.updated"));
      } else {
        await api.post("/api/admin/campaigns", form);
        toast.success(t("campaigns.toasts.created"));
      }
      setModalOpen(false);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : t("campaigns.toasts.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/campaigns/${deleteTarget.id}`);
      toast.success(t("campaigns.toasts.deleted"));
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : t("campaigns.toasts.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Campaign>[] = [
    { key: "titleEn", label: t("campaigns.table.campaign"), sortable: true, render: (c) => (
      <div className="flex items-center gap-3">
        <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
        <div>
          <div className="font-black text-gray-900 dark:text-white">{c.titleEn}</div>
          <div className="text-[10px] text-gray-400 font-bold mt-0.5">{c.badgeEn}</div>
        </div>
      </div>
    ) },
    { key: "segment", label: t("campaigns.table.segment"), render: (c) => <span className="font-bold">{t(`products.segments.${c.segment}`)}</span> },
    { key: "status", label: t("campaigns.table.status"), sortable: true, render: (c) => <StatusBadge status={c.status} /> },
    { key: "actions", label: t("common.actions"), render: (c) => (
      <div className="flex items-center gap-2">
        <button className={iconButtonClass} onClick={() => openEdit(c)} title={t("common.edit")}><Edit2 className="w-3.5 h-3.5" /></button>
        {canDelete && <button className={iconButtonDangerClass} onClick={() => setDeleteTarget(c)} title={t("common.delete")}><Trash2 className="w-3.5 h-3.5" /></button>}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">{t("campaigns.title")}</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">{t("campaigns.subtitle")}</p>
        </div>
        {canWrite && <button onClick={openCreate} className={`${buttonPrimaryClass} flex items-center gap-1.5`}><Plus className="w-4 h-4" /> {t("campaigns.newCampaign")}</button>}
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
            <option value="">{t("common.allSegments")}</option>
            {SEGMENTS.map((s) => <option key={s} value={s}>{t(`products.segments.${s}`)}</option>)}
          </select>
        }
      />
      <Pagination page={list.page} totalPages={list.totalPages} total={list.total} pageSize={list.pageSize} onPageChange={list.setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t("campaigns.editCampaign") : t("campaigns.createCampaign")} wide>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>{t("campaigns.bannerImage")}</label>
            <ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="campaigns" />
          </div>
          <div>
            <label className={labelClass}>{t("campaigns.segment")}</label>
            <select value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} className={inputClass}>
              {SEGMENTS.map((s) => <option key={s} value={s}>{t(`products.segments.${s}`)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("campaigns.status")}</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              {STATUSES.map((s) => <option key={s} value={s}>{t(`contentStatuses.${s}`)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("campaigns.linkTarget")}</label>
            <input required value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder={t("campaigns.linkTargetPlaceholder")} className={inputClass} />
          </div>
          <div />
          <div>
            <label className={labelClass}>{t("campaigns.badgeAr")}</label>
            <input required dir="rtl" value={form.badgeAr} onChange={(e) => setForm({ ...form, badgeAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("campaigns.badgeEn")}</label>
            <input required value={form.badgeEn} onChange={(e) => setForm({ ...form, badgeEn: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("campaigns.titleAr")}</label>
            <input required dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("campaigns.titleEn")}</label>
            <input required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("campaigns.descAr")}</label>
            <textarea required dir="rtl" rows={3} value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("campaigns.descEn")}</label>
            <textarea required rows={3} value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} className={inputClass} />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className={buttonSecondaryClass}>{t("common.cancel")}</button>
            <button type="submit" disabled={saving} className={buttonPrimaryClass}>{saving ? t("common.saving") : t("campaigns.saveCampaign")}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t("campaigns.deleteTitle")}
        message={t("campaigns.deleteMessage", { name: deleteTarget?.titleEn })}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
