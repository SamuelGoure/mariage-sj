"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";

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
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const timeline = [
  {
    year: "2018",
    title: "La première rencontre",
    text: "C'était un soir ordinaire qui allait tout changer. Leurs regards se sont croisés et quelque chose d'indéfinissable s'est produit — une étincelle que ni l'un ni l'autre ne pouvait ignorer.",
    side: "left",
    color: "#F4A7B9",
  },
  {
    year: "2019",
    title: "Le premier voyage",
    text: "Ensemble pour la première fois loin de chez eux. Ce voyage leur a appris ce que signifie vraiment partager sa vie avec quelqu'un — les rires, les imprévus, et la certitude grandissante.",
    side: "right",
    color: "#4A90D9",
  },
  {
    year: "2021",
    title: "Emménager ensemble",
    text: "Un appartement, deux toothbrushes, et une vie construite à quatre mains. C'est dans ces petits rituels du quotidien qu'ils ont compris que c'était pour toujours.",
    side: "left",
    color: "#e91e8c",
  },
  {
    year: "2024",
    title: "La demande en mariage",
    text: "Il avait tout préparé dans le secret pendant des semaines. Au coucher du soleil, avec les mots du cœur et une bague, il a posé la question. Elle a dit oui — et le monde entier a souri.",
    side: "right",
    color: "#e91e8c",
    highlight: true,
  },
  {
    year: "2026",
    title: "Le grand jour",
    text: "Le 7 novembre 2026, devant ceux qu'ils aiment, ils diront Oui pour l'éternité.",
    side: "left",
    color: "#F4A7B9",
  },
];

const anecdotes = [
  {
    img: "/steph4.jpg",
    title: "Le café renversé",
    text: "Leur deuxième rendez-vous s'est transformé en catastrophe café — tache sur la chemise blanche, fou rire incontrôlable. C'est là qu'ils ont su que ça serait sérieux.",
  },
  {
    img: "/steph8.jpg",
    title: "La chanson",
    text: "Il y a une chanson qu'ils ont entendue ensemble un soir et qui est depuis «leur» chanson. Elle sera jouée lors du premier danse. Vous saurez laquelle.",
  },
  {
    img: "/steph2.jpg",
    title: "La pluie à Paris",
    text: "Coincés sous la pluie lors d'une balade sur les quais de Seine, ils ont passé deux heures sous un auvent à parler de tout et de rien. Ces deux heures ont tout changé.",
  },
];

export default function StoryPage() {
  return (
    <div className="bg-[#FDF8F5]">
      {/* Hero */}
      <section className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden">
        <Image src="/steph2.jpg" alt="Notre histoire" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A2B5F]/70 to-[#1A2B5F]/50" />
        <div className="relative z-10 text-center px-6">
          <motion.p className="text-sm uppercase tracking-[0.4em] text-[#F4A7B9] mb-3"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Josiane & Stéphane
          </motion.p>
          <motion.h1 className="font-heading text-6xl md:text-7xl text-white font-light"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Notre Histoire
          </motion.h1>
          <motion.div className="divider-rose mt-5 mx-auto"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.35 }} />
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <Heart className="w-10 h-10 text-[#e91e8c] fill-current mx-auto mb-6" />
            <p className="font-heading text-2xl md:text-3xl text-[#1A2B5F] italic leading-relaxed">
              &ldquo;L&apos;amour ne se cherche pas, il se reconnaît.
              Le jour où nos chemins se sont croisés,
              nous avons tous les deux su que quelque chose de grand commençait.&rdquo;
            </p>
            <div className="divider-rose mt-8 mx-auto" />
          </FadeIn>
        </div>
      </section>

      {/* Timeline — grille éditoriale */}
      <section className="py-16 pb-28 px-6 bg-[#FDF8F5]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="flex flex-col items-center gap-3 mb-14">
            <p className="text-sm uppercase tracking-[0.4em] text-[#e91e8c]">Les grandes étapes</p>
            <h2 className="font-heading text-5xl text-[#1A2B5F] text-center">Notre Chemin</h2>
            <div className="divider-rose mt-1" />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {timeline.map(({ year, title, text, color, highlight }, i) => (
              <FadeIn
                key={year}
                delay={i * 0.1}
                direction="up"
                className={highlight ? "sm:col-span-2" : ""}
              >
                <div className="relative h-full bg-white rounded-3xl p-7 border border-rose-50 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                  {/* Année géante en fond décoratif */}
                  <span
                    className="absolute -bottom-2 -right-1 font-heading font-bold leading-none select-none pointer-events-none transition-opacity duration-300 opacity-[0.06] group-hover:opacity-[0.11]"
                    style={{ fontSize: "clamp(70px, 14vw, 110px)", color }}
                  >
                    {year}
                  </span>

                  {/* Contenu */}
                  <div className="relative z-10">
                    {/* Barre d'accent colorée */}
                    <div className="w-8 h-0.5 rounded-full mb-5" style={{ backgroundColor: color }} />

                    {highlight && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e91e8c]/10 text-[#e91e8c] mb-3">
                        <Star className="w-3 h-3 fill-current" />
                        Le moment clé
                      </div>
                    )}

                    <p className="font-heading font-light leading-none mb-3" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color }}>
                      {year}
                    </p>
                    <h3 className="font-heading text-2xl text-[#1A2B5F] mb-3">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Anecdotes */}
      <section className="py-24 px-6 bg-gradient-wedding">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="flex flex-col items-center gap-3 mb-16">
            <p className="text-sm uppercase tracking-[0.4em] text-[#e91e8c]">Petites histoires</p>
            <h2 className="font-heading text-5xl text-[#1A2B5F] text-center">Nos anecdotes</h2>
            <div className="divider-rose mt-1" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {anecdotes.map(({ img, title, text }, i) => (
              <FadeIn key={title} delay={i * 0.12}>
                <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={img} alt={title} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <h3 className="font-heading text-2xl text-[#1A2B5F]">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* La demande — section spéciale */}
      <section className="relative py-24 px-6 overflow-hidden">
        <Image src="/steph1.jpg" alt="La demande" fill className="object-cover object-top" />
        <div className="absolute inset-0 bg-[#1A2B5F]/80 backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#e91e8c] flex items-center justify-center shadow-lg">
              <Star className="w-8 h-8 text-white fill-current" />
            </div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#F4A7B9]">Le moment inoubliable</p>
            <h2 className="font-heading text-5xl md:text-6xl text-white">La demande en mariage</h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-[#F4A7B9] to-[#4A90D9] rounded-full" />
            <p className="font-heading text-xl italic text-[#F4A7B9] leading-relaxed max-w-xl">
              &ldquo;Il avait tout planifié dans le plus grand secret.
              La bague, les fleurs, les mots — tout était parfait.
              Et quand il a posé la question, le temps s&apos;est arrêté.&rdquo;
            </p>
            <p className="text-blue-300 text-sm leading-relaxed max-w-md">
              Ce soir de 2024 restera gravé dans nos mémoires pour toujours.
              Nous avons hâte de partager avec vous la prochaine étape de cette belle aventure.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Photos côte à côte */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {["/steph1.jpg", "/steph4.jpg", "/steph5.jpg", "/steph8.jpg"].map((src, i) => (
            <FadeIn key={src} delay={i * 0.08}>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-wedding flex flex-col items-center gap-6 px-6 text-center">
        <FadeIn>
          <h2 className="font-heading text-4xl md:text-5xl text-[#1A2B5F]">Rejoignez-nous</h2>
          <p className="text-muted-foreground mt-3 mb-6">Le 7 novembre 2026, soyez témoins de la suite.</p>
          <a href="/rsvp" className="px-10 py-4 rounded-full font-semibold text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-all shadow-md hover:-translate-y-0.5">
            Confirmer ma présence
          </a>
        </FadeIn>
      </section>
    </div>
  );
}
