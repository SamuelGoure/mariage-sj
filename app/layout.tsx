import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Métadonnées statiques (pas encore reliées au CMS) — à garder cohérentes avec lib/content/sections.ts
export const metadata: Metadata = {
  title: "Josiane & Stéphane — Notre Mariage",
  description: "Rejoignez-nous pour célébrer notre union le jour le plus beau de notre vie.",
  openGraph: {
    title: "Josiane & Stéphane",
    description: "Rejoignez-nous pour célébrer notre union.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-background">
        {children}
      </body>
    </html>
  );
}
