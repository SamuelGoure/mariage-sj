"use client";

import { redirect } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Heart, ExternalLink, CreditCard, Banknote, Home, Utensils, Coffee, Luggage } from "lucide-react";
import { GiftIllustration, PlaneIllustration, FloralDivider, FloralCorner, RingsIcon } from "@/components/ui/decorations";

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
      initial={initial} animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const giftList = [
  { name: "Service de table", price: "130 €",  icon: Utensils, category: "Cuisine",    taken: false },
  { name: "Robot culinaire",  price: "180 €",  icon: Coffee,   category: "Cuisine",    taken: false },
  { name: "Parure de lit",    price: "95 €",   icon: Home,     category: "Chambre",    taken: true  },
  { name: "Cafetière",        price: "65 €",   icon: Coffee,   category: "Cuisine",    taken: false },
  { name: "Cadre photo",      price: "40 €",   icon: Heart,    category: "Décoration", taken: false },
  { name: "Set de valises",   price: "220 €",  icon: Luggage,  category: "Voyage",     taken: false },
];

export default function GiftsPage() {
  // Page pas encore prête à être montrée aux invités — retirer cette ligne pour la réactiver
  redirect("/");

  return (
    <div className="bg-[#FDF8F5]">

      {/* ── HERO ── */}
      <section className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1600&q=80"
          alt="Cadeaux de mariage"
          fill priority className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B5F]/90 via-[#1A2B5F]/40 to-transparent" />
        <FloralCorner className="absolute top-4 left-4 w-20 h-20 opacity-50" />
        <FloralCorner className="absolute top-4 right-4 w-20 h-20 opacity-50" flip />
        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <GiftIllustration className="w-20 h-20 mx-auto mb-3" />
          </motion.div>
          <motion.p className="text-sm uppercase tracking-[0.4em] text-[#F4A7B9] mb-2"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            Josiane & Stéphane
          </motion.p>
          <motion.h1 className="font-heading text-6xl md:text-7xl text-white font-light"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}>
            Cadeaux
          </motion.h1>
          <motion.div className="flex justify-center mt-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <FloralDivider className="w-48 h-5 opacity-80" />
          </motion.div>
        </div>
      </section>

      {/* ── MOT DES MARIÉS ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn className="flex flex-col items-center gap-5">
            <RingsIcon className="w-16 h-10" />
            <h2 className="font-heading text-4xl text-[#1A2B5F]">Un mot des mariés</h2>
            <FloralDivider className="w-48 h-5" />
            <p className="text-muted-foreground leading-relaxed text-base">
              Votre présence le jour de notre mariage est le plus beau cadeau que vous puissiez nous offrir.
              Si toutefois vous souhaitez marquer cet instant d&apos;une attention particulière,
              nous avons pensé à quelques idées qui nous feraient vraiment plaisir.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── CAGNOTTE ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="flex flex-col items-center gap-3 mb-12">
            <span className="text-xs uppercase tracking-widest text-[#e91e8c] bg-[#e91e8c]/10 px-4 py-1.5 rounded-full font-semibold">Option 1</span>
            <h2 className="font-heading text-5xl text-[#1A2B5F] text-center">La Cagnotte</h2>
            <FloralDivider className="w-48 h-5 mt-1" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cagnotte commune */}
            <FadeIn direction="left" delay={0.1}>
              <div className="relative rounded-3xl overflow-hidden group h-full min-h-[280px]">
                <Image
                  src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80"
                  alt="Cagnotte"
                  fill className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#e91e8c]/90 via-[#e91e8c]/60 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading text-3xl text-white">Cagnotte commune</h3>
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed">
                    Participez à notre cagnotte pour nous aider à démarrer notre nouvelle vie ensemble.
                    Chaque contribution nous touche infiniment.
                  </p>
                  <a href="#"
                    className="inline-flex items-center gap-2 bg-white text-[#e91e8c] font-semibold px-6 py-3 rounded-full hover:bg-rose-50 transition-colors w-fit text-sm">
                    <ExternalLink className="w-4 h-4" /> Participer
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Voyage de noces */}
            <FadeIn direction="right" delay={0.15}>
              <div className="relative rounded-3xl overflow-hidden group h-full min-h-[280px]">
                <Image
                  src="https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80"
                  alt="Voyage de noces"
                  fill className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B5F]/90 via-[#1A2B5F]/50 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end gap-4">
                  <div className="flex items-center gap-3">
                    <PlaneIllustration className="w-12 h-12" />
                    <h3 className="font-heading text-3xl text-white">Voyage de noces</h3>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Notre rêve : voyager ensemble vers des horizons nouveaux.
                    Contribuez à notre lune de miel — une carte postale vous attend !
                  </p>
                  <a href="#"
                    className="inline-flex items-center gap-2 bg-[#4A90D9] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#3a7bc8] transition-colors w-fit text-sm">
                    <ExternalLink className="w-4 h-4" /> Contribuer
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── LISTE ── */}
      <section className="py-20 px-6 bg-gradient-wedding relative overflow-hidden">
        <FloralCorner className="absolute bottom-0 left-0 w-36 h-36 opacity-20" />
        <FloralCorner className="absolute top-0 right-0 w-36 h-36 opacity-20" flip />
        <div className="max-w-5xl mx-auto">
          <FadeIn className="flex flex-col items-center gap-3 mb-12">
            <span className="text-xs uppercase tracking-widest text-[#1A2B5F] bg-[#1A2B5F]/10 px-4 py-1.5 rounded-full font-semibold">Option 2</span>
            <h2 className="font-heading text-5xl text-[#1A2B5F] text-center">Liste de Mariage</h2>
            <FloralDivider className="w-48 h-5 mt-1" />
            <p className="text-muted-foreground text-sm text-center max-w-md">
              Quelques idées de cadeaux qui nous feraient particulièrement plaisir.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {giftList.map(({ name, price, icon: Icon, category, taken }, i) => (
              <FadeIn key={name} delay={i * 0.08}>
                <div className={`bg-white rounded-3xl p-6 border flex flex-col gap-4 transition-all duration-300 ${taken ? "opacity-50 border-gray-200" : "border-rose-100 hover:shadow-lg hover:-translate-y-1"}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-xs px-3 py-1 rounded-full bg-rose-50 text-[#e91e8c] font-semibold">{category}</span>
                    {taken && <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-400 font-medium">Offert ✓</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-[#eef4ff] flex items-center justify-center shrink-0">
                      <Icon className="w-7 h-7 text-[#e91e8c]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A2B5F]">{name}</p>
                      <p className="font-heading text-2xl text-[#e91e8c] leading-tight">{price}</p>
                    </div>
                  </div>
                  {!taken && (
                    <a href="#"
                      className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1A2B5F] hover:bg-[#132048] px-4 py-2.5 rounded-full transition-colors">
                      <Banknote className="w-4 h-4" /> Offrir ce cadeau
                    </a>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTE BAS ── */}
      <section className="py-14 bg-white px-6 text-center">
        <FadeIn className="flex flex-col items-center gap-4">
          <Heart className="w-8 h-8 text-[#e91e8c] fill-current" />
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            Si vous souhaitez offrir un cadeau physique, nos témoins sont à votre disposition
            pour toute coordination. N&apos;hésitez pas à les contacter.
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
