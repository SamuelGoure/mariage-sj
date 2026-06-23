import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loadSection } from "@/lib/content";
import { SECTIONS, type SectionKey } from "@/lib/content/sections";

function isSectionKey(key: string): key is SectionKey {
  return key in SECTIONS;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { key } = await params;
  if (!isSectionKey(key)) return NextResponse.json({ error: "Section inconnue." }, { status: 404 });

  const data = await loadSection(key);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { key } = await params;
  if (!isSectionKey(key)) return NextResponse.json({ error: "Section inconnue." }, { status: 404 });

  const body = await req.json();
  const { schema } = SECTIONS[key];
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  await prisma.contentSection.upsert({
    where: { key },
    create: { key, data: parsed.data },
    update: { data: parsed.data },
  });

  return NextResponse.json({ success: true });
}
