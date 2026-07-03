import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { api, ApiClientError } from "../api/client.ts";
import type { Settings } from "../types.ts";
import { inputClass, labelClass, buttonPrimaryClass } from "../components/formClasses.ts";
import ImageUploader from "../components/ImageUploader.tsx";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Settings>("/api/admin/settings").then(setSettings).finally(() => setLoading(false));
  }, []);

  const update = (field: keyof Settings, value: string) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await api.patch<Settings>("/api/admin/settings", settings);
      setSettings(updated);
      toast.success(t("settings.toasts.saved"));
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : t("settings.toasts.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="text-center py-20 text-gray-400 font-bold text-sm">{t("settings.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">{t("settings.title")}</h1>
        <p className="text-xs text-gray-400 font-medium mt-1">{t("settings.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{t("settings.siteIdentity")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("settings.siteNameAr")}</label>
              <input dir="rtl" value={settings.siteNameAr} onChange={(e) => update("siteNameAr", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.siteNameEn")}</label>
              <input value={settings.siteNameEn} onChange={(e) => update("siteNameEn", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>{t("settings.logo")}</label>
            <ImageUploader value={settings.logoUrl ?? ""} onChange={(url) => update("logoUrl", url)} folder="settings" />
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{t("settings.contactInfo")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("settings.contactEmail")}</label>
              <input type="email" value={settings.contactEmail ?? ""} onChange={(e) => update("contactEmail", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.contactPhone")}</label>
              <input value={settings.contactPhone ?? ""} onChange={(e) => update("contactPhone", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.addressAr")}</label>
              <input dir="rtl" value={settings.contactAddressAr ?? ""} onChange={(e) => update("contactAddressAr", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.addressEn")}</label>
              <input value={settings.contactAddressEn ?? ""} onChange={(e) => update("contactAddressEn", e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{t("settings.socialMedia")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("settings.facebookUrl")}</label>
              <input value={settings.socialFacebook ?? ""} onChange={(e) => update("socialFacebook", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.twitterUrl")}</label>
              <input value={settings.socialTwitter ?? ""} onChange={(e) => update("socialTwitter", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.instagramUrl")}</label>
              <input value={settings.socialInstagram ?? ""} onChange={(e) => update("socialInstagram", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.linkedinUrl")}</label>
              <input value={settings.socialLinkedin ?? ""} onChange={(e) => update("socialLinkedin", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.youtubeUrl")}</label>
              <input value={settings.socialYoutube ?? ""} onChange={(e) => update("socialYoutube", e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{t("settings.homepageAndSeo")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("settings.heroTextAr")}</label>
              <textarea dir="rtl" rows={2} value={settings.homepageHeroAr ?? ""} onChange={(e) => update("homepageHeroAr", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.heroTextEn")}</label>
              <textarea rows={2} value={settings.homepageHeroEn ?? ""} onChange={(e) => update("homepageHeroEn", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.seoTitle")}</label>
              <input value={settings.seoTitle ?? ""} onChange={(e) => update("seoTitle", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t("settings.seoKeywords")}</label>
              <input value={settings.seoKeywords ?? ""} onChange={(e) => update("seoKeywords", e.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>{t("settings.seoDescription")}</label>
              <textarea rows={2} value={settings.seoDescription ?? ""} onChange={(e) => update("seoDescription", e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className={buttonPrimaryClass}>{saving ? t("common.saving") : t("settings.saveSettings")}</button>
        </div>
      </form>
    </div>
  );
}
