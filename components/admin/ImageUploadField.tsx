"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

export default function ImageUploadField({
  value, onChange,
}: { value?: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Erreur d'upload.");
      return;
    }
    onChange(data.url);
  }

  return (
    <div className="flex items-center gap-3">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="w-14 h-14 rounded-lg object-cover border border-white/10" />
      )}
      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer transition-colors">
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
        {uploading ? "Envoi…" : "Changer l'image"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}
