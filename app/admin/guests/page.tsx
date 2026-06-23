"use client";

import { useEffect, useState, useRef } from "react";
import {
  Users, UserCheck, UserX, Clock, Search, Plus, Upload,
  Copy, Trash2, ChevronDown, X, Check,
} from "lucide-react";

type GuestStatus = "PENDING" | "CONFIRMED" | "DECLINED";

type Guest = {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  group: string | null;
  token: string;
  status: GuestStatus;
  rsvp: { attending: boolean; guestCount: number } | null;
  createdAt: string;
};

const STATUS_LABEL: Record<GuestStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  DECLINED: "Décliné",
};
const STATUS_COLOR: Record<GuestStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  DECLINED: "bg-red-100 text-red-700",
};

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number; color: string;
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold text-white leading-none">{value}</p>
        <p className="text-white/60 text-sm mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Formulaire ajout
  const [form, setForm] = useState({ name: "", phone: "", address: "", group: "" });
  const [csvText, setCsvText] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function load() {
    setLoading(true);
    const res = await fetch("/api/guests");
    setGuests(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Stats
  const total = guests.length;
  const confirmed = guests.filter(g => g.status === "CONFIRMED").length;
  const declined = guests.filter(g => g.status === "DECLINED").length;
  const pending = guests.filter(g => g.status === "PENDING").length;
  const totalSeats = guests
    .filter(g => g.rsvp?.attending)
    .reduce((s, g) => s + (g.rsvp?.guestCount ?? 1), 0);

  // Groupes disponibles
  const groups = [...new Set(guests.map(g => g.group).filter(Boolean))] as string[];

  // Filtres
  const filtered = guests.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = !q || g.name.toLowerCase().includes(q) || (g.phone ?? "").includes(q) || (g.group ?? "").toLowerCase().includes(q);
    const matchGroup = filterGroup === "all" || g.group === filterGroup;
    const matchStatus = filterStatus === "all" || g.status === filterStatus;
    return matchSearch && matchGroup && matchStatus;
  });

  async function addGuest() {
    if (!form.name.trim()) return;
    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", phone: "", address: "", group: "" });
    setShowAddModal(false);
    load();
  }

  async function deleteGuest(id: number) {
    if (!confirm("Supprimer cet invité ?")) return;
    await fetch(`/api/guests/${id}`, { method: "DELETE" });
    setGuests(prev => prev.filter(g => g.id !== id));
  }

  function copyLink(guest: Guest) {
    navigator.clipboard.writeText(`${origin}/rsvp?g=${guest.token}`);
    setCopied(guest.id);
    setTimeout(() => setCopied(null), 1800);
  }

  // Import CSV : format attendu — name,phone,address,group (une ligne par invité)
  async function importCsv() {
    const lines = csvText.trim().split("\n").filter(Boolean);
    const data = lines.map(line => {
      const [name, phone, address, group] = line.split(",").map(s => s.trim());
      return { name, phone, address, group };
    }).filter(d => d.name);
    if (!data.length) return;
    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setCsvText("");
    setShowImport(false);
    load();
  }

  // Export CSV
  function exportCsv() {
    const header = "Nom,Téléphone,Adresse,Groupe,Statut,Couverts,Lien RSVP";
    const rows = guests.map(g =>
      [g.name, g.phone ?? "", g.address ?? "", g.group ?? "",
       STATUS_LABEL[g.status], g.rsvp?.guestCount ?? "",
       `${origin}/rsvp?g=${g.token}`].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "invites.csv"; a.click();
  }

  return (
    <div className="min-h-screen bg-[#1A2B5F] p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Liste des invités</h1>
            <p className="text-white/50 mt-1 text-sm">Gérez votre liste, suivez les confirmations, partagez les liens RSVP</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCsv}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
              <Upload className="w-4 h-4 rotate-180" /> Exporter
            </button>
            <button onClick={() => setShowImport(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
              <Upload className="w-4 h-4" /> Import CSV
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e91e8c] hover:bg-[#c4177a] text-white text-sm font-semibold transition-colors">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users}     label="Total invités"   value={total}      color="bg-blue-500" />
          <StatCard icon={UserCheck} label="Confirmés"       value={confirmed}  color="bg-emerald-500" />
          <StatCard icon={UserX}     label="Déclinés"        value={declined}   color="bg-red-500" />
          <StatCard icon={Clock}     label="En attente"      value={pending}    color="bg-amber-500" />
        </div>

        {/* Couverts total */}
        {totalSeats > 0 && (
          <div className="bg-[#e91e8c]/20 border border-[#e91e8c]/30 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-[#F4A7B9]" />
            <p className="text-white text-sm">
              <strong className="text-[#F4A7B9] text-lg">{totalSeats}</strong> couverts confirmés au total
            </p>
          </div>
        )}

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un invité…"
              className="w-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60" />
          </div>

          <div className="relative">
            <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}
              className="appearance-none bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm pr-8 outline-none focus:border-[#e91e8c]/60 cursor-pointer">
              <option value="all">Tous les groupes</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm pr-8 outline-none focus:border-[#e91e8c]/60 cursor-pointer">
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmés</option>
              <option value="DECLINED">Déclinés</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50 pointer-events-none" />
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          {loading ? (
            <div className="py-20 text-center text-white/40">Chargement…</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-white/40">Aucun invité trouvé.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50 uppercase text-xs tracking-wider">
                  <th className="text-left px-5 py-4">Nom</th>
                  <th className="text-left px-4 py-4 hidden md:table-cell">Téléphone</th>
                  <th className="text-left px-4 py-4 hidden lg:table-cell">Groupe</th>
                  <th className="text-left px-4 py-4">Statut</th>
                  <th className="text-left px-4 py-4 hidden sm:table-cell">Couverts</th>
                  <th className="text-right px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => (
                  <tr key={g.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{g.name}</p>
                      {g.address && <p className="text-white/40 text-xs mt-0.5 truncate max-w-[180px]">{g.address}</p>}
                    </td>
                    <td className="px-4 py-4 text-white/60 hidden md:table-cell">{g.phone ?? "—"}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {g.group
                        ? <span className="px-2.5 py-1 rounded-full bg-[#4A90D9]/20 text-[#4A90D9] text-xs font-medium">{g.group}</span>
                        : <span className="text-white/30">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[g.status]}`}>
                        {STATUS_LABEL[g.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/60 hidden sm:table-cell">
                      {g.rsvp ? `${g.rsvp.guestCount} pers.` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => copyLink(g)} title="Copier le lien RSVP"
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors">
                          {copied === g.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => deleteGuest(g.id)} title="Supprimer"
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-red-500/30 text-white/60 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-white/30 text-xs mt-3 text-right">{filtered.length} / {total} invités</p>

        {/* ── Modal ajout ── */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e3370] rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Ajouter un invité</h3>
                <button onClick={() => setShowAddModal(false)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { key: "name",    label: "Nom complet *",     placeholder: "Marie Dupont" },
                  { key: "phone",   label: "Téléphone",          placeholder: "+33 6 12 34 56 78" },
                  { key: "address", label: "Adresse / Ville",    placeholder: "Paris 75001" },
                  { key: "group",   label: "Groupe",             placeholder: "Famille mariée, Amis, Collègues…" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">{label}</label>
                    <input
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                  Annuler
                </button>
                <button onClick={addGuest} disabled={!form.name.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#e91e8c] hover:bg-[#c4177a] disabled:opacity-40 text-white text-sm font-semibold transition-colors">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal import CSV ── */}
        {showImport && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e3370] rounded-3xl p-8 w-full max-w-lg border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Import CSV</h3>
                <button onClick={() => setShowImport(false)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/50 text-xs mb-4 bg-white/5 rounded-xl px-4 py-3 font-mono leading-relaxed">
                Format : <span className="text-[#F4A7B9]">nom, téléphone, adresse, groupe</span><br />
                Marie Dupont, +33612345678, Paris, Famille<br />
                Jean Martin, , Lyon, Amis
              </p>
              <textarea
                value={csvText} onChange={e => setCsvText(e.target.value)}
                rows={8}
                placeholder={"Marie Dupont,+33612345678,Paris 75001,Famille mariée\nJean Martin,,Lyon,Amis"}
                className="w-full bg-white/10 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#e91e8c]/60 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowImport(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                  Annuler
                </button>
                <button onClick={importCsv} disabled={!csvText.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#e91e8c] hover:bg-[#c4177a] disabled:opacity-40 text-white text-sm font-semibold transition-colors">
                  Importer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
