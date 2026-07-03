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
import RichTextEditor from "../components/RichTextEditor.tsx";
import { inputClass, labelClass, buttonPrimaryClass, buttonSecondaryClass, iconButtonClass, iconButtonDangerClass } from "../components/formClasses.ts";
import { useResourceList } from "../hooks/useResourceList.ts";
import { api, ApiClientError } from "../api/client.ts";
import type { NewsArticle } from "../types.ts";
import { useAuth } from "../context/AuthContext.tsx";

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

type NewsForm = {
  slug: string; status: string;
  titleAr: string; titleEn: string; descAr: string; descEn: string;
  contentAr: string; contentEn: string; image: string;
  seoTitle: string; seoDescription: string;
};

const EMPTY_FORM: NewsForm = {
  slug: "", status: "DRAFT", titleAr: "", titleEn: "", descAr: "", descEn: "",
  contentAr: "", contentEn: "", image: "", seoTitle: "", seoDescription: "",
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
}

export default function NewsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canWrite = user?.role === "ADMIN" || user?.role === "EDITOR";
  const canDelete = user?.role === "ADMIN";
  const [statusFilter, setStatusFilter] = useState("");

  const list = useResourceList<NewsArticle>({ basePath: "/api/admin/news", extraParams: { status: statusFilter || undefined } });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState<NewsForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (article: NewsArticle) => {
    setEditing(article);
    setForm({
      slug: article.slug, status: article.status,
      titleAr: article.titleAr, titleEn: article.titleEn, descAr: article.descAr, descEn: article.descEn,
      contentAr: article.contentAr, contentEn: article.contentEn, image: article.image ?? "",
      seoTitle: article.seoTitle ?? "", seoDescription: article.seoDescription ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.titleEn) };
      if (editing) {
        await api.patch(`/api/admin/news/${editing.id}`, payload);
        toast.success(t("news.toasts.updated"));
      } else {
        await api.post("/api/admin/news", payload);
        toast.success(t("news.toasts.created"));
      }
      setModalOpen(false);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : t("news.toasts.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/news/${deleteTarget.id}`);
      toast.success(t("news.toasts.deleted"));
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : t("news.toasts.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<NewsArticle>[] = [
    { key: "titleEn", label: t("news.table.article"), sortable: true, render: (n) => (
      <div className="flex items-center gap-3">
        {n.image && <img src={n.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
        <div>
          <div className="font-black text-gray-900 dark:text-white">{n.titleEn}</div>
          <div className="text-[10px] text-gray-400 font-bold mt-0.5">{n.titleAr}</div>
        </div>
      </div>
    ) },
    { key: "slug", label: t("news.table.slug"), render: (n) => <span className="font-mono text-gray-400">{n.slug}</span> },
    { key: "status", label: t("news.table.status"), sortable: true, render: (n) => <StatusBadge status={n.status} /> },
    { key: "publishedAt", label: t("news.table.published"), render: (n) => <span className="text-gray-400">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : "-"}</span> },
    { key: "actions", label: t("common.actions"), render: (n) => (
      <div className="flex items-center gap-2">
        <button className={iconButtonClass} onClick={() => openEdit(n)} title={t("common.edit")}><Edit2 className="w-3.5 h-3.5" /></button>
        {canDelete && <button className={iconButtonDangerClass} onClick={() => setDeleteTarget(n)} title={t("common.delete")}><Trash2 className="w-3.5 h-3.5" /></button>}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">{t("news.title")}</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">{t("news.subtitle")}</p>
        </div>
        {canWrite && (
          <button onClick={openCreate} className={`${buttonPrimaryClass} flex items-center gap-1.5`}><Plus className="w-4 h-4" /> {t("news.newArticle")}</button>
        )}
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
            <option value="">{t("common.allStatuses")}</option>
            {STATUSES.map((s) => <option key={s} value={s}>{t(`contentStatuses.${s}`)}</option>)}
          </select>
        }
      />
      <Pagination page={list.page} totalPages={list.totalPages} total={list.total} pageSize={list.pageSize} onPageChange={list.setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t("news.editArticle") : t("news.createArticle")} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("news.slug")}</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={t("news.slugPlaceholder")} className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className={labelClass}>{t("news.status")}</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                {STATUSES.map((s) => <option key={s} value={s}>{t(`contentStatuses.${s}`)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>{t("news.coverImage")}</label>
            <ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="news" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("news.titleAr")}</label>
              <input required dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("news.titleEn")}</label>
              <input required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("news.summaryAr")}</label>
              <textarea required dir="rtl" rows={2} value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("news.summaryEn")}</label>
              <textarea required rows={2} value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>{t("news.contentAr")}</label>
            <RichTextEditor value={form.contentAr} onChange={(html) => setForm({ ...form, contentAr: html })} placeholder={t("news.contentArPlaceholder")} />
          </div>
          <div>
            <label className={labelClass}>{t("news.contentEn")}</label>
            <RichTextEditor value={form.contentEn} onChange={(html) => setForm({ ...form, contentEn: html })} placeholder={t("news.contentEnPlaceholder")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("news.seoTitle")}</label>
              <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("news.seoDescription")}</label>
              <input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className={buttonSecondaryClass}>{t("common.cancel")}</button>
            <button type="submit" disabled={saving} className={buttonPrimaryClass}>{saving ? t("common.saving") : t("news.saveArticle")}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t("news.deleteTitle")}
        message={t("news.deleteMessage", { name: deleteTarget?.titleEn })}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
