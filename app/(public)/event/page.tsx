import { getVenues, getEventFaq } from "@/lib/content";
import EventContent from "./EventContent";

export const dynamic = "force-dynamic";

export default async function EventPage() {
  const [venues, faq] = await Promise.all([getVenues(), getEventFaq()]);
  return <EventContent venues={venues} faq={faq} />;
}
