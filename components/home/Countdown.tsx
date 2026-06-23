"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTimeLeft(weddingDate: string) {
  const diff = new Date(weddingDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative px-5 py-4 md:px-7 md:py-5 rounded-2xl bg-white/8 border border-white/10 backdrop-blur-sm overflow-hidden">
        {/* Reflet haut */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <motion.span
          key={value}
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="block font-heading text-6xl md:text-8xl font-light text-white tabular-nums leading-none"
        >
          {pad(value)}
        </motion.span>
      </div>
      <span className="text-xs uppercase tracking-[0.3em] text-[#F4A7B9] font-medium">
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return (
    <span className="font-heading text-4xl md:text-6xl text-[#F4A7B9]/50 self-start mt-5 leading-none select-none pb-6">
      :
    </span>
  );
}

export default function Countdown({ weddingDate }: { weddingDate: string }) {
  const [time, setTime] = useState(() => getTimeLeft(weddingDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(weddingDate)), 1000);
    return () => clearInterval(id);
  }, [weddingDate]);

  return (
    <div className="flex items-end gap-3 md:gap-5">
      <Unit value={time.days}    label="Jours" />
      <Sep />
      <Unit value={time.hours}   label="Heures" />
      <Sep />
      <Unit value={time.minutes} label="Minutes" />
      <Sep />
      <Unit value={time.seconds} label="Secondes" />
    </div>
  );
}
