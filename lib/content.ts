import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { SECTIONS, type SectionKey } from "@/lib/content/sections";

export async function loadSection<K extends SectionKey>(
  key: K
): Promise<(typeof SECTIONS)[K]["default"]> {
  const { schema, default: fallback } = SECTIONS[key];
  try {
    const row = await prisma.contentSection.findUnique({ where: { key } });
    if (!row) return fallback;

    const parsed = schema.safeParse(row.data);
    if (!parsed.success) {
      console.error(`[content] invalid data for section "${key}":`, parsed.error.message);
      return fallback;
    }
    return parsed.data as (typeof SECTIONS)[K]["default"];
  } catch (err) {
    console.error(`[content] failed to load section "${key}":`, err);
    return fallback;
  }
}

export const getGeneral = cache(() => loadSection("general"));
export const getVenues = cache(() => loadSection("venues"));
export const getEventFaq = cache(() => loadSection("event_faq"));
export const getGalleryHighlights = cache(() => loadSection("gallery_highlights"));
