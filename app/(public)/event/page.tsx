"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { MapPin, Clock, Car, Shirt, Heart, Music, UtensilsCrossed, Baby, Navigation, Phone, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RingsIcon, FloralDivider, FloralCorner, WaveDivider } from "@/components/ui/decorations";

function FadeIn({ children, className, delay = 0, direction = "up" }: {
  children: React.ReactNode; className?: string; delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const initial = {
    opacity: 0,
    y: direction === "up" ? 28 : 0,
    x: direction === "left" ? -28 : direction === "right" ? 28 : 0,
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

const timeline = [
  { time: "14h30", label: "Accueil des invités", desc: "Retrouvez-vous et prenez vos places avant la cérémonie.", icon: Sparkles, color: "#F4A7B9" },
  { time: "15h00", label: "Cérémonie", desc: "Échange des vœux et des alliances dans la salle principale.", icon: Heart, color: "#e91e8c" },
  { time: "17h30", label: "Cocktail", desc: "Champagne, musique live et petits fours en terrasse.", icon: Music, color: "#4A90D9" },
  { time: "20h00", label: "Dîner de réception", desc: "Un repas gastronomique pour célébrer ensemble.", icon: UtensilsCrossed, color: "#e91e8c" },
  { time: "23h00", label: "Soirée dansante", desc: "Que la fête commence ! La piste de danse vous attend.", icon: Music, color: "#4A90D9" },
];

const faq = [
  { q: "Peut-on venir avec des enfants ?", a: "Les enfants sont les bienvenus à la cérémonie civile. Par contre pour la cérémonie religieuse et la réception, il faut se référer à l'invitation reçue et au nombre de place qui vous sont attribuées sur le site internet." },
  { q: "Y a-t-il un dress code ?", a: "La tenue de soirée est recommandée. Les couleurs blanc et ivoire sont réservées aux mariés. Privilégiez des teintes élégantes — bleu nuit, rose, bordeaux ou doré seront parfaits." },
  { q: "Où se garer ?", a: "Pour la cérémonie civile, un parking gratuit est disponible sur place à la mairie d'Orsay. Pour la cérémonie religieuse, un parking privé et gratuitest disponible en face du Palais Groupe." },
  { q: "Jusqu'à quelle heure dure la soirée ?", a: "La soirée se termine officiellement à 02h00 du matin." },
  { q: "Peut-on prendre des photos pendant la cérémonie ?", a: "Nous vous demandons de ranger vos téléphones pendant la cérémonie. Notre photographe immortalisera chaque instant. Après la cérémonie, photos libres !" },
];

export default function EventPage() {
  return (
    <div className="bg-[#FDF8F5]">

      {/* ── HERO ── */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
          alt="Salle de mariage"
          fill priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B5F]/90 via-[#1A2B5F]/30 to-transparent" />
        {/* Coins floraux */}
        <FloralCorner className="absolute top-4 left-4 w-24 h-24 opacity-60" />
        <FloralCorner className="absolute top-4 right-4 w-24 h-24 opacity-60" flip />
        <div className="relative z-10 text-center px-6 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <RingsIcon className="w-14 h-9 mx-auto mb-4" />
          </motion.div>
          <motion.p className="text-sm uppercase tracking-[0.4em] text-[#F4A7B9] mb-2"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            7 novembre 2026
          </motion.p>
          <motion.h1 className="font-heading text-6xl md:text-8xl text-white font-light"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Le Mariage
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-4">
            <FloralDivider className="w-56 h-6 opacity-80" />
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <FloralCorner className="absolute bottom-4 left-4 w-32 h-32 opacity-20" />
        <FloralCorner className="absolute bottom-4 right-4 w-32 h-32 opacity-20" flip />
        <div className="max-w-2xl mx-auto">
          <FadeIn className="flex flex-col items-center gap-3 mb-16">
            <p className="text-sm uppercase tracking-[0.4em] text-[#e91e8c]">Programme</p>
            <h2 className="font-heading text-5xl text-[#1A2B5F] text-center">La journée</h2>
            <FloralDivider className="w-48 h-6 mt-1" />
          </FadeIn>

          <div className="relative">
            {/* Ligne verticale dégradée */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-[#F4A7B9] via-[#e91e8c] to-[#4A90D9]" />

            <div className="flex flex-col gap-6">
              {timeline.map(({ time, label, desc, icon: Icon, color }, i) => (
                <FadeIn key={time} delay={i * 0.12} direction="left">
                  <div className="flex items-start gap-5">
                    {/* Icône sur la ligne */}
                    <div className="relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white"
                      style={{ backgroundColor: color }}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    {/* Carte */}
                    <div className="flex-1 bg-white rounded-2xl p-5 border border-rose-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
                      <p className="font-heading text-3xl font-light leading-none mb-1" style={{ color }}>{time}</p>
                      <h3 className="font-heading text-xl text-[#1A2B5F] mb-1.5">{label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* ── LIEUX ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="flex flex-col items-center gap-3 mb-14">
            <p className="text-sm uppercase tracking-[0.4em] text-[#e91e8c]">Où nous retrouver</p>
            <h2 className="font-heading text-5xl text-[#1A2B5F] text-center">Les lieux</h2>
            <FloralDivider className="w-48 h-6 mt-1" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Cérémonie */}
            <FadeIn direction="left">
              <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80"
                    alt="Salle de cérémonie"
                    fill className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B5F]/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#e91e8c] flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white fill-current" />
                    </div>
                    <span className="text-white font-heading text-xl">Cérémonie civile</span>
                  </div>
                </div>
                <div className="bg-white p-6 flex flex-col gap-3">
                  <h3 className="font-heading text-2xl text-[#1A2B5F]">Mairie d'Orsay</h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 text-[#e91e8c] shrink-0" />
                    <span>2 Rue de la Division Leclerc, 91400 Orsay</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-[#e91e8c]" />
                    {/* <span>Accueil 14h30 · Cérémonie 15h00</span> */}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <a href="https://maps.app.goo.gl/kmw34DX4zkXmRB5h7" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#e91e8c] px-3 py-1.5 rounded-full hover:bg-[#c4177a] transition-colors">
                      <Navigation className="w-3 h-3" /> Itinéraire
                    </a>
                    <a href="tel:+2250000000000"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#1A2B5F] bg-rose-50 px-3 py-1.5 rounded-full hover:bg-rose-100 transition-colors">
                      <Phone className="w-3 h-3" /> Contact
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Réception */}
            <FadeIn direction="right">
              <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80"
                    alt="Salle de réception"
                    fill className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B5F]/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#4A90D9] flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-heading text-xl">Cérémonie réligieuse et réception</span>
                  </div>
                </div>
                <div className="bg-white p-6 flex flex-col gap-3">
                  <h3 className="font-heading text-2xl text-[#1A2B5F]">Etoile 91, Palais Groupe</h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 text-[#4A90D9] shrink-0" />
                    <span>2 Rue Jules Guesde, 91130 Ris-Orangis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-[#4A90D9]" />
                    {/* <span>Cocktail 17h30 · Dîner 20h00 · Soirée 04h00</span> */}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <a href="https://maps.app.goo.gl/uHbBxemjFjTj37A39" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#4A90D9] px-3 py-1.5 rounded-full hover:bg-[#3a7bc8] transition-colors">
                      <Navigation className="w-3 h-3" /> Itinéraire
                    </a>
                    <a href="tel:+2250000000000"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#1A2B5F] bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                      <Phone className="w-3 h-3" /> Contact
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── INFOS PRATIQUES ── */}
      <section className="py-20 px-6 bg-gradient-wedding relative overflow-hidden">
        <FloralCorner className="absolute top-4 right-4 w-28 h-28 opacity-30" flip />
        <div className="max-w-5xl mx-auto">
          <FadeIn className="flex flex-col items-center gap-3 mb-14">
            <p className="text-sm uppercase tracking-[0.4em] text-[#e91e8c]">Infos pratiques</p>
            <h2 className="font-heading text-5xl text-[#1A2B5F] text-center">À savoir</h2>
            <FloralDivider className="w-48 h-6 mt-1" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shirt,
                color: "#e91e8c",
                bg: "#e91e8c",
                title: "Dress Code",
                img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
                content: (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-[#1A2B5F]">Tenue de soirée</strong> recommandée.<br /><br />
                    Blanc et ivoire réservés aux mariés.<br /><br />
                    Suggestions&nbsp;: <span className="text-[#1A2B5F] font-medium">bleu nuit · rose · bordeaux · champagne · doré</span>
                  </p>
                ),
              },
              {
                icon: Car,
                color: "#4A90D9",
                bg: "#4A90D9",
                title: "Parking & Transport",
                img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80",
                content: (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Parking <strong className="text-[#1A2B5F]">gratuit et sécurisé</strong> sur place.<br /><br />
                    <strong>RER B</strong> — gare Orsay-Ville à 10 min à pied.<br /><br />
                    Navettes vers Paris à partir de minuit.
                  </p>
                ),
              },
              {
                icon: Baby,
                color: "#e91e8c",
                bg: "#F4A7B9",
                title: "Enfants",
                img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
                content: (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Les enfants sont <strong className="text-[#1A2B5F]">les bienvenus</strong> à la cérémonie et au cocktail.<br /><br />
                    Précisez leur présence dans votre RSVP.
                  </p>
                ),
              },
            ].map(({ icon: Icon, color, bg, title, img, content }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="relative h-32 overflow-hidden">
                    <Image src={img} alt={title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-heading text-xl text-white">{title}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex-1">{content}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&q=80"
            alt="FAQ fond"
            fill className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#1A2B5F]/92" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <FadeIn className="flex flex-col items-center gap-3 mb-14">
            <p className="text-sm uppercase tracking-[0.4em] text-[#F4A7B9]">Vous avez des questions ?</p>
            <h2 className="font-heading text-5xl text-white text-center">FAQ</h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-[#F4A7B9] to-[#4A90D9] rounded-full" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <Accordion className="flex flex-col gap-3">
              {faq.map(({ q, a }, i) => (
                <AccordionItem key={i} value={i}
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 data-open:bg-white/10 transition-colors">
                  <AccordionTrigger className="text-left text-white font-medium py-5 hover:no-underline hover:text-[#F4A7B9] transition-colors">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-blue-200 text-sm leading-relaxed pb-5">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-wedding flex flex-col items-center gap-6 px-6 text-center">
        <FadeIn className="flex flex-col items-center gap-4">
          <RingsIcon className="w-16 h-10" />
          <h2 className="font-heading text-4xl md:text-5xl text-[#1A2B5F]">Vous serez des nôtres ?</h2>
          <FloralDivider className="w-48 h-5" />
          <a href="/rsvp" className="mt-2 px-10 py-4 rounded-full font-semibold text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-all shadow-md hover:-translate-y-0.5">
            Confirmer ma présence
          </a>
        </FadeIn>
      </section>
    </div>
  );
}
