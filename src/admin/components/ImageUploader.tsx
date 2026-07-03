import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client.ts";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUploader({ value, onChange, folder }: ImageUploaderProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      if (folder) form.append("folder", folder);
      const result = await api.upload<{ url: string }>("/api/admin/upload/image", form);
      onChange(result.url);
      toast.success(t("imageUpload.success"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("imageUpload.failed"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-neutral-700 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand hover:text-brand transition-colors"
        >
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
          <span className="text-xs font-bold">{uploading ? t("imageUpload.uploading") : t("imageUpload.clickToUpload")}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
