"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ParallaxImage from "@/components/ui/ParallaxImage";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Heart, Send, Users, Sparkles, Plus, X,
  MapPin, Clock, CalendarDays, Train, ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FloralDivider, RingsIcon, FloralCorner } from "@/components/ui/decorations";
import { formatLongDateFr, formatDeadlineFr } from "@/lib/utils";
import type { GeneralContent, VenuesContent } from "@/lib/content/sections";

type Step = "code" | "form" | "success" | "decline";

function FadeIn({ children, className, delay = 0, direction = "up" }: {
  children: React.ReactNode; className?: string; delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const initial = {
    opacity: 0,
    y: direction === "up" ? 24 : 0,
    x: direction === "left" ? -24 : direction === "right" ? 24 : 0,
  };
  return (
    <motion.div ref={ref} className={className}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function RsvpContent({
  general, venues,
}: { general: GeneralContent; venues: VenuesContent }) {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("g") ?? "";

  const names = general.nameOrder.map((role) => (role === "bride" ? general.brideName : general.groomName));
  const fullNames = names.join(" & ");
  const weddingDateText = formatLongDateFr(general.weddingDate);
  const rsvpDeadlineText = formatDeadlineFr(general.rsvpDeadline);

  const [step, setStep] = useState<Step>(urlToken ? "form" : "code");
  const [guestToken, setGuestToken] = useState(urlToken);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [guestName, setGuestName] = useState("");

  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeChecking, setCodeChecking] = useState(false);
  const [seatsAllowed, setSeatsAllowed] = useState(4);
  const [codeHoneypot, setCodeHoneypot] = useState(""); // anti-spam : ce champ doit rester vide (invisible pour un humain)

  const [form, setForm] = useState({
    name: "", companions: [] as string[], message: "",
  });

  function applyGuest(data: { name: string; seatsAllowed?: number }) {
    setGuestName(data.name);
    setForm(f => ({ ...f, name: data.name }));
    if (data.seatsAllowed) setSeatsAllowed(data.seatsAllowed);
  }

  // Pré-remplir depuis le token présent dans le lien
  useEffect(() => {
    if (!urlToken) return;
    fetch(`/api/guests/by-token/${urlToken}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) {
          setStep("code");
          setCodeError("Ce lien n'est plus valide. Merci de saisir votre code d'invitation.");
          return;
        }
        applyGuest(data);
      })
      .catch(() => {
        setStep("code");
        setCodeError("Impossible de vérifier votre lien. Merci de saisir votre code d'invitation.");
      });
  }, [urlToken]);

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (codeHoneypot) return; // champ honeypot rempli → soumission de bot, on ignore silencieusement
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setCodeChecking(true);
    setCodeError("");
    fetch(`/api/guests/by-token/${encodeURIComponent(code)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setCodeError("Code invalide. Vérifiez et réessayez."); return; }
        applyGuest(data);
        setGuestToken(code);
        setStep("form");
      })
      .catch(() => setCodeError("Impossible de vérifier le code, réessayez."))
      .finally(() => setCodeChecking(false));
  }

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const maxCompanions = Math.max(0, seatsAllowed - 1);

  function addCompanion() {
    setForm(f => f.companions.length >= maxCompanions ? f : { ...f, companions: [...f.companions, ""] });
  }
  function updateCompanion(index: number, value: string) {
    setForm(f => ({ ...f, companions: f.companions.map((c, i) => i === index ? value : c) }));
  }
  function removeCompanion(index: number) {
    setForm(f => ({ ...f, companions: f.companions.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Merci de renseigner votre nom complet.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, attending,
          companions: form.companions, message: form.message,
          guestToken: guestToken || undefined,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Erreur."); return; }
      setStep(attending ? "success" : "decline");
    } catch { setError("Impossible de joindre le serveur."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F5]">

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[440px] flex items-end justify-center overflow-hidden">
        <ParallaxImage src="/jands.jpg" alt="Josiane & Stéphane" priority />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B5F] via-[#1A2B5F]/50 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
        <FloralCorner className="absolute top-24 left-4 w-20 h-20 opacity-40" />
        <FloralCorner className="absolute top-24 right-4 w-20 h-20 opacity-40" flip />

        <div className="relative z-10 text-center px-6 pb-14 w-full max-w-2xl mx-auto">
          <motion.p
            className="text-xs uppercase tracking-[0.5em] text-[#F4A7B9] mb-3 font-medium"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            {guestName ? `Invitation pour ${guestName}` : `${fullNames} · ${weddingDateText}`}
          </motion.p>
          <motion.h1
            className="font-heading text-7xl md:text-8xl text-white font-light leading-none mb-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            RSVP
          </motion.h1>
          <motion.div
            className="flex justify-center mb-5"
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.6, delay: 0.35 }}>
            <FloralDivider className="w-48 h-5 opacity-80" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-5 py-2 rounded-full">
              <Clock className="w-3.5 h-3.5 text-[#F4A7B9]" />
              Réponse souhaitée avant le <strong className="text-[#F4A7B9] ml-1">{rsvpDeadlineText}</strong>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── 2. MESSAGE DES MARIÉS ────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <FadeIn className="max-w-xl mx-auto text-center flex flex-col items-center gap-5">
          <RingsIcon className="w-16 h-10" />
          <h2 className="font-heading text-4xl text-[#1A2B5F]">Un mot des mariés</h2>
          <FloralDivider className="w-44 h-5" />
          <p className="text-muted-foreground leading-relaxed text-base">
            Votre présence à nos côtés le soir du <strong className="text-[#1A2B5F]">{weddingDateText}</strong> serait le
            plus beau des cadeaux. Pour que nous puissions organiser cette soirée comme vous le méritez,
            merci de nous confirmer avant le{" "}
            <span className="font-semibold text-[#e91e8c]">{rsvpDeadlineText}</span>.
          </p>
          <p className="font-heading text-xl italic text-[#e91e8c]">
            — {fullNames}
          </p>
        </FadeIn>
      </section>

      {/* ── 4. FORMULAIRE ────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ─ État : saisie du code d'invitation ─ */}
            {step === "code" && (
              <motion.div key="code"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.5 }}>
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-sm text-center max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#e91e8c]/10 flex items-center justify-center mb-5">
                    <Heart className="w-7 h-7 text-[#e91e8c]" />
                  </div>
                  <h2 className="font-heading text-3xl text-[#1A2B5F] mb-2">Votre invitation</h2>
                  <p className="text-muted-foreground text-sm mb-7">
                    Entrez le code à 4 caractères indiqué sur votre carton d&apos;invitation.
                  </p>
                  <form onSubmit={submitCode} className="flex flex-col gap-4">
                    {/* Honeypot anti-spam : invisible pour un humain, les bots le remplissent */}
                    <input
                      type="text"
                      name="website"
                      value={codeHoneypot}
                      onChange={(e) => setCodeHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden opacity-0 pointer-events-none"
                    />
                    <Input
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                      maxLength={4}
                      placeholder="XXXX"
                      autoFocus
                      className="text-center text-2xl tracking-[0.5em] font-semibold uppercase border-rose-200 focus-visible:ring-[#e91e8c] rounded-xl h-14"
                    />
                    {codeError && (
                      <p className="text-sm text-red-500 bg-red-50 py-2.5 px-4 rounded-xl border border-red-100">
                        {codeError}
                      </p>
                    )}
                    <Button type="submit" disabled={codeChecking || !codeInput.trim()}
                      className="w-full py-6 rounded-full text-base font-semibold bg-[#e91e8c] hover:bg-[#c4177a] text-white shadow-lg hover:shadow-xl transition-all">
                      {codeChecking ? "Vérification…" : "Voir mon invitation"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ─ État : formulaire ─ */}
            {step === "form" && (
              <motion.div key="form"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.5 }}>

                {/* Choix présence */}
                {attending === null && (
                  <div className="text-center">
                    <h2 className="font-heading text-4xl text-[#1A2B5F] mb-2">Serez-vous présent(e) ?</h2>
                    <p className="text-muted-foreground mb-10">
                      Cliquez pour nous donner votre réponse
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setAttending(true)}
                        className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 px-8 py-8 rounded-3xl font-semibold text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                          <Heart className="w-7 h-7 fill-current" />
                        </div>
                        <span className="text-lg">Oui, avec joie !</span>
                        <span className="text-sm opacity-75 font-normal">Je serai présent(e)</span>
                      </button>

                      <button
                        onClick={() => setAttending(false)}
                        className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 px-8 py-8 rounded-3xl font-semibold text-[#1A2B5F] bg-white border-2 border-[#1A2B5F]/10 hover:border-[#1A2B5F]/30 transition-all hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                          <Sparkles className="w-7 h-7 text-[#4A90D9]" />
                        </div>
                        <span className="text-lg">Je ne pourrai pas</span>
                        <span className="text-sm text-muted-foreground font-normal">Je serai absent(e)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Formulaire rempli */}
                {attending !== null && (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Badge choix */}
                    <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium w-fit mx-auto border ${attending ? "bg-[#e91e8c]/8 text-[#e91e8c] border-[#e91e8c]/20" : "bg-blue-50 text-[#1A2B5F] border-blue-100"}`}>
                      {attending ? <Heart className="w-4 h-4 fill-current" /> : <Sparkles className="w-4 h-4" />}
                      {attending ? "Je serai présent(e) 🎉" : "Je serai absent(e)"}
                      <button type="button" onClick={() => setAttending(null)}
                        className="ml-1 text-xs opacity-50 hover:opacity-100 underline underline-offset-2">
                        Modifier
                      </button>
                    </div>

                    {/* Coordonnées */}
                    <div className="bg-white rounded-3xl p-7 border border-rose-100 shadow-sm">
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#e91e8c]/10 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-[#e91e8c]" />
                        </div>
                        <h3 className="font-heading text-2xl text-[#1A2B5F]">Vos coordonnées</h3>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-sm text-[#1A2B5F] font-medium">Nom complet *</Label>
                        <Input id="name" placeholder="Votre prénom et nom" value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          className="border-rose-200 focus-visible:ring-[#e91e8c] rounded-xl h-11" required />
                      </div>
                    </div>

                    {/* Accompagnants */}
                    {attending && (
                      <div className="bg-white rounded-3xl p-7 border border-rose-100 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className="w-8 h-8 rounded-full bg-[#e91e8c]/10 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4 text-[#e91e8c]" />
                          </div>
                          <h3 className="font-heading text-2xl text-[#1A2B5F]">Vos accompagnants</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-5 ml-10">
                          Vous pouvez venir avec {maxCompanions} personne{maxCompanions > 1 ? "s" : ""} en plus de vous
                          {maxCompanions === 0 ? " (invitation individuelle)" : ""}.
                        </p>

                        {form.companions.length > 0 && (
                          <div className="flex flex-col gap-3 mb-4">
                            {form.companions.map((c, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Input
                                  value={c}
                                  onChange={(e) => updateCompanion(i, e.target.value)}
                                  placeholder="Prénom et nom de l'invité(e)"
                                  className="border-rose-200 focus-visible:ring-[#e91e8c] rounded-xl h-11"
                                />
                                <button type="button" onClick={() => removeCompanion(i)}
                                  className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center bg-rose-50 text-[#1A2B5F]/60 hover:bg-red-50 hover:text-red-500 transition-colors">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {form.companions.length < maxCompanions && (
                          <button type="button" onClick={addCompanion}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#e91e8c] bg-[#e91e8c]/8 hover:bg-[#e91e8c]/15 transition-colors">
                            <Plus className="w-4 h-4" /> Ajouter un invité
                          </button>
                        )}
                      </div>
                    )}

                    {/* Message */}
                    <div className="bg-white rounded-3xl p-7 border border-rose-100 shadow-sm flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="message" className="text-sm text-[#1A2B5F] font-medium">
                          Un mot pour les mariés
                          <span className="text-muted-foreground font-normal ml-1">(optionnel)</span>
                        </Label>
                        <Textarea id="message" placeholder="Votre message, un souhait, une anecdote…" value={form.message}
                          onChange={(e) => set("message", e.target.value)}
                          rows={4} className="border-rose-200 focus-visible:ring-[#e91e8c] resize-none rounded-xl" />
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 text-center bg-red-50 py-3 px-4 rounded-2xl border border-red-100">
                        {error}
                      </p>
                    )}

                    <Button type="submit" disabled={loading}
                      className="w-full py-6 rounded-full text-base font-semibold bg-[#e91e8c] hover:bg-[#c4177a] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      {loading
                        ? <span className="animate-pulse">Envoi en cours…</span>
                        : <><Send className="w-5 h-5" />{attending ? "Confirmer ma présence" : "Envoyer ma réponse"}</>
                      }
                    </Button>
                  </form>
                )}
              </motion.div>
            )}

            {/* ─ État : succès ─ */}
            {step === "success" && (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }}>

                {/* Confirmation card */}
                <div className="relative bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm mb-6">
                  {/* Bandeau top */}
                  <div className="h-2 bg-gradient-to-r from-[#F4A7B9] via-[#e91e8c] to-[#4A90D9]" />
                  <div className="p-10 text-center flex flex-col items-center gap-5">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-[#e91e8c]/10 flex items-center justify-center">
                        <Heart className="w-12 h-12 text-[#e91e8c] fill-current" />
                      </div>
                      <motion.div
                        className="absolute -top-1 -right-1"
                        initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
                        <Sparkles className="w-6 h-6 text-[#F4A7B9]" />
                      </motion.div>
                    </div>
                    <RingsIcon className="w-16 h-10" />
                    <h2 className="font-heading text-5xl text-[#1A2B5F]">Merci !</h2>
                    <FloralDivider className="w-44 h-5" />
                    <p className="text-muted-foreground leading-relaxed max-w-sm">
                      Votre présence nous touche profondément.
                      Nous avons hâte de célébrer avec vous le <strong className="text-[#1A2B5F]">{weddingDateText}</strong> !
                    </p>
                  </div>
                </div>

                {/* Infos pratiques post-confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: CalendarDays, label: "Rendez-vous le", value: weddingDateText, sub: venues.ceremony.timeText, color: "#e91e8c" },
                    { icon: MapPin,       label: "Adresse",        value: venues.ceremony.name, sub: venues.ceremony.address, color: "#4A90D9" },
                    { icon: Train,        label: "RER B",          value: "Orsay-Ville",   sub: "10 min à pied",         color: "#1A2B5F" },
                  ].map(({ icon: Icon, label, value, sub, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-4 border border-rose-50 text-center">
                      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="font-heading text-lg text-[#1A2B5F] leading-tight">{value}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Bouton "Liste de cadeaux" retiré tant que /gifts est désactivée */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/event"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white bg-[#1A2B5F] hover:bg-[#132048] transition-colors">
                    Voir le programme <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* ─ État : déclin ─ */}
            {step === "decline" && (
              <motion.div key="decline"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }}>

                <div className="relative bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm mb-6">
                  <div className="h-2 bg-gradient-to-r from-[#4A90D9] to-[#1A2B5F]" />
                  <div className="p-10 text-center flex flex-col items-center gap-5">
                    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-[#4A90D9]" />
                    </div>
                    <h2 className="font-heading text-5xl text-[#1A2B5F]">Nous le regrettons</h2>
                    <FloralDivider className="w-44 h-5" />
                    <p className="text-muted-foreground leading-relaxed max-w-sm">
                      Merci de nous avoir répondu. Vous serez dans nos pensées
                      et dans nos cœurs ce soir-là. Nous espérons vous retrouver bientôt.
                    </p>
                    <p className="font-heading text-xl italic text-[#4A90D9]">
                      — {fullNames}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link href="/"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-colors">
                    Retour à l&apos;accueil <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* ── 5. QUESTIONS FRÉQUENTES ──────────────────────────────── */}
      {step === "form" && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <FadeIn className="flex flex-col items-center gap-3 mb-10">
              <p className="text-xs uppercase tracking-[0.4em] text-[#e91e8c]">Avant de répondre</p>
              <h2 className="font-heading text-4xl text-[#1A2B5F] text-center">Questions fréquentes</h2>
              <div className="divider-rose" />
            </FadeIn>

            <div className="flex flex-col gap-4">
              {[
                {
                  q: "Peut-on modifier sa réponse après l'envoi ?",
                  a: "Oui — contactez-nous directement par message ou par téléphone. Nous mettrons à jour votre réponse.",
                  icon: "✏️",
                },
                {
                  q: "Peut-on venir avec des enfants ?",
                  a: "Les enfants sont les bienvenus à la cérémonie et au cocktail. Pensez à le préciser dans votre formulaire.",
                  icon: "👶",
                },
                {
                  q: "Y a-t-il un hébergement à proximité ?",
                  a: "Plusieurs hôtels sont disponibles à Orsay, Bures-sur-Yvette et Gif-sur-Yvette. Nous vous transmettrons une liste sur demande.",
                  icon: "🏨",
                },
                {
                  q: "Comment se rendre sur place sans voiture ?",
                  a: "RER B, gare Orsay-Ville (10 min à pied). Des navettes retour seront organisées à partir de minuit vers Paris et les gares proches.",
                  icon: "🚆",
                },
              ].map(({ q, a, icon }, i) => (
                <FadeIn key={q} delay={i * 0.08}>
                  <div className="bg-[#FDF8F5] rounded-2xl p-5 border border-rose-50 flex gap-4">
                    <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="font-semibold text-[#1A2B5F] mb-1.5 text-sm">{q}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
