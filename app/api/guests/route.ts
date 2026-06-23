import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

function generateToken() {
  return randomBytes(32).toString("hex");
}

// GET /api/guests — liste complète avec stats
export async function GET() {
  const guests = await prisma.guest.findMany({
    orderBy: [{ group: "asc" }, { name: "asc" }],
    include: { rsvp: { select: { attending: true, guestCount: true, mealChoice: true } } },
  });
  return NextResponse.json(guests);
}

// POST /api/guests — créer un invité (ou import batch)
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Import batch : tableau d'invités
  if (Array.isArray(body)) {
    const created = await prisma.$transaction(
      body.map((g: { name: string; phone?: string; address?: string; group?: string }) =>
        prisma.guest.create({
          data: {
            name: g.name,
            phone: g.phone ?? null,
            address: g.address ?? null,
            group: g.group ?? null,
            token: generateToken(),
          },
        })
      )
    );
    return NextResponse.json({ count: created.length }, { status: 201 });
  }

  // Création unitaire
  const { name, phone, address, group } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
  }
  const guest = await prisma.guest.create({
    data: { name, phone: phone ?? null, address: address ?? null, group: group ?? null, token: generateToken() },
  });
  return NextResponse.json(guest, { status: 201 });
}
