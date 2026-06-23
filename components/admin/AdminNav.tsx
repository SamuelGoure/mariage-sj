"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, Image, FileText, LogOut } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/rsvp", label: "RSVP", icon: Users },
  { href: "/admin/guests", label: "Invités", icon: Users },
  { href: "/admin/gallery", label: "Galerie", icon: Image },
  { href: "/admin/content", label: "Contenu", icon: FileText },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-white/10 bg-[#162552] px-6 py-2.5 flex items-center gap-1 overflow-x-auto">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              active ? "bg-[#e91e8c] text-white" : "text-blue-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </Link>
        );
      })}
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-300 hover:text-white hover:bg-white/10 transition-colors ml-auto"
      >
        <LogOut className="w-3.5 h-3.5" /> Déconnexion
      </button>
    </div>
  );
}
