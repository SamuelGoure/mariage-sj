"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Download, Search, Users } from "lucide-react";

interface RsvpItem {
  id: number;
  firstName: string;
  lastName: string;
  attending: boolean;
  guestCount: number;
  mealChoice: string[] | null;
  allergies: string | null;
  message: string | null;
  createdAt: string;
}

export default function AdminRsvpPage() {
  const [rsvps, setRsvps] = useState<RsvpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "attending" | "declined">("all");

  useEffect(() => {
    fetch("/api/rsvp")
      .then((r) => r.json())
      .then((data) => { setRsvps(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = rsvps
    .filter((r) => filter === "all" ? true : filter === "attending" ? r.attending : !r.attending)
    .filter((r) =>
      search === "" ? true :
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

  function exportCsv() {
    const headers = ["ID", "Prénom", "Nom", "Présent", "Nb personnes", "Repas", "Allergies", "Message", "Date"];
    const rows = rsvps.map((r) => [
      r.id,
      r.firstName,
      r.lastName,
      r.attending ? "Oui" : "Non",
      r.guestCount,
      (r.mealChoice ?? []).join(", "),
      r.allergies ?? "",
      r.message ?? "",
      new Date(r.createdAt).toLocaleDateString("fr-FR"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "rsvp_mariage.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#1A2B5F] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm text-blue-300 hover:text-white mb-2 block">← Dashboard</Link>
            <h1 className="font-heading text-4xl text-white">Gestion RSVP</h1>
          </div>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e91e8c] text-white text-sm font-medium hover:bg-[#c4177a] transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total", value: rsvps.length, color: "#F4A7B9" },
            { label: "Présents", value: rsvps.filter((r) => r.attending).length, color: "#4ade80" },
            { label: "Déclinés", value: rsvps.filter((r) => !r.attending).length, color: "#f87171" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-center">
              <p className="font-heading text-3xl text-white" style={{ color }}>{value}</p>
              <p className="text-xs text-blue-300 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filtres + recherche */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
            <input
              type="text"
              placeholder="Rechercher un invité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-[#e91e8c]"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "attending", "declined"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  filter === f ? "bg-[#e91e8c] text-white" : "bg-white/5 text-blue-300 hover:bg-white/10"
                }`}
              >
                {{ all: "Tous", attending: "Présents", declined: "Déclinés" }[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <p className="text-center py-16 text-blue-300 animate-pulse">Chargement...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-16 text-blue-300">Aucun résultat.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-blue-300 text-left">
                    {["Invité", "Présence", "Personnes", "Repas", "Allergies", "Date"].map((h) => (
                      <th key={h} className="px-6 py-4 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium whitespace-nowrap">
                        {r.firstName} {r.lastName}
                      </td>
                      <td className="px-6 py-4">
                        {r.attending ? (
                          <span className="flex items-center gap-1.5 text-green-400">
                            <CheckCircle className="w-4 h-4" /> Oui
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-400">
                            <XCircle className="w-4 h-4" /> Non
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-blue-200">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3 h-3" /> {r.guestCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-200 text-xs">
                        {(r.mealChoice ?? []).join(", ") || "—"}
                      </td>
                      <td className="px-6 py-4 text-blue-200 text-xs max-w-xs truncate">
                        {r.allergies || "—"}
                      </td>
                      <td className="px-6 py-4 text-blue-400 whitespace-nowrap text-xs">
                        {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
