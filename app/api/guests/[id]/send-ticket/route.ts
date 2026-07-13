import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { sendTicketEmail } from "@/lib/email";
import { getGeneral, getVenues } from "@/lib/content";
import { formatLongDateFr } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth-guard";

// POST /api/guests/[id]/send-ticket — envoie le billet (QR code) par email
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const guest = await prisma.guest.findUnique({
    where: { id: Number(id) },
    include: { rsvp: { select: { email: true, companions: true } } },
  });

  if (!guest) {
    return NextResponse.json({ error: "Invité introuvable." }, { status: 404 });
  }
  if (guest.status !== "CONFIRMED") {
    return NextResponse.json({ error: "L'invité doit être confirmé avant l'envoi du billet." }, { status: 400 });
  }
  if (!guest.rsvp?.email) {
    return NextResponse.json({ error: "Aucun email renseigné pour cet invité." }, { status: 400 });
  }

  try {
    const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const qrPngBuffer = await QRCode.toBuffer(`${origin}/rsvp?g=${guest.token}`, { width: 480, margin: 2 });

    const [general, venues] = await Promise.all([getGeneral(), getVenues()]);
    const coupleNames = general.nameOrder
      .map((role) => (role === "bride" ? general.brideName : general.groomName))
      .join(" & ");

    await sendTicketEmail({
      to: guest.rsvp.email,
      guestName: guest.name,
      companions: (guest.rsvp.companions as string[] | null) ?? [],
      qrPngBuffer,
      coupleNames,
      weddingDateText: formatLongDateFr(general.weddingDate),
      venueName: venues.ceremony.name,
    });

    const updated = await prisma.guest.update({
      where: { id: guest.id },
      data: { ticketSentAt: new Date() },
    });

    return NextResponse.json({ success: true, ticketSentAt: updated.ticketSentAt });
  } catch (err) {
    console.error("[SEND TICKET]", err);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email." }, { status: 500 });
  }
}
