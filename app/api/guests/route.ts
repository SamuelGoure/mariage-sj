import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomCode() {
  let code = "";
  for (let i = 0; i < 4; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return code;
}

// Génère un code à 4 caractères pas déjà utilisé en base ni dans `taken`
async function uniqueCode(taken: Set<string>) {
  for (let i = 0; i < 20; i++) {
    const code = randomCode();
    if (taken.has(code)) continue;
    const exists = await prisma.guest.findUnique({ where: { token: code } });
    if (!exists) { taken.add(code); return code; }
  }
  throw new Error("Impossible de générer un code unique.");
}

// GET /api/guests — liste complète avec stats
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const guests = await prisma.guest.findMany({
    orderBy: { name: "asc" },
    include: { rsvp: { select: { id: true, attending: true, guestCount: true, companions: true, email: true, phone: true, message: true, createdAt: true } } },
  });
  return NextResponse.json(guests);
}

// POST /api/guests — créer un invité (ou import batch)
export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const taken = new Set<string>();

  // Import batch : tableau d'invités
  if (Array.isArray(body)) {
    const rows: { name: string; token: string; seatsAllowed?: number }[] = [];
    for (const g of body as { name: string; token?: string; seatsAllowed?: number }[]) {
      const token = g.token?.trim().toUpperCase() || await uniqueCode(taken);
      rows.push({ name: g.name, token, seatsAllowed: g.seatsAllowed });
    }
    const created = await prisma.$transaction(
      rows.map((g) =>
        prisma.guest.create({
          data: {
            name: g.name,
            token: g.token,
            ...(g.seatsAllowed ? { seatsAllowed: g.seatsAllowed } : {}),
          },
        })
      )
    );
    return NextResponse.json({ count: created.length }, { status: 201 });
  }

  // Création unitaire
  const { name, token, seatsAllowed } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
  }
  const finalToken = token?.trim().toUpperCase() || await uniqueCode(taken);
  const guest = await prisma.guest.create({
    data: {
      name,
      token: finalToken,
      ...(seatsAllowed ? { seatsAllowed: Number(seatsAllowed) } : {}),
    },
  });
  return NextResponse.json(guest, { status: 201 });
}
