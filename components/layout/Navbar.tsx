"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";

// /story, /gifts et /gallery sont désactivées pour l'instant (pas encore prêtes) — voir leur page.tsx
const links = [
  { href: "/",        label: "Accueil" },
  { href: "/event",   label: "Le Mariage" },
  { href: "/rsvp",    label: "RSVP" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloque le scroll de la page derrière le menu plein écran : sur mobile Safari,
  // le rebond élastique du scroll de fond peut faire disparaître/mal peindre les
  // éléments position:fixed superposés (bug connu iOS).
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  const navBg = isHome
    ? scrolled
      ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-100"
      : "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-100";

  const textColor = isHome && !scrolled ? "text-white" : "text-[#1A2B5F]";
  const logoColor = isHome && !scrolled ? "text-white" : "text-[#e91e8c]";

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${logoColor} fill-current`}
            />
            {/* Pas encore relié au CMS (champ "general" ne couvre que home/footer/rsvp pour l'instant) */}
            <span
              className={`font-heading text-xl tracking-widest uppercase transition-colors duration-300 ${textColor}`}
            >
              J & S
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      relative text-sm tracking-wide font-medium transition-colors duration-300
                      ${active ? "text-[#e91e8c]" : textColor}
                      hover:text-[#e91e8c]
                    `}
                  >
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#e91e8c] rounded-full"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA desktop */}
          <Link
            href="/rsvp"
            className="hidden md:block px-5 py-2 rounded-full text-sm font-medium text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-colors duration-300 shadow-sm"
          >
            Confirmer ma présence
          </Link>

          {/* Burger mobile */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 transition-colors ${textColor}`}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu — pas de Framer Motion ici : sur Safari iOS, animer opacity/scale
          sur un position:fixed plein écran (surtout combiné à overflow-y-auto) déclenche
          un bug de compositing GPU connu qui peut peindre l'overlay tout noir ou invisible.
          Une simple transition CSS d'opacité évite ce comportement. */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`font-heading text-4xl tracking-wide ${
              pathname === href ? "text-[#e91e8c]" : "text-[#1A2B5F]"
            } hover:text-[#e91e8c] transition-colors`}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/rsvp"
          onClick={() => setOpen(false)}
          className="mt-4 px-8 py-3 rounded-full font-medium text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-colors"
        >
          Confirmer ma présence
        </Link>
      </div>
    </>
  );
}
