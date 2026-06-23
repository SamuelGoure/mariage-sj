import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const photos = await prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(photos);
  } catch (err) {
    console.error("[GALLERY GET]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, uploadedBy } = await req.json();
    if (!url) return NextResponse.json({ error: "URL requise." }, { status: 400 });

    const photo = await prisma.gallery.create({
      data: { url, uploadedBy: uploadedBy?.trim() || null, status: "PENDING" },
    });
    return NextResponse.json({ success: true, id: photo.id }, { status: 201 });
  } catch (err) {
    console.error("[GALLERY POST]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
