"use client";

import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";

export default function ArrayEditor<T>({
  items, onChange, renderRow, onAdd, addLabel = "Ajouter",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderRow: (item: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
  onAdd: () => T;
  addLabel?: string;
}) {
  function update(index: number, patch: Partial<T>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3">
          <div className="flex-1">{renderRow(item, i, (patch) => update(i, patch))}</div>
          <div className="flex flex-col gap-1 shrink-0">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white/70 transition-colors">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white/70 transition-colors">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => remove(i)}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 hover:bg-red-500/30 text-white/70 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, onAdd()])}
        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-colors"
      >
        <Plus className="w-4 h-4" /> {addLabel}
      </button>
    </div>
  );
}
