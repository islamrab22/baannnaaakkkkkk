import React, { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.tsx";
import { api, ApiClientError } from "../api/client.ts";
import { inputClass, labelClass, buttonPrimaryClass } from "../components/formClasses.ts";
import ImageUploader from "../components/ImageUploader.tsx";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, refreshUser, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.patch("/api/auth/me", { name, avatarUrl: avatarUrl || null });
      await refreshUser();
      toast.success(t("profile.toasts.profileUpdated"));
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : t("profile.toasts.profileFailed"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.post("/api/auth/change-password", { currentPassword, newPassword });
      toast.success(t("profile.toasts.passwordChanged"));
      await logout();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : t("profile.toasts.passwordFailed"));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">{t("profile.title")}</h1>
        <p className="text-xs text-gray-400 font-medium mt-1">{t("profile.subtitle")}</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{t("profile.personalInfo")}</h3>
        <div>
          <label className={labelClass}>{t("profile.avatar")}</label>
          <div className="w-24">
            <ImageUploader value={avatarUrl} onChange={setAvatarUrl} folder="avatars" />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t("profile.fullName")}</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("profile.email")}</label>
          <input disabled value={user?.email ?? ""} className={`${inputClass} opacity-60 cursor-not-allowed`} />
        </div>
        <div>
          <label className={labelClass}>{t("profile.role")}</label>
          <input disabled value={user ? t(`roles.${user.role}`) : ""} className={`${inputClass} opacity-60 cursor-not-allowed`} />
        </div>
        <button type="submit" disabled={savingProfile} className={buttonPrimaryClass}>{savingProfile ? t("common.saving") : t("profile.saveProfile")}</button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{t("profile.changePassword")}</h3>
        <div>
          <label className={labelClass}>{t("profile.currentPassword")}</label>
          <input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("profile.newPassword")}</label>
          <input required minLength={8} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
        </div>
        <button type="submit" disabled={savingPassword} className={buttonPrimaryClass}>{savingPassword ? t("common.updating") : t("profile.updatePassword")}</button>
      </form>
    </div>
  );
}
