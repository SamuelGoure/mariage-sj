import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const guest = await prisma.guest.findUnique({
    where: { token },
    select: {
      id: true, name: true, group: true, status: true, seatsAllowed: true,
      rsvp: { select: { name: true, attending: true, email: true, phone: true, companions: true, message: true } },
    },
  });
  if (!guest) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(guest);
}
