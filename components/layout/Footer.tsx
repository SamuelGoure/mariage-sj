import Link from "next/link";
import { Heart } from "lucide-react";
import { getGeneral } from "@/lib/content";

export default async function Footer() {
  const general = await getGeneral();
  const names = general.nameOrder.map((role) => (role === "bride" ? general.brideName : general.groomName));
  const fullNames = names.join(" & ");
  const initials = names.map((n) => n[0]).join(" & ");

  return (
    <footer className="bg-[#1A2B5F] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#F4A7B9] fill-current" />
              <span className="font-heading text-2xl tracking-widest uppercase text-white">
                {initials}
              </span>
            </div>
            <p className="font-heading text-lg italic text-[#F4A7B9]">
              {fullNames}
            </p>
            <p className="text-sm text-blue-200 text-center md:text-left leading-relaxed">
              Un jour, une promesse, une éternité.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-3">
            <h4 className="font-heading text-xl text-[#F4A7B9] mb-2">Navigation</h4>
            {[
              { href: "/event",   label: "Le Mariage" },
              { href: "/story",   label: "Notre Histoire" },
              { href: "/rsvp",    label: "RSVP" },
              { href: "/gifts",   label: "Cadeaux" },
              { href: "/gallery", label: "Galerie" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-blue-200 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Hashtag & infos */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <p className="font-heading text-3xl text-[#F4A7B9] italic">
              {general.hashtag}
            </p>
            <p className="text-sm text-blue-200 text-center md:text-right">
              Partagez vos photos avec notre hashtag
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-300">
            Fait avec <Heart className="inline w-3 h-3 text-[#F4A7B9] fill-current mx-1" /> pour {fullNames}
          </p>
          <p className="text-sm text-blue-300">
            © {new Date().getFullYear()} — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
