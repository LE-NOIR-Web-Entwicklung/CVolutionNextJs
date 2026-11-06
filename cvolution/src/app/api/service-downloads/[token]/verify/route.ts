import { NextRequest, NextResponse } from "next/server";
import {
  DOWNLOAD_SESSION_COOKIE,
  DOWNLOAD_SESSION_MINUTES,
  isGrantExpired,
  loadGrant,
  verifyAccessCode,
} from "@/lib/service-download-access";

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const grant = await loadGrant(token);
  if (!grant || isGrantExpired(grant)) {
    return NextResponse.json({ error: "Dieser Link ist ungültig oder abgelaufen." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.replace(/\s/g, "") : "";
  const sessionToken = /^\d{6}$/.test(code) ? await verifyAccessCode(grant, token, code) : null;
  if (!sessionToken) {
    return NextResponse.json({ error: "Der Code ist falsch oder abgelaufen." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(DOWNLOAD_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/service-downloads",
    maxAge: DOWNLOAD_SESSION_MINUTES * 60,
  });
  return response;
}
