import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, attending, companions, message, guestToken } = body;

    if (!name?.trim() || attending === undefined) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    if (attending && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? "")) {
      return NextResponse.json({ error: "Merci de renseigner une adresse email valide." }, { status: 400 });
    }

    // Résoudre le guest via le token si fourni
    let guestId: number | null = null;
    let seatsAllowed = 4;
    if (guestToken) {
      const guest = await prisma.guest.findUnique({ where: { token: guestToken } });
      if (guest) { guestId = guest.id; seatsAllowed = guest.seatsAllowed; }
    }

    const cleanCompanions: string[] = Boolean(attending) && Array.isArray(companions)
      ? companions.map((c: string) => c.trim()).filter(Boolean)
      : [];

    const maxCompanions = Math.max(0, seatsAllowed - 1);
    if (cleanCompanions.length > maxCompanions) {
      return NextResponse.json(
        { error: `Vous pouvez ajouter au maximum ${maxCompanions} accompagnant(s).` },
        { status: 400 }
      );
    }

    const rsvpData = {
      name: name.trim(),
      email: attending ? email.trim() : null,
      phone: attending ? (phone?.trim() || null) : null,
      attending:  Boolean(attending),
      guestCount: attending ? 1 + cleanCompanions.length : 0,
      companions: cleanCompanions,
      message:    message?.trim() || null,
    };

    // Un invité avec token peut resoumettre pour modifier sa réponse : on
    // met à jour son unique RSVP existant plutôt que d'en créer un second
    // (guestId est unique en base, un 2e create() échouerait).
    const rsvp = guestId
      ? await prisma.rsvp.upsert({
          where: { guestId },
          update: rsvpData,
          create: { ...rsvpData, guestId },
        })
      : await prisma.rsvp.create({ data: rsvpData });

    // La réponse attend la validation de l'admin avant de compter comme Confirmé/Décliné
    if (guestId) {
      await prisma.guest.update({
        where: { id: guestId },
        data: { name: name.trim(), status: "AWAITING_VALIDATION" },
      });
    }

    return NextResponse.json({ success: true, id: rsvp.id }, { status: 201 });
  } catch (err) {
    console.error("[RSVP POST]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const rsvps = await prisma.rsvp.findMany({
      orderBy: { createdAt: "desc" },
      include: { guest: { select: { id: true, name: true, group: true, token: true, status: true } } },
    });
    return NextResponse.json(rsvps);
  } catch (err) {
    console.error("[RSVP GET]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
