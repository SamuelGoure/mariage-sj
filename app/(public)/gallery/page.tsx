import { redirect } from "next/navigation";
import { getGalleryHighlights } from "@/lib/content";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  // Page pas encore prête à être montrée aux invités — retirer cette ligne pour la réactiver
  redirect("/");

  const { items } = await getGalleryHighlights();
  return <GalleryClient initialCards={items} />;
}
