import { Suspense } from "react";
import { getGeneral } from "@/lib/content";
import RsvpContent from "./RsvpContent";

export const dynamic = "force-dynamic";

export default async function RsvpPage() {
  const general = await getGeneral();
  return (
    <Suspense fallback={null}>
      <RsvpContent general={general} />
    </Suspense>
  );
}
