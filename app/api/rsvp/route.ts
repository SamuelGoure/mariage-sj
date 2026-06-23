import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, attending, guestCount, mealChoice, allergies, message, guestToken } = body;

    if (!firstName || !lastName || attending === undefined) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    // Résoudre le guest via le token si fourni
    let guestId: number | null = null;
    if (guestToken) {
      const guest = await prisma.guest.findUnique({ where: { token: guestToken } });
      if (guest) guestId = guest.id;
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        attending:  Boolean(attending),
        guestCount: attending ? Math.max(1, Number(guestCount) || 1) : 0,
        mealChoice: mealChoice ?? null,
        allergies:  allergies?.trim() || null,
        message:    message?.trim() || null,
        ...(guestId ? { guestId } : {}),
      },
    });

    // Mettre à jour le statut du Guest
    if (guestId) {
      await prisma.guest.update({
        where: { id: guestId },
        data: { status: attending ? "CONFIRMED" : "DECLINED" },
      });
    }

    return NextResponse.json({ success: true, id: rsvp.id }, { status: 201 });
  } catch (err) {
    console.error("[RSVP POST]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rsvps = await prisma.rsvp.findMany({
      orderBy: { createdAt: "desc" },
      include: { guest: { select: { name: true, group: true } } },
    });
    return NextResponse.json(rsvps);
  } catch (err) {
    console.error("[RSVP GET]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
