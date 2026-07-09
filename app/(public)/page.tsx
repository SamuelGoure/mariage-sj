import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Clock, Music, Sparkles } from "lucide-react";
import Countdown from "@/components/home/Countdown";
import FadeIn from "@/components/home/FadeIn";
import { RingsIcon, FloralDivider, FloralCorner, HeartBeat, WaveDivider } from "@/components/ui/decorations";
import { getGeneral } from "@/lib/content";
import { formatLongDateFr, formatDeadlineFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

const highlights = [
  {
    icon: Heart,
    label: "Cérémonie",
    time: null,
    desc: "L'échange des vœux",
    img: "/mairie_orsay.webp",
  },
  {
    icon: Music,
    label: "Cocktail",
    time: null,
    desc: "Musique & célébration",
    img: "/palais-groupe.jpg",
  },
  {
    icon: Clock,
    label: "Réception",
    time: null,
    desc: "Dîner & soirée dansante",
    img: "/lieu_reception.png",
  },
];

export default async function HomePage() {
  const general = await getGeneral();
  const names = general.nameOrder.map((role) => (role === "bride" ? general.brideName : general.groomName));
  const weddingDateText = formatLongDateFr(general.weddingDate);
  const rsvpDeadlineText = formatDeadlineFr(general.rsvpDeadline);

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background photo — pas encore reliée au CMS (general ne couvre pas encore les images de la home) */}
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/jands.jpg"
            alt="Josiane & Stéphane"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(26,43,95,0.55),transparent_65%)]" />
          {/* Dégradé haut pour lisibilité de la navbar */}
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/60 to-transparent" />
          {/* Coins floraux */}
          <FloralCorner className="absolute top-24 left-4 w-24 h-24 opacity-40" />
          <FloralCorner className="absolute top-24 right-4 w-24 h-24 opacity-40" flip />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
          <FadeIn direction="none" delay={0.1}>
            <RingsIcon className="w-14 h-9 opacity-90" />
          </FadeIn>
          <div className="flex flex-col items-center gap-2">
            <FadeIn direction="none" delay={0.2}>
              <p className="text-sm uppercase tracking-[0.4em] text-[#F4A7B9] font-medium">
                Vous êtes invités au mariage de
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none">
                {names[0]}
              </h1>
            </FadeIn>
            <FadeIn direction="none" delay={0.45}>
              <FloralDivider className="w-48 h-5 my-1 opacity-80" />
            </FadeIn>
            <FadeIn direction="up" delay={0.4}>
              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none">
                {names[1]}
              </h1>
            </FadeIn>
          </div>

          {/* Date & Lieu */}
          <FadeIn direction="up" delay={0.6} className="flex flex-col items-center gap-2 mt-1">
            <p className="font-heading text-2xl md:text-3xl italic text-[#F4A7B9]">
              Le {weddingDateText}
            </p>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{general.venueShortName}</span>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Défiler</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── COUNTDOWN ─────────────────────────────────────────── */}
      <section className="relative bg-[#1A2B5F] py-20 md:py-28 overflow-hidden">
        {/* Halos lumineux décoratifs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#e91e8c]/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#4A90D9]/15 blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#F4A7B9]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.5em] text-[#F4A7B9] font-medium">
              Le compte à rebours
            </p>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-white/80 italic">
              Plus que
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Countdown weddingDate={general.weddingDate} />
          </FadeIn>
          <FadeIn delay={0.2} className="flex flex-col items-center gap-3">
            <HeartBeat className="w-44 h-12 opacity-70" />
            <p className="font-heading text-2xl italic text-white/60">avant de dire Oui</p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <p className="text-white/35 text-xs uppercase tracking-[0.3em]">
              {weddingDateText} · {general.venueShortName}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── APERÇU JOURNÉE ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <FadeIn className="flex flex-col items-center gap-4 mb-16">
            <p className="text-sm uppercase tracking-[0.4em] text-[#e91e8c]">Programme</p>
            <h2 className="font-heading text-5xl md:text-6xl text-[#1A2B5F] text-center">
              La journée en un coup d&apos;œil
            </h2>
            <FloralDivider className="w-52 h-5 mt-1" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map(({ icon: Icon, label, time, desc, img }, i) => (
              <FadeIn key={label} delay={i * 0.12} className="group">
                <div className="rounded-3xl overflow-hidden border border-rose-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={img} alt={label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B5F]/70 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#e91e8c] flex items-center justify-center shadow">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-heading text-xl text-white">{label}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col items-center gap-2 bg-gradient-to-b from-white to-rose-50/20">
                    {time && (
                      <p className="font-heading text-3xl font-light italic text-[#e91e8c]">{time}</p>
                    )}
                    <p className="text-sm text-muted-foreground text-center">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="flex justify-center mt-12">
            <Link href="/event"
              className="flex items-center gap-2 text-sm font-semibold text-[#1A2B5F] border border-[#1A2B5F]/20 px-6 py-3 rounded-full hover:bg-[#1A2B5F] hover:text-white transition-all">
              <Sparkles className="w-4 h-4" /> Voir le programme complet
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA RSVP ──────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Image
          src="/jands.jpg"
          alt="Josiane & Stéphane"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#1A2B5F]/85" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 flex flex-col items-center gap-8 text-center">
          <FadeIn>
            <RingsIcon className="w-16 h-10 mx-auto" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-heading text-5xl md:text-6xl text-white">
              Serez-vous des nôtres ?
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-white/70 text-base leading-relaxed">
              Votre présence sera le plus beau cadeau que vous puissiez nous offrir.
              Merci de confirmer votre venue avant le{" "}
              <strong className="text-[#F4A7B9]">{rsvpDeadlineText}</strong>.
            </p>
          </FadeIn>
          <FadeIn delay={0.3} className="flex flex-col items-center gap-3">
            <Link
              href="/rsvp"
              className="px-10 py-4 rounded-full text-base font-semibold text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Confirmer ma présence
            </Link>
            <FloralDivider className="w-40 h-4 opacity-50" />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
