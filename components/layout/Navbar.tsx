"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";

const links = [
  { href: "/",        label: "Accueil" },
  { href: "/event",   label: "Le Mariage" },
  { href: "/story",   label: "Notre Histoire" },
  { href: "/rsvp",    label: "RSVP" },
  { href: "/gifts",   label: "Cadeaux" },
  { href: "/gallery", label: "Galerie" },
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

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            {links.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`font-heading text-4xl tracking-wide ${
                    pathname === href ? "text-[#e91e8c]" : "text-[#1A2B5F]"
                  } hover:text-[#e91e8c] transition-colors`}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <Link
              href="/rsvp"
              onClick={() => setOpen(false)}
              className="mt-4 px-8 py-3 rounded-full font-medium text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-colors"
            >
              Confirmer ma présence
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
