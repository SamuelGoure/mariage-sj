"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import ArrayEditor from "@/components/admin/ArrayEditor";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type {
  GeneralContent, VenuesContent, Venue, EventFaqContent, GalleryHighlightsContent, GalleryCard,
} from "@/lib/content/sections";

const TABS = [
  { key: "general", label: "Général" },
  { key: "venues", label: "Lieux" },
  { key: "event_faq", label: "FAQ" },
  { key: "gallery_highlights", label: "Galerie" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const inputClass =
  "w-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function Loading() {
  return <div className="py-12 text-center text-white/40 text-sm">Chargement…</div>;
}

function SaveButton({
  onClick, saving, saved, error,
}: { onClick: () => void; saving: boolean; saved: boolean; error?: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button" onClick={onClick} disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e91e8c] hover:bg-[#c4177a] disabled:opacity-40 text-white text-sm font-semibold transition-colors w-fit"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saving ? "Enregistrement…" : saved ? "Enregistré" : "Enregistrer"}
      </button>
      {error && (
        <span className="flex items-center gap-1.5 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </span>
      )}
    </div>
  );
}

function useSection<T>(key: TabKey) {
  const [data, setData] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/content/${key}`)
      .then((r) => r.json())
      .then((d) => { if (active) setData(d); });
    return () => { active = false; };
  }, [key]);

  async function save() {
    if (data === null) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch(`/api/admin/content/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || `Échec de l'enregistrement (HTTP ${res.status}).`);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setSaving(false);
    }
  }

  return { data, setData, save, saving, saved, error };
}

function GeneralTab({ section }: { section: ReturnType<typeof useSection<GeneralContent>> }) {
  const { data, setData, save, saving, saved, error } = section;
  if (!data) return <Loading />;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Prénom du marié">
          <input value={data.groomName} onChange={(e) => setData({ ...data, groomName: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Prénom de la mariée">
          <input value={data.brideName} onChange={(e) => setData({ ...data, brideName: e.target.value })} className={inputClass} />
        </Field>
      </div>
      <Field label="Ordre d'affichage des noms">
        <select
          value={data.nameOrder[0]}
          onChange={(e) => {
            const first = e.target.value as "bride" | "groom";
            setData({ ...data, nameOrder: [first, first === "bride" ? "groom" : "bride"] });
          }}
          className={inputClass}
        >
          <option value="bride">Mariée puis marié</option>
          <option value="groom">Marié puis mariée</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date et heure du mariage">
          <input
            type="datetime-local"
            value={data.weddingDate.slice(0, 16)}
            onChange={(e) => setData({ ...data, weddingDate: `${e.target.value}:00` })}
            className={inputClass}
          />
        </Field>
        <Field label="Date limite RSVP">
          <input
            type="date"
            value={data.rsvpDeadline.slice(0, 10)}
            onChange={(e) => setData({ ...data, rsvpDeadline: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Hashtag">
        <input value={data.hashtag} onChange={(e) => setData({ ...data, hashtag: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Lieu (résumé court)">
        <input value={data.venueShortName} onChange={(e) => setData({ ...data, venueShortName: e.target.value })} className={inputClass} />
      </Field>
      <SaveButton onClick={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}

function VenueForm({ venue, onChange }: { venue: Venue; onChange: (v: Venue) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <Field label="Nom du lieu">
        <input value={venue.name} onChange={(e) => onChange({ ...venue, name: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Adresse">
        <input value={venue.address} onChange={(e) => onChange({ ...venue, address: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Horaires (texte libre)">
        <input value={venue.timeText} onChange={(e) => onChange({ ...venue, timeText: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Lien Google Maps">
        <input value={venue.mapsUrl} onChange={(e) => onChange({ ...venue, mapsUrl: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Téléphone">
        <input value={venue.phone} onChange={(e) => onChange({ ...venue, phone: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Photo">
        <ImageUploadField value={venue.image} onChange={(url) => onChange({ ...venue, image: url })} />
      </Field>
    </div>
  );
}

function VenuesTab({ section }: { section: ReturnType<typeof useSection<VenuesContent>> }) {
  const { data, setData, save, saving, saved, error } = section;
  if (!data) return <Loading />;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Cérémonie civile</h3>
          <VenueForm venue={data.ceremony} onChange={(v) => setData({ ...data, ceremony: v })} />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Cérémonie religieuse / Réception</h3>
          <VenueForm venue={data.reception} onChange={(v) => setData({ ...data, reception: v })} />
        </div>
      </div>
      <SaveButton onClick={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}

function FaqTab({ section }: { section: ReturnType<typeof useSection<EventFaqContent>> }) {
  const { data, setData, save, saving, saved, error } = section;
  if (!data) return <Loading />;

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <ArrayEditor
        items={data.items}
        onChange={(items) => setData({ items })}
        onAdd={() => ({ q: "", a: "" })}
        addLabel="Ajouter une question"
        renderRow={(item, _i, update) => (
          <div className="flex flex-col gap-2">
            <input value={item.q} onChange={(e) => update({ q: e.target.value })} placeholder="Question" className={inputClass} />
            <textarea value={item.a} onChange={(e) => update({ a: e.target.value })} placeholder="Réponse" rows={2} className={inputClass} />
          </div>
        )}
      />
      <SaveButton onClick={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}

function GalleryTab({ section }: { section: ReturnType<typeof useSection<GalleryHighlightsContent>> }) {
  const { data, setData, save, saving, saved, error } = section;
  if (!data) return <Loading />;

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <ArrayEditor
        items={data.items}
        onChange={(items) => setData({ items })}
        onAdd={(): GalleryCard => ({ id: Date.now(), tag: "Couple", title: "", desc: "" })}
        addLabel="Ajouter une photo"
        renderRow={(item, _i, update) => (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Titre" className={inputClass} />
              <input value={item.tag} onChange={(e) => update({ tag: e.target.value })} placeholder="Tag (Couple, Voyage…)" className={inputClass} />
            </div>
            <input value={item.desc} onChange={(e) => update({ desc: e.target.value })} placeholder="Description courte" className={inputClass} />
            <textarea value={item.fullDesc ?? ""} onChange={(e) => update({ fullDesc: e.target.value })} placeholder="Description complète" rows={2} className={inputClass} />
            <div className="grid grid-cols-2 gap-2">
              <input value={item.date ?? ""} onChange={(e) => update({ date: e.target.value })} placeholder="Date" className={inputClass} />
              <input value={item.location ?? ""} onChange={(e) => update({ location: e.target.value })} placeholder="Lieu" className={inputClass} />
            </div>
            <ImageUploadField value={item.img} onChange={(url) => update({ img: url })} />
          </div>
        )}
      />
      <SaveButton onClick={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const general = useSection<GeneralContent>("general");
  const venues = useSection<VenuesContent>("venues");
  const faq = useSection<EventFaqContent>("event_faq");
  const gallery = useSection<GalleryHighlightsContent>("gallery_highlights");

  return (
    <div className="min-h-screen bg-[#1A2B5F] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Contenu du site</h1>
        <p className="text-white/50 text-sm mb-8">
          Modifiez les textes, dates, lieux et photos affichés sur le site public.
        </p>

        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === t.key ? "bg-[#e91e8c] text-white" : "bg-white/10 text-blue-200 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "general" && <GeneralTab section={general} />}
        {activeTab === "venues" && <VenuesTab section={venues} />}
        {activeTab === "event_faq" && <FaqTab section={faq} />}
        {activeTab === "gallery_highlights" && <GalleryTab section={gallery} />}
      </div>
    </div>
  );
}
