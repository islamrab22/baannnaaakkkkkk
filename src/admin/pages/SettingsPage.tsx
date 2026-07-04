import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, ApiClientError } from "../api/client.ts";
import type { Settings } from "../types.ts";
import { inputClass, labelClass, buttonPrimaryClass } from "../components/formClasses.ts";
import ImageUploader from "../components/ImageUploader.tsx";

export default function SettingsPage() {
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
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="text-center py-20 text-gray-400 font-bold text-sm">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">Settings</h1>
        <p className="text-xs text-gray-400 font-medium mt-1">Configure site identity, contact details, and SEO defaults.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Site Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Site Name (Arabic)</label>
              <input dir="rtl" value={settings.siteNameAr} onChange={(e) => update("siteNameAr", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Site Name (English)</label>
              <input value={settings.siteNameEn} onChange={(e) => update("siteNameEn", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Logo</label>
            <ImageUploader value={settings.logoUrl ?? ""} onChange={(url) => update("logoUrl", url)} folder="settings" />
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Contact Email</label>
              <input type="email" value={settings.contactEmail ?? ""} onChange={(e) => update("contactEmail", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Phone</label>
              <input value={settings.contactPhone ?? ""} onChange={(e) => update("contactPhone", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Address (Arabic)</label>
              <input dir="rtl" value={settings.contactAddressAr ?? ""} onChange={(e) => update("contactAddressAr", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Address (English)</label>
              <input value={settings.contactAddressEn ?? ""} onChange={(e) => update("contactAddressEn", e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Facebook URL</label>
              <input value={settings.socialFacebook ?? ""} onChange={(e) => update("socialFacebook", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Twitter / X URL</label>
              <input value={settings.socialTwitter ?? ""} onChange={(e) => update("socialTwitter", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input value={settings.socialInstagram ?? ""} onChange={(e) => update("socialInstagram", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input value={settings.socialLinkedin ?? ""} onChange={(e) => update("socialLinkedin", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>YouTube URL</label>
              <input value={settings.socialYoutube ?? ""} onChange={(e) => update("socialYoutube", e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Homepage & SEO</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Homepage Hero Text (Arabic)</label>
              <textarea dir="rtl" rows={2} value={settings.homepageHeroAr ?? ""} onChange={(e) => update("homepageHeroAr", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Homepage Hero Text (English)</label>
              <textarea rows={2} value={settings.homepageHeroEn ?? ""} onChange={(e) => update("homepageHeroEn", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SEO Title</label>
              <input value={settings.seoTitle ?? ""} onChange={(e) => update("seoTitle", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SEO Keywords</label>
              <input value={settings.seoKeywords ?? ""} onChange={(e) => update("seoKeywords", e.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>SEO Description</label>
              <textarea rows={2} value={settings.seoDescription ?? ""} onChange={(e) => update("seoDescription", e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className={buttonPrimaryClass}>{saving ? "Saving..." : "Save Settings"}</button>
        </div>
      </form>
    </div>
  );
}
