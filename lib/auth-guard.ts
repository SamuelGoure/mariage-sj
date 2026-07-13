import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// À utiliser dans les routes API admin qui ne sont pas sous /api/admin/*
// (donc pas déjà couvertes par le matcher de proxy.ts).
export async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }
  return null;
}
