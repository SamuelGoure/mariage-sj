"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Image, CheckCircle, XCircle, Clock, Heart, FileText } from "lucide-react";

interface RsvpItem {
  id: number;
  name: string;
  attending: boolean;
  guestCount: number;
  createdAt: string;
}

function StatCard({
  label, value, icon: Icon, color, delay,
}: { label: string; value: number | string; icon: React.ElementType; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-3xl font-heading font-light text-white">{value}</p>
      <p className="text-sm text-blue-300">{label}</p>
    </motion.div>
  );
}

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<RsvpItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((r) => r.json())
      .then((data) => { setRsvps(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const attending   = rsvps.filter((r) => r.attending);
  const declined    = rsvps.filter((r) => !r.attending);
  const totalGuests = attending.reduce((s, r) => s + (r.guestCount || 1), 0);

  return (
    <div className="min-h-screen bg-[#1A2B5F]">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-[#F4A7B9] fill-current" />
          <span className="font-heading text-xl tracking-widest uppercase text-white">S & J — Admin</span>
        </div>
        <Link href="/" className="text-sm text-blue-300 hover:text-white transition-colors">
          ← Voir le site
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="RSVP reçus"         value={rsvps.length}    icon={Users}       color="#F4A7B9" delay={0}    />
          <StatCard label="Confirmés"           value={attending.length} icon={CheckCircle} color="#4ade80" delay={0.08} />
          <StatCard label="Déclinés"            value={declined.length}  icon={XCircle}     color="#f87171" delay={0.16} />
          <StatCard label="Invités total"       value={totalGuests}      icon={Users}       color="#4A90D9" delay={0.24} />
        </div>

        {/* Navigation rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link href="/admin/rsvp">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#e91e8c]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#e91e8c]" />
              </div>
              <div>
                <h3 className="font-heading text-2xl text-white">Gestion RSVP</h3>
                <p className="text-sm text-blue-300">Voir toutes les réponses, exporter CSV</p>
              </div>
              <span className="ml-auto text-blue-300 group-hover:text-white transition-colors">→</span>
            </motion.div>
          </Link>

          <Link href="/admin/gallery">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#4A90D9]/20 flex items-center justify-center">
                <Image className="w-6 h-6 text-[#4A90D9]" />
              </div>
              <div>
                <h3 className="font-heading text-2xl text-white">Modération Galerie</h3>
                <p className="text-sm text-blue-300">Approuver ou refuser les photos invités</p>
              </div>
              <span className="ml-auto text-blue-300 group-hover:text-white transition-colors">→</span>
            </motion.div>
          </Link>

          <Link href="/admin/content">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#F4A7B9]/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#F4A7B9]" />
              </div>
              <div>
                <h3 className="font-heading text-2xl text-white">Contenu du site</h3>
                <p className="text-sm text-blue-300">Dates, lieux, FAQ, photos — sans coder</p>
              </div>
              <span className="ml-auto text-blue-300 group-hover:text-white transition-colors">→</span>
            </motion.div>
          </Link>
        </div>

        {/* Derniers RSVP */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-heading text-2xl text-white">Dernières réponses</h3>
            <Link href="/admin/rsvp" className="text-sm text-[#F4A7B9] hover:text-white transition-colors">
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-blue-300 text-sm animate-pulse">
              Chargement...
            </div>
          ) : rsvps.length === 0 ? (
            <div className="px-6 py-12 text-center text-blue-300 text-sm">
              Aucune réponse reçue pour l&apos;instant.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {rsvps.slice(0, 8).map((r) => (
                <div key={r.id} className="px-6 py-4 flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.attending ? "bg-green-400" : "bg-red-400"}`} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{r.name}</p>
                    <p className="text-blue-400 text-xs">
                      {r.attending ? `${r.guestCount} personne${r.guestCount > 1 ? "s" : ""}` : "Ne viendra pas"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-400">
                    <Clock className="w-3 h-3" />
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                  {r.attending ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
