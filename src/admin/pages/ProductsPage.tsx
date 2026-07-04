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
import type { Product } from "../types.ts";
import { useAuth } from "../context/AuthContext.tsx";

const GROUPS = ["ACCOUNT", "LOAN", "CARD", "ELECTRONIC_SERVICE", "TRANSFER"];
const SEGMENTS = ["PERSONAL", "BUSINESS"];
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

type ProductForm = {
  slug: string;
  group: string;
  segment: string;
  status: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  descAr: string;
  descEn: string;
  bulletsAr: string;
  bulletsEn: string;
  images: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

const EMPTY_FORM: ProductForm = {
  slug: "", group: "ACCOUNT", segment: "PERSONAL", status: "DRAFT",
  titleAr: "", titleEn: "", taglineAr: "", taglineEn: "", descAr: "", descEn: "",
  bulletsAr: "", bulletsEn: "", images: [], seoTitle: "", seoDescription: "", seoKeywords: "",
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
}

export default function ProductsPage() {
  const { user } = useAuth();
  const canWrite = user?.role === "ADMIN" || user?.role === "EDITOR";
  const canDelete = user?.role === "ADMIN";

  const [groupFilter, setGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const list = useResourceList<Product>({
    basePath: "/api/admin/products",
    extraParams: { group: groupFilter || undefined, status: statusFilter || undefined },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      slug: product.slug,
      group: product.group,
      segment: product.segment,
      status: product.status,
      titleAr: product.titleAr,
      titleEn: product.titleEn,
      taglineAr: product.taglineAr,
      taglineEn: product.taglineEn,
      descAr: product.descAr,
      descEn: product.descEn,
      bulletsAr: product.bulletsAr.join("\n"),
      bulletsEn: product.bulletsEn.join("\n"),
      images: product.images ?? [],
      seoTitle: product.seoTitle ?? "",
      seoDescription: product.seoDescription ?? "",
      seoKeywords: product.seoKeywords ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.titleEn),
        bulletsAr: form.bulletsAr.split("\n").map((b) => b.trim()).filter(Boolean),
        bulletsEn: form.bulletsEn.split("\n").map((b) => b.trim()).filter(Boolean),
      };
      if (editing) {
        await api.patch(`/api/admin/products/${editing.id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/api/admin/products", payload);
        toast.success("Product created");
      }
      setModalOpen(false);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/products/${deleteTarget.id}`);
      toast.success("Product deleted");
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Product>[] = [
    { key: "titleEn", label: "Product", sortable: true, render: (p) => (
      <div>
        <div className="font-black text-gray-900 dark:text-white">{p.titleEn}</div>
        <div className="text-[10px] text-gray-400 font-bold mt-0.5">{p.titleAr}</div>
      </div>
    ) },
    { key: "group", label: "Group", render: (p) => <span className="font-bold">{p.group}</span> },
    { key: "segment", label: "Segment", render: (p) => <span className="font-bold">{p.segment}</span> },
    { key: "slug", label: "Slug", render: (p) => <span className="font-mono text-gray-400">{p.slug}</span> },
    { key: "status", label: "Status", sortable: true, render: (p) => <StatusBadge status={p.status} /> },
    { key: "actions", label: "Actions", render: (p) => (
      <div className="flex items-center gap-2">
        <button className={iconButtonClass} onClick={() => openEdit(p)} title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
        {canDelete && (
          <button className={iconButtonDangerClass} onClick={() => setDeleteTarget(p)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
        )}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Products</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">Manage accounts, loans, cards, e-services, and transfers.</p>
        </div>
        {canWrite && (
          <button onClick={openCreate} className={`${buttonPrimaryClass} flex items-center gap-1.5`}>
            <Plus className="w-4 h-4" /> New Product
          </button>
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
          <>
            <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className={`${inputClass} !w-auto`}>
              <option value="">All Groups</option>
              {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} !w-auto`}>
              <option value="">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </>
        }
      />
      <Pagination page={list.page} totalPages={list.totalPages} total={list.total} pageSize={list.pageSize} onPageChange={list.setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "Create Product"} wide>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Group</label>
            <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} className={inputClass}>
              {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
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
            <label className={labelClass}>Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from English title" className={`${inputClass} font-mono`} />
          </div>

          <div className="md:col-span-2 border-t border-gray-200 dark:border-neutral-800 pt-3">
            <span className="text-[10px] text-brand uppercase tracking-widest font-black">Arabic</span>
          </div>
          <div>
            <label className={labelClass}>Title (Arabic)</label>
            <input required dir="rtl" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tagline (Arabic)</label>
            <input required dir="rtl" value={form.taglineAr} onChange={(e) => setForm({ ...form, taglineAr: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description (Arabic)</label>
            <textarea required dir="rtl" rows={3} value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Bullets (Arabic, one per line)</label>
            <textarea dir="rtl" rows={3} value={form.bulletsAr} onChange={(e) => setForm({ ...form, bulletsAr: e.target.value })} className={inputClass} />
          </div>

          <div className="md:col-span-2 border-t border-gray-200 dark:border-neutral-800 pt-3">
            <span className="text-[10px] text-brand uppercase tracking-widest font-black">English</span>
          </div>
          <div>
            <label className={labelClass}>Title (English)</label>
            <input required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tagline (English)</label>
            <input required value={form.taglineEn} onChange={(e) => setForm({ ...form, taglineEn: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description (English)</label>
            <textarea required rows={3} value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Bullets (English, one per line)</label>
            <textarea rows={3} value={form.bulletsEn} onChange={(e) => setForm({ ...form, bulletsEn: e.target.value })} className={inputClass} />
          </div>

          <div className="md:col-span-2 border-t border-gray-200 dark:border-neutral-800 pt-3">
            <span className="text-[10px] text-brand uppercase tracking-widest font-black">Media & SEO</span>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Cover Image</label>
            <ImageUploader
              value={form.images[0]}
              onChange={(url) => setForm({ ...form, images: url ? [url, ...form.images.slice(1)] : form.images.slice(1) })}
              folder="products"
            />
          </div>
          <div>
            <label className={labelClass}>SEO Title</label>
            <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SEO Keywords</label>
            <input value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>SEO Description</label>
            <textarea rows={2} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className={inputClass} />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className={buttonSecondaryClass}>Cancel</button>
            <button type="submit" disabled={saving} className={buttonPrimaryClass}>{saving ? "Saving..." : "Save Product"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.titleEn}"? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
