"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, Image as ImageIcon } from "lucide-react";

interface GalleryItem {
  id: number;
  url: string;
  uploadedBy: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => { setPhotos(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function moderate(id: number, status: "APPROVED" | "REJECTED") {
    await fetch(`/api/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  }

  const filtered = photos.filter((p) => p.status === filter);
  const pendingCount = photos.filter((p) => p.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#1A2B5F] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-blue-300 hover:text-white mb-2 block">← Dashboard</Link>
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-4xl text-white">Modération Galerie</h1>
            {pendingCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-[#e91e8c] text-white text-xs font-semibold">
                {pendingCount} en attente
              </span>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-8">
          {(["PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                filter === f ? "bg-[#e91e8c] text-white" : "bg-white/5 text-blue-300 hover:bg-white/10"
              }`}
            >
              {{ PENDING: "En attente", APPROVED: "Approuvées", REJECTED: "Refusées" }[f]}
              <span className="ml-2 text-xs opacity-70">
                {photos.filter((p) => p.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-16 text-blue-300 animate-pulse">Chargement...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <ImageIcon className="w-12 h-12 text-blue-400/40 mx-auto mb-4" />
            <p className="text-blue-300">
              {filter === "PENDING" ? "Aucune photo en attente." : "Aucune photo ici."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((photo) => (
              <div key={photo.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
                {/* Image */}
                <div className="aspect-square bg-white/10 flex items-center justify-center relative">
                  {photo.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-blue-400/40" />
                  )}
                  {photo.status === "PENDING" && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => moderate(photo.id, "APPROVED")}
                        className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={() => moderate(photo.id, "REJECTED")}
                        className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors"
                      >
                        <XCircle className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  )}
                </div>
                {/* Infos */}
                <div className="px-3 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-200">{photo.uploadedBy || "Anonyme"}</p>
                    <p className="text-xs text-blue-400">
                      {new Date(photo.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {photo.status === "PENDING"   && <Clock       className="w-4 h-4 text-yellow-400" />}
                    {photo.status === "APPROVED"  && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {photo.status === "REJECTED"  && <XCircle     className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
