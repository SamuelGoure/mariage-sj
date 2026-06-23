"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Heart, CheckCircle, Send, Users, Sparkles,
  MapPin, Clock, CalendarDays, Train, ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FloralDivider, RingsIcon, FloralCorner } from "@/components/ui/decorations";

type Step = "form" | "success" | "decline";

const meals = [
  { id: "standard",   label: "Menu Standard",  desc: "Volaille ou bœuf",          icon: "🍗" },
  { id: "fish",       label: "Menu Poisson",    desc: "Poisson grillé",            icon: "🐟" },
  { id: "vegetarian", label: "Végétarien",      desc: "Sans viande ni poisson",    icon: "🥗" },
  { id: "child",      label: "Menu Enfant",     desc: "Pour les moins de 12 ans",  icon: "🍭" },
];

const infos = [
  {
    icon: CalendarDays,
    color: "#e91e8c",
    bg: "bg-[#e91e8c]/8",
    label: "Date & Heure",
    value: "7 novembre 2026",
    sub: "Accueil dès 10h00",
  },
  {
    icon: MapPin,
    color: "#4A90D9",
    bg: "bg-[#4A90D9]/8",
    label: "Lieu",
    value: "Mairie d'Orsay",
    sub: "2 Rue de la Division Leclerc, 91400",
  },
  {
    icon: Train,
    color: "#1A2B5F",
    bg: "bg-[#1A2B5F]/6",
    label: "Accès",
    value: "RER B — Orsay-Ville",
    sub: "7 mins à pied · parking gratuit",
  },
];

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

function RsvpContent() {
  const searchParams = useSearchParams();
  const guestToken = searchParams.get("g") ?? "";

  const [step, setStep] = useState<Step>("form");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [guestName, setGuestName] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", guestCount: "1",
    mealChoices: [] as string[], allergies: "", message: "",
  });

  // Pré-remplir depuis le token guest
  useEffect(() => {
    if (!guestToken) return;
    fetch(`/api/guests/by-token/${guestToken}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setGuestName(data.name);
        const parts = data.name.trim().split(" ");
        const firstName = parts[0] ?? "";
        const lastName = parts.slice(1).join(" ") ?? "";
        setForm(f => ({ ...f, firstName, lastName }));
      });
  }, [guestToken]);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function toggleMeal(id: string) {
    setForm((f) => ({
      ...f,
      mealChoices: f.mealChoices.includes(id)
        ? f.mealChoices.filter((m) => m !== id)
        : [...f.mealChoices, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Merci de renseigner votre prénom et nom.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          attending, guestCount: parseInt(form.guestCount),
          mealChoice: form.mealChoices, allergies: form.allergies, message: form.message,
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
        <Image
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80"
          alt="RSVP fond"
          fill priority
          className="object-cover object-center"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B5F] via-[#1A2B5F]/50 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
        <FloralCorner className="absolute top-24 left-4 w-20 h-20 opacity-40" />
        <FloralCorner className="absolute top-24 right-4 w-20 h-20 opacity-40" flip />

        <div className="relative z-10 text-center px-6 pb-14 w-full max-w-2xl mx-auto">
          <motion.p
            className="text-xs uppercase tracking-[0.5em] text-[#F4A7B9] mb-3 font-medium"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            {guestName ? `Invitation pour ${guestName}` : "Josiane & Stéphane · 7 novembre 2026"}
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
              Réponse souhaitée avant le <strong className="text-[#F4A7B9] ml-1">10 octobre 2026</strong>
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
            Votre présence à nos côtés le soir du <strong className="text-[#1A2B5F]">07 novembre 2026</strong> serait le
            plus beau des cadeaux. Pour que nous puissions organiser cette soirée comme vous le méritez,
            merci de nous confirmer avant le{" "}
            <span className="font-semibold text-[#e91e8c]">10 octobre 2026</span>.
          </p>
          <p className="font-heading text-xl italic text-[#e91e8c]">
            — Stéphane &amp; Josiane
          </p>
        </FadeIn>
      </section>

      {/* ── 3. INFOS CLÉS ────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-gradient-wedding">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {infos.map(({ icon: Icon, color, bg, label, value, sub }, i) => (
            <FadeIn key={label} delay={i * 0.1} direction="up">
              <div className="bg-white rounded-2xl p-5 border border-rose-50 shadow-sm flex items-start gap-4">
                <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">{label}</p>
                  <p className="font-heading text-lg text-[#1A2B5F] leading-tight">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── 4. FORMULAIRE ────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">

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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="firstName" className="text-sm text-[#1A2B5F] font-medium">Prénom *</Label>
                          <Input id="firstName" placeholder="Votre prénom" value={form.firstName}
                            onChange={(e) => set("firstName", e.target.value)}
                            className="border-rose-200 focus-visible:ring-[#e91e8c] rounded-xl h-11" required />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="lastName" className="text-sm text-[#1A2B5F] font-medium">Nom *</Label>
                          <Input id="lastName" placeholder="Votre nom" value={form.lastName}
                            onChange={(e) => set("lastName", e.target.value)}
                            className="border-rose-200 focus-visible:ring-[#e91e8c] rounded-xl h-11" required />
                        </div>
                      </div>

                      {attending && (
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm text-[#1A2B5F] font-medium">Nombre de personnes</Label>
                          <div className="flex items-center gap-2 flex-wrap">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button key={n} type="button" onClick={() => set("guestCount", String(n))}
                                className={`w-11 h-11 rounded-full text-sm font-semibold transition-all ${form.guestCount === String(n) ? "bg-[#e91e8c] text-white shadow-md scale-110" : "bg-rose-50 text-[#1A2B5F] hover:bg-rose-100"}`}>
                                {n}
                              </button>
                            ))}
                            <button type="button" onClick={() => set("guestCount", "6+")}
                              className={`px-4 h-11 rounded-full text-sm font-semibold transition-all ${form.guestCount === "6+" ? "bg-[#e91e8c] text-white shadow-md" : "bg-rose-50 text-[#1A2B5F] hover:bg-rose-100"}`}>
                              6+
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Menu */}
                    {attending && (
                      <div className="bg-white rounded-3xl p-7 border border-rose-100 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className="w-8 h-8 rounded-full bg-[#e91e8c]/10 flex items-center justify-center shrink-0 text-base">
                            🍽️
                          </div>
                          <h3 className="font-heading text-2xl text-[#1A2B5F]">Choix du repas</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-5 ml-10">Sélectionnez un menu par convive</p>
                        <div className="grid grid-cols-2 gap-3">
                          {meals.map(({ id, label, desc, icon }) => {
                            const selected = form.mealChoices.includes(id);
                            return (
                              <button key={id} type="button" onClick={() => toggleMeal(id)}
                                className={`relative flex flex-col items-start gap-1 p-4 rounded-2xl border text-left transition-all ${selected ? "border-[#e91e8c] bg-[#e91e8c]/5 ring-1 ring-[#e91e8c]" : "border-rose-100 bg-rose-50/40 hover:border-[#e91e8c]/40"}`}>
                                <span className="text-2xl mb-1">{icon}</span>
                                <span className="text-sm font-semibold text-[#1A2B5F]">{label}</span>
                                <span className="text-xs text-muted-foreground">{desc}</span>
                                {selected && (
                                  <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-[#e91e8c]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Allergies + Message */}
                    <div className="bg-white rounded-3xl p-7 border border-rose-100 shadow-sm flex flex-col gap-5">
                      {attending && (
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="allergies" className="text-sm text-[#1A2B5F] font-medium">
                            Allergies / régimes alimentaires
                          </Label>
                          <Input id="allergies" placeholder="Ex : sans gluten, végane, sans lactose…" value={form.allergies}
                            onChange={(e) => set("allergies", e.target.value)}
                            className="border-rose-200 focus-visible:ring-[#e91e8c] rounded-xl h-11" />
                        </div>
                      )}
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
                      Nous avons hâte de célébrer avec vous le <strong className="text-[#1A2B5F]">07 novembre 2026</strong> !
                    </p>
                  </div>
                </div>

                {/* Infos pratiques post-confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: CalendarDays, label: "Rendez-vous le", value: "07 Nov. 2026", sub: "à partir de 10h00", color: "#e91e8c" },
                    { icon: MapPin,       label: "Adresse",        value: "Mairie d'Orsay", sub: "2 Rue Division Leclerc, 91400 Orsay", color: "#4A90D9" },
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

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/event"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white bg-[#1A2B5F] hover:bg-[#132048] transition-colors">
                    Voir le programme <ChevronRight className="w-4 h-4" />
                  </a>
                  <a href="/gifts"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-[#e91e8c] bg-white border border-[#e91e8c]/30 hover:bg-rose-50 transition-colors">
                    Liste de cadeaux <ChevronRight className="w-4 h-4" />
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
                      — Stéphane &amp; Josiane
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <a href="/"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-colors">
                    Retour à l&apos;accueil <ChevronRight className="w-4 h-4" />
                  </a>
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

export default function RsvpPage() {
  return (
    <Suspense fallback={null}>
      <RsvpContent />
    </Suspense>
  );
}
