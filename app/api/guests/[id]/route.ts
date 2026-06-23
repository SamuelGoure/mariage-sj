import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/guests/[id] — modifier statut ou infos
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const guest = await prisma.guest.update({
    where: { id: Number(id) },
    data: body,
  });
  return NextResponse.json(guest);
}

// DELETE /api/guests/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.guest.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
