import { getGeneral, getVenues, getEventFaq } from "@/lib/content";
import EventContent from "./EventContent";

export const dynamic = "force-dynamic";

export default async function EventPage() {
  const [general, venues, faq] = await Promise.all([getGeneral(), getVenues(), getEventFaq()]);
  return <EventContent general={general} venues={venues} faq={faq} />;
}
