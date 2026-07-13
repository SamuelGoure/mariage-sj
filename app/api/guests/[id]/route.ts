import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

// PATCH /api/guests/[id] — modifier statut ou infos
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();
  try {
    const guest = await prisma.guest.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json(guest);
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
      return NextResponse.json({ error: "Ce code est déjà utilisé par un autre invité." }, { status: 400 });
    }
    console.error("[GUEST PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

// DELETE /api/guests/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.guest.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
