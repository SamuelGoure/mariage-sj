"use client";

import { useEffect, useState, useRef } from "react";
import {
  Users, UserCheck, UserX, Clock, ShieldQuestion, Search, Plus, Upload,
  Copy, Trash2, Pencil, QrCode, Download, ChevronDown, X, Check, Send, Eye,
} from "lucide-react";
import QRCode from "qrcode";

type GuestStatus = "PENDING" | "AWAITING_VALIDATION" | "CONFIRMED" | "DECLINED";

type Guest = {
  id: number;
  name: string;
  address: string | null;
  group: string | null;
  token: string;
  seatsAllowed: number;
  status: GuestStatus;
  ticketSentAt: string | null;
  rsvp: {
    id: number; attending: boolean; guestCount: number; companions: string[] | null;
    email: string | null; phone: string | null; message: string | null; createdAt: string;
  } | null;
  createdAt: string;
};

const STATUS_LABEL: Record<GuestStatus, string> = {
  PENDING: "En attente",
  AWAITING_VALIDATION: "À valider",
  CONFIRMED: "Confirmé",
  DECLINED: "Décliné",
};
const STATUS_COLOR: Record<GuestStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  AWAITING_VALIDATION: "bg-purple-100 text-purple-700",
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
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState({ name: "", token: "", seatsAllowed: 4, status: "PENDING" as GuestStatus });
  const [editError, setEditError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const [qrGuest, setQrGuest] = useState<Guest | null>(null);
  const [viewGuest, setViewGuest] = useState<Guest | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [sendingTicket, setSendingTicket] = useState<number | null>(null);
  const [ticketError, setTicketError] = useState<{ id: number; message: string } | null>(null);

  // Formulaire ajout
  const [form, setForm] = useState({ name: "", token: "", seatsAllowed: "4" });
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
  const toValidate = guests.filter(g => g.status === "AWAITING_VALIDATION").length;
  const totalSeats = guests
    .filter(g => g.status === "CONFIRMED")
    .reduce((s, g) => s + (g.rsvp?.guestCount ?? 1), 0);

  // Filtres
  const filtered = guests.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = !q || g.name.toLowerCase().includes(q) || g.token.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || g.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function addGuest() {
    if (!form.name.trim()) return;
    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        token: form.token.trim() || undefined,
        seatsAllowed: Number(form.seatsAllowed) || 4,
      }),
    });
    setForm({ name: "", token: "", seatsAllowed: "4" });
    setShowAddModal(false);
    load();
  }

  async function sendTicket(guest: Guest) {
    setSendingTicket(guest.id);
    setTicketError(null);
    try {
      const res = await fetch(`/api/guests/${guest.id}/send-ticket`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setTicketError({ id: guest.id, message: data.error || "Erreur lors de l'envoi." }); return; }
      setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, ticketSentAt: data.ticketSentAt } : g));
    } catch {
      setTicketError({ id: guest.id, message: "Impossible de joindre le serveur." });
    } finally {
      setSendingTicket(null);
    }
  }

  async function deleteGuest(id: number) {
    if (!confirm("Supprimer cet invité ?")) return;
    await fetch(`/api/guests/${id}`, { method: "DELETE" });
    setGuests(prev => prev.filter(g => g.id !== id));
  }

  async function updateSeats(id: number, seatsAllowed: number) {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, seatsAllowed } : g));
    await fetch(`/api/guests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seatsAllowed }),
    });
  }

  async function updateStatus(guest: Guest, status: GuestStatus) {
    if (!guest.rsvp && (status === "CONFIRMED" || status === "DECLINED")) {
      const ok = confirm(
        `${guest.name} n'a pas encore répondu au RSVP en ligne. Le compter quand même comme "${STATUS_LABEL[status]}" ?`
      );
      if (!ok) return;
    }
    setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, status } : g));
    await fetch(`/api/guests/${guest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  function openEdit(guest: Guest) {
    setEditingGuest(guest);
    setEditForm({ name: guest.name, token: guest.token, seatsAllowed: guest.seatsAllowed, status: guest.status });
    setEditError("");
  }

  async function saveEdit() {
    if (!editingGuest) return;
    setEditError("");
    const res = await fetch(`/api/guests/${editingGuest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name.trim(),
        token: editForm.token.trim().toUpperCase(),
        seatsAllowed: Number(editForm.seatsAllowed) || 1,
        status: editForm.status,
      }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      setEditError(d?.error || "Erreur lors de la sauvegarde.");
      return;
    }
    setEditingGuest(null);
    load();
  }

  function copyLink(guest: Guest) {
    navigator.clipboard.writeText(`${origin}/rsvp?g=${guest.token}`);
    setCopied(guest.id);
    setTimeout(() => setCopied(null), 1800);
  }

  async function openQr(guest: Guest) {
    setQrGuest(guest);
    const url = await QRCode.toDataURL(`${origin}/rsvp?g=${guest.token}`, { width: 480, margin: 2 });
    setQrDataUrl(url);
  }

  function downloadQr() {
    if (!qrGuest || !qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `invitation-${qrGuest.token}.png`;
    a.click();
  }

  // Import CSV : format attendu — nom,code (une ligne par invité, code optionnel)
  async function importCsv() {
    const lines = csvText.trim().split("\n").filter(Boolean);
    const data = lines.map(line => {
      const [name, token] = line.split(",").map(s => s.trim());
      return { name, token: token || undefined };
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
    const header = "Nom,Code,Statut,Places allouées,Couverts confirmés,Accompagnants,Email,Téléphone,Lien RSVP";
    const rows = guests.map(g =>
      [g.name, g.token,
       STATUS_LABEL[g.status], g.seatsAllowed, g.rsvp?.guestCount ?? "",
       (g.rsvp?.companions ?? []).join(" | "),
       g.rsvp?.email ?? "", g.rsvp?.phone ?? "",
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Users}         label="Total invités"   value={total}      color="bg-blue-500" />
          <StatCard icon={ShieldQuestion} label="À valider"       value={toValidate} color="bg-purple-500" />
          <StatCard icon={UserCheck}     label="Confirmés"       value={confirmed}  color="bg-emerald-500" />
          <StatCard icon={UserX}         label="Déclinés"        value={declined}   color="bg-red-500" />
          <StatCard icon={Clock}         label="En attente"      value={pending}    color="bg-amber-500" />
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
              placeholder="Rechercher un invité ou un code…"
              className="w-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60" />
          </div>

          <div className="relative">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm pr-8 outline-none focus:border-[#e91e8c]/60 cursor-pointer">
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="AWAITING_VALIDATION">À valider</option>
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
                  <th className="text-left px-4 py-4">Code</th>
                  <th className="text-left px-4 py-4">Statut</th>
                  <th className="text-left px-4 py-4 hidden sm:table-cell">Places allouées</th>
                  <th className="text-left px-4 py-4 hidden md:table-cell">Accompagnants confirmés</th>
                  <th className="text-left px-4 py-4 hidden lg:table-cell">Contact (billets)</th>
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
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs tracking-widest px-2.5 py-1 rounded-lg bg-white/10 text-[#F4A7B9]">{g.token}</span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={g.status}
                        onChange={e => updateStatus(g, e.target.value as GuestStatus)}
                        className={`appearance-none px-2.5 py-1 pr-6 rounded-full text-xs font-semibold border-none outline-none cursor-pointer ${STATUS_COLOR[g.status]}`}
                      >
                        <option value="PENDING">En attente</option>
                        <option value="AWAITING_VALIDATION">À valider</option>
                        <option value="CONFIRMED">Confirmé</option>
                        <option value="DECLINED">Décliné</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <input
                        type="number"
                        min={1}
                        value={g.seatsAllowed}
                        onChange={e => updateSeats(g.id, Math.max(1, Number(e.target.value) || 1))}
                        className="w-16 bg-white/10 border border-white/10 text-white rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#e91e8c]/60"
                      />
                    </td>
                    <td className="px-4 py-4 text-white/60 text-xs hidden md:table-cell max-w-[220px]">
                      {g.rsvp?.attending
                        ? (g.rsvp.companions?.length
                            ? `${g.name} + ${g.rsvp.companions.join(", ")}`
                            : g.name)
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-white/60 text-xs hidden lg:table-cell max-w-[200px]">
                      {g.rsvp?.email ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white/80 truncate">{g.rsvp.email}</span>
                          {g.rsvp.phone && <span>{g.rsvp.phone}</span>}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewGuest(g)} title="Voir toutes les informations"
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {g.status === "CONFIRMED" && g.rsvp?.email && (
                          <button
                            onClick={() => sendTicket(g)}
                            disabled={sendingTicket === g.id}
                            title={
                              ticketError?.id === g.id ? ticketError.message
                              : g.ticketSentAt ? `Billet envoyé le ${new Date(g.ticketSentAt).toLocaleDateString("fr-FR")} — renvoyer`
                              : "Envoyer le billet par email"
                            }
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${
                              ticketError?.id === g.id ? "bg-red-500/20 text-red-400"
                              : g.ticketSentAt ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                            }`}
                          >
                            {sendingTicket === g.id
                              ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              : g.ticketSentAt ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <button onClick={() => copyLink(g)} title="Copier le lien RSVP"
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors">
                          {copied === g.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => openQr(g)} title="QR code"
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors">
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openEdit(g)} title="Modifier"
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
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

        {/* ── Modal détail invité ── */}
        {viewGuest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e3370] rounded-3xl p-8 w-full max-w-lg border border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{viewGuest.name}</h3>
                <button onClick={() => setViewGuest(null)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Code</p>
                    <p className="text-white font-mono">{viewGuest.token}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Statut</p>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[viewGuest.status]}`}>
                      {STATUS_LABEL[viewGuest.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Places allouées</p>
                    <p className="text-white">{viewGuest.seatsAllowed}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Groupe</p>
                    <p className="text-white">{viewGuest.group || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Adresse</p>
                    <p className="text-white">{viewGuest.address || "—"}</p>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {viewGuest.rsvp ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Présence</p>
                        <p className="text-white">{viewGuest.rsvp.attending ? "Présent(e)" : "Absent(e)"}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Couverts</p>
                        <p className="text-white">{viewGuest.rsvp.guestCount}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Email</p>
                        <p className="text-white break-all">{viewGuest.rsvp.email || "—"}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Téléphone</p>
                        <p className="text-white">{viewGuest.rsvp.phone || "—"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Accompagnants</p>
                        <p className="text-white">
                          {viewGuest.rsvp.companions?.length ? viewGuest.rsvp.companions.join(", ") : "—"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Répondu le</p>
                        <p className="text-white">{new Date(viewGuest.rsvp.createdAt).toLocaleString("fr-FR")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1.5">Mot pour les mariés</p>
                      <p className="text-white bg-white/5 rounded-xl px-4 py-3 whitespace-pre-wrap">
                        {viewGuest.rsvp.message || "—"}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-white/40 italic">Aucune réponse RSVP pour le moment.</p>
                )}

                {viewGuest.ticketSentAt && (
                  <p className="text-white/40 text-xs">
                    Billet envoyé le {new Date(viewGuest.ticketSentAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setViewGuest(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

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
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Nom complet *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Marie Dupont"
                    className="w-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Code (4 caractères, auto-généré si vide)</label>
                  <input
                    value={form.token}
                    onChange={e => setForm(f => ({ ...f, token: e.target.value.toUpperCase() }))}
                    placeholder="XXXX"
                    maxLength={4}
                    className="w-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Places allouées</label>
                  <input
                    type="number" min={1}
                    value={form.seatsAllowed}
                    onChange={e => setForm(f => ({ ...f, seatsAllowed: e.target.value }))}
                    className="w-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60"
                  />
                </div>
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

        {/* ── Modal modification ── */}
        {editingGuest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e3370] rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Modifier l&apos;invité</h3>
                <button onClick={() => setEditingGuest(null)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Nom complet</label>
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Code</label>
                  <input
                    value={editForm.token}
                    onChange={e => setEditForm(f => ({ ...f, token: e.target.value.toUpperCase() }))}
                    maxLength={4}
                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Places allouées</label>
                  <input
                    type="number" min={1}
                    value={editForm.seatsAllowed}
                    onChange={e => setEditForm(f => ({ ...f, seatsAllowed: Number(e.target.value) || 1 }))}
                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Statut</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value as GuestStatus }))}
                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60"
                  >
                    <option value="PENDING">En attente</option>
                    <option value="AWAITING_VALIDATION">À valider</option>
                    <option value="CONFIRMED">Confirmé</option>
                    <option value="DECLINED">Décliné</option>
                  </select>
                </div>
                {editError && (
                  <p className="text-sm text-red-400 bg-red-500/10 py-2.5 px-4 rounded-xl border border-red-500/20">
                    {editError}
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditingGuest(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                  Annuler
                </button>
                <button onClick={saveEdit} disabled={!editForm.name.trim() || editForm.token.trim().length === 0}
                  className="flex-1 py-2.5 rounded-xl bg-[#e91e8c] hover:bg-[#c4177a] disabled:opacity-40 text-white text-sm font-semibold transition-colors">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal QR code ── */}
        {qrGuest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e3370] rounded-3xl p-8 w-full max-w-sm border border-white/10 shadow-2xl text-center">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">QR code — {qrGuest.name}</h3>
                <button onClick={() => setQrGuest(null)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-white rounded-2xl p-4 flex items-center justify-center min-h-[220px]">
                {qrDataUrl
                  ? <img src={qrDataUrl} alt={`QR code invitation ${qrGuest.token}`} className="w-full h-auto" />
                  : <p className="text-[#1A2B5F]/50 text-sm">Génération…</p>}
              </div>
              <p className="text-white/50 text-xs mt-4 font-mono tracking-widest">{qrGuest.token}</p>

              <div className="flex items-center gap-2 mt-4 bg-white/10 border border-white/10 rounded-xl px-3 py-2.5">
                <p className="flex-1 text-white/70 text-xs truncate text-left">{`${origin}/rsvp?g=${qrGuest.token}`}</p>
                <button onClick={() => copyLink(qrGuest)} title="Copier le lien RSVP"
                  className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors">
                  {copied === qrGuest.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setQrGuest(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                  Fermer
                </button>
                <button onClick={downloadQr} disabled={!qrDataUrl}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#e91e8c] hover:bg-[#c4177a] disabled:opacity-40 text-white text-sm font-semibold transition-colors">
                  <Download className="w-4 h-4" /> Télécharger
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
                Format : <span className="text-[#F4A7B9]">nom, code</span> (code optionnel, auto-généré si absent)<br />
                Marie Dupont, IBJK<br />
                Jean Martin
              </p>
              <textarea
                value={csvText} onChange={e => setCsvText(e.target.value)}
                rows={8}
                placeholder={"Marie Dupont,IBJK\nJean Martin"}
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
