"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Upload, X, CheckCircle, Lock, ChevronLeft, ChevronRight,
  Clock, Calendar, MapPin, Image as ImageIcon,
} from "lucide-react";
import type { GalleryCard as Card } from "@/lib/content/sections";

const FILTERS = ["Tous", "Couple", "Voyage", "La demande"];

/* ── GalerieCard ────────────────────────────────────────────── */
function GalerieCard({
  card, onOpen, delay,
}: { card: Card; onOpen: () => void; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
      onClick={onOpen}
    >
      <div className="rounded-2xl overflow-hidden border border-rose-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="aspect-[4/3] bg-gradient-to-br from-[#f0dde8] to-[#eef4ff] flex items-center justify-center relative overflow-hidden">
          {card.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#e91e8c]/30">
              <ImageIcon className="w-10 h-10" />
            </div>
          )}
          {/* Tag overlay */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#e91e8c] backdrop-blur-sm">
            {card.tag}
          </span>
        </div>
        {/* Body */}
        <div className="p-5 flex flex-col gap-2">
          <h3 className="font-heading text-xl text-[#1A2B5F]">{card.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
          <div className="flex items-center justify-between mt-1">
            {card.date && (
              <span className="text-xs text-[#4A90D9] flex items-center gap-1">
                <Calendar className="w-3 h-3" />{card.date}
              </span>
            )}
            <button className="text-xs text-[#e91e8c] font-medium hover:text-[#c4177a] transition-colors ml-auto">
              Voir plus →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── GalerieFilters ─────────────────────────────────────────── */
function GalerieFilters({
  active, onChange,
}: { active: string; onChange: (f: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ opacity: 0, left: 0, width: 0 });

  function handleEnter(e: React.MouseEvent<HTMLButtonElement>) {
    const cRect = containerRef.current!.getBoundingClientRect();
    const bRect = e.currentTarget.getBoundingClientRect();
    setPill({ opacity: 1, left: bRect.left - cRect.left, width: bRect.width });
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-wrap gap-2 justify-center"
      onMouseLeave={() => setPill((p) => ({ ...p, opacity: 0 }))}
    >
      {/* hover pill */}
      <div
        className="absolute top-0 h-full bg-[#e91e8c]/10 rounded-full pointer-events-none transition-all duration-200"
        style={{ left: pill.left, width: pill.width, opacity: pill.opacity }}
      />
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          onMouseEnter={handleEnter}
          className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            active === f
              ? "bg-[#e91e8c] text-white shadow-md"
              : "bg-white border border-rose-100 text-[#1A2B5F] hover:text-[#e91e8c]"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

/* ── GalerieModal ───────────────────────────────────────────── */
function GalerieModal({
  card, cards, onClose, onNavigate,
}: { card: Card; cards: Card[]; onClose: () => void; onNavigate: (c: Card) => void }) {
  const index = cards.findIndex((c) => c.id === card.id);
  const hasPrev = index > 0;
  const hasNext = index < cards.length - 1;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(cards[index - 1]);
      if (e.key === "ArrowRight" && hasNext) onNavigate(cards[index + 1]);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, onNavigate, cards, index, hasPrev, hasNext]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#f0dde8] to-[#eef4ff] flex items-center justify-center aspect-square md:aspect-auto">
          {card.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#e91e8c]/30">
              <ImageIcon className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:w-1/2 flex flex-col">
          <div className="flex-1 p-8 flex flex-col gap-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e91e8c]/10 text-[#e91e8c] w-fit">
              {card.tag}
            </span>
            <h2 className="font-heading text-3xl text-[#1A2B5F]">{card.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.fullDesc || card.desc}
            </p>
            <div className="flex flex-col gap-2 mt-auto">
              {card.duration && (
                <div className="flex items-center gap-2 text-sm text-[#1A2B5F]">
                  <Clock className="w-4 h-4 text-[#e91e8c]" />{card.duration}
                </div>
              )}
              {card.date && (
                <div className="flex items-center gap-2 text-sm text-[#1A2B5F]">
                  <Calendar className="w-4 h-4 text-[#e91e8c]" />{card.date}
                </div>
              )}
              {card.location && (
                <div className="flex items-center gap-2 text-sm text-[#1A2B5F]">
                  <MapPin className="w-4 h-4 text-[#e91e8c]" />{card.location}
                </div>
              )}
            </div>
          </div>

          {/* Navigation barre */}
          <div className="border-t border-rose-100 px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => hasPrev && onNavigate(cards[index - 1])}
              disabled={!hasPrev}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-rose-200 text-[#1A2B5F] hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-medium text-[#e91e8c] border border-[#e91e8c] hover:bg-[#e91e8c] hover:text-white transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => hasNext && onNavigate(cards[index + 1])}
              disabled={!hasNext}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-rose-200 text-[#1A2B5F] hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Upload modal ───────────────────────────────────────────── */
function UploadModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function checkCode() {
    if (code.trim().toUpperCase() === "SJMARIAGE2025") {
      setCodeValid(true); setCodeError("");
    } else {
      setCodeError("Code incorrect. Demandez-le aux mariés.");
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setUploading(false); setDone(true); setFile(null);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-md p-8 flex flex-col gap-6 shadow-2xl relative"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-muted-foreground hover:text-[#1A2B5F]">
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="font-heading text-3xl text-[#1A2B5F]">Partager une photo</h3>
          <p className="text-sm text-muted-foreground mt-1">Visible après validation des mariés.</p>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle className="w-16 h-16 text-[#e91e8c]" />
            <h4 className="font-heading text-2xl text-[#1A2B5F]">Merci !</h4>
            <p className="text-sm text-muted-foreground">Photo reçue — elle sera publiée après validation.</p>
            <button onClick={() => { setDone(false); setCodeValid(false); setCode(""); }}
              className="mt-2 text-sm text-[#e91e8c] underline">Envoyer une autre</button>
          </div>
        ) : !codeValid ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-rose-50 rounded-xl px-4 py-3">
              <Lock className="w-4 h-4 text-[#e91e8c]" />
              Entrez le code remis par les mariés
            </div>
            <input type="text" placeholder="Code d'accès"
              value={code} onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkCode()}
              className="px-4 py-3 border border-rose-200 rounded-xl text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#e91e8c]"
            />
            {codeError && <p className="text-sm text-red-500 text-center">{codeError}</p>}
            <button onClick={checkCode}
              className="px-6 py-3 rounded-full font-semibold text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-colors">
              Valider
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div
              className="border-2 border-dashed border-rose-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#e91e8c] transition-colors"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) setFile(f); }}
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-[#e91e8c]" />
                  <p className="text-sm font-medium text-[#1A2B5F]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-8 h-8" />
                  <p className="text-sm">Glissez une image ou cliquez</p>
                  <p className="text-xs">JPG, PNG, WEBP — max 10 MB</p>
                </div>
              )}
            </div>
            <button disabled={!file || uploading} onClick={handleUpload}
              className="px-6 py-3 rounded-full font-semibold text-white bg-[#e91e8c] hover:bg-[#c4177a] disabled:opacity-50 transition-colors">
              {uploading ? "Envoi..." : "Envoyer la photo"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function GalleryClient({ initialCards }: { initialCards: Card[] }) {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const filtered =
    activeFilter === "Tous" ? initialCards : initialCards.filter((c) => c.tag === activeFilter);

  return (
    <div className="bg-[#FDF8F5]">
      {/* Hero */}
      <section className="relative h-72 md:h-80 bg-gradient-to-br from-[#1A2B5F] to-[#2d4080] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,167,185,0.15),transparent_60%)]" />
        <div className="relative z-10 text-center px-6">
          <motion.p className="text-sm uppercase tracking-[0.4em] text-[#F4A7B9] mb-3"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Stéphane & Josiane
          </motion.p>
          <motion.h1 className="font-heading text-6xl md:text-7xl text-white font-light"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Galerie
          </motion.h1>
          <motion.div className="divider-rose mt-5 mx-auto"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.35 }} />
        </div>
      </section>

      {/* Grille */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          {/* Filtres */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <GalerieFilters active={activeFilter} onChange={setActiveFilter} />
          </motion.div>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((card, i) => (
                <GalerieCard
                  key={card.id}
                  card={card}
                  onOpen={() => setSelectedCard(card)}
                  delay={i * 0.07}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Upload invités */}
      <section className="py-20 bg-[#1A2B5F] px-6">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <p className="text-sm uppercase tracking-[0.4em] text-[#F4A7B9]">Album collaboratif</p>
          <h2 className="font-heading text-5xl text-white">Partagez vos photos</h2>
          <div className="w-14 h-0.5 bg-gradient-to-r from-[#F4A7B9] to-[#4A90D9] rounded-full" />
          <p className="text-blue-200 text-sm leading-relaxed max-w-md">
            Vous avez capturé de beaux moments lors de notre mariage ?
            Partagez-les avec nous et tous les invités.
          </p>
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-[#e91e8c] hover:bg-[#c4177a] transition-all shadow-md hover:-translate-y-0.5"
          >
            <Upload className="w-5 h-5" />
            Ajouter mes photos
          </button>
        </div>
      </section>

      {/* Modal galerie */}
      <AnimatePresence>
        {selectedCard && (
          <GalerieModal
            card={selectedCard}
            cards={filtered}
            onClose={() => setSelectedCard(null)}
            onNavigate={(c) => setSelectedCard(c)}
          />
        )}
      </AnimatePresence>

      {/* Modal upload */}
      <AnimatePresence>
        {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
