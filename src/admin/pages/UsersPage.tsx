import React, { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DataTable, { type Column } from "../components/DataTable.tsx";
import Pagination from "../components/Pagination.tsx";
import Modal from "../components/Modal.tsx";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import StatusBadge from "../components/StatusBadge.tsx";
import { inputClass, labelClass, buttonPrimaryClass, buttonSecondaryClass, iconButtonClass, iconButtonDangerClass } from "../components/formClasses.ts";
import { useResourceList } from "../hooks/useResourceList.ts";
import { api, ApiClientError } from "../api/client.ts";
import type { AdminUserRecord, Role } from "../types.ts";
import { useAuth } from "../context/AuthContext.tsx";

const ROLES: Role[] = ["ADMIN", "EDITOR", "VIEWER"];

type UserForm = { name: string; email: string; password: string; role: Role; isActive: boolean };
const EMPTY_FORM: UserForm = { name: "", email: "", password: "", role: "VIEWER", isActive: true };

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const list = useResourceList<AdminUserRecord>({ basePath: "/api/admin/users", defaultSortBy: "name" });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserRecord | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (u: AdminUserRecord) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role, isActive: u.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const payload: Record<string, unknown> = { name: form.name, email: form.email, role: form.role, isActive: form.isActive };
        if (form.password) payload.password = form.password;
        await api.patch(`/api/admin/users/${editing.id}`, payload);
        toast.success("User updated");
      } else {
        await api.post("/api/admin/users", form);
        toast.success("User created");
      }
      setModalOpen(false);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/users/${deleteTarget.id}`);
      toast.success("User deleted");
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminUserRecord>[] = [
    { key: "name", label: "Name", sortable: true, render: (u) => (
      <div>
        <div className="font-black text-gray-900 dark:text-white">{u.name}</div>
        <div className="text-[10px] text-gray-400 font-bold">{u.email}</div>
      </div>
    ) },
    { key: "role", label: "Role", sortable: true, render: (u) => <span className="font-black text-[10px] uppercase">{u.role}</span> },
    { key: "isActive", label: "Status", render: (u) => <StatusBadge status={u.isActive ? "ACTIVE" : "INACTIVE"} /> },
    { key: "lastLoginAt", label: "Last Login", render: (u) => <span className="text-gray-400">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}</span> },
    { key: "actions", label: "Actions", render: (u) => (
      <div className="flex items-center gap-2">
        <button className={iconButtonClass} onClick={() => openEdit(u)} title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
        {currentUser?.id !== u.id && (
          <button className={iconButtonDangerClass} onClick={() => setDeleteTarget(u)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
        )}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Users</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">Manage staff accounts and role-based access.</p>
        </div>
        <button onClick={openCreate} className={`${buttonPrimaryClass} flex items-center gap-1.5`}><Plus className="w-4 h-4" /> New User</button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit User" : "Create User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{editing ? "New Password (leave blank to keep unchanged)" : "Password"}</label>
            <input type="password" required={!editing} minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className={inputClass}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {editing && (
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Account active
            </label>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className={buttonSecondaryClass}>Cancel</button>
            <button type="submit" disabled={saving} className={buttonPrimaryClass}>{saving ? "Saving..." : "Save User"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? They will immediately lose access.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
