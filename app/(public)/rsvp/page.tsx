import { Suspense } from "react";
import { getGeneral, getVenues } from "@/lib/content";
import RsvpContent from "./RsvpContent";

export const dynamic = "force-dynamic";

export default async function RsvpPage() {
  const [general, venues] = await Promise.all([getGeneral(), getVenues()]);
  return (
    <Suspense fallback={null}>
      <RsvpContent general={general} venues={venues} />
    </Suspense>
  );
}
