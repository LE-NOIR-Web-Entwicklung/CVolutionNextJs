import { NextRequest, NextResponse } from "next/server";
import {
  DOWNLOAD_SESSION_COOKIE,
  hasValidSession,
  isGrantExpired,
  listGrantItems,
  loadGrant,
  maskEmail,
} from "@/lib/service-download-access";

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const grant = await loadGrant(token);
  if (!grant) return NextResponse.json({ error: "Dieser Link ist ungültig." }, { status: 404, headers: NO_STORE });
  if (isGrantExpired(grant)) return NextResponse.json({ error: "Dieser Link ist abgelaufen." }, { status: 410, headers: NO_STORE });

  const unlocked = hasValidSession(grant, request.cookies.get(DOWNLOAD_SESSION_COOKIE)?.value);
  return NextResponse.json({
    maskedEmail: maskEmail(grant.email),
    unlocked,
    items: unlocked ? await listGrantItems(grant.id) : [],
  }, { headers: NO_STORE });
}
