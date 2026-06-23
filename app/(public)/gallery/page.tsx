import { getGalleryHighlights } from "@/lib/content";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const { items } = await getGalleryHighlights();
  return <GalleryClient initialCards={items} />;
}
