import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

// DELETE /api/rsvp/[id] — rejeter une soumission : supprime la réponse et remet l'invité en attente
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const rsvp = await prisma.rsvp.findUnique({ where: { id: Number(id) } });
  if (!rsvp) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.rsvp.delete({ where: { id: Number(id) } }),
    ...(rsvp.guestId
      ? [prisma.guest.update({ where: { id: rsvp.guestId }, data: { status: "PENDING" } })]
      : []),
  ]);

  return NextResponse.json({ ok: true });
}
