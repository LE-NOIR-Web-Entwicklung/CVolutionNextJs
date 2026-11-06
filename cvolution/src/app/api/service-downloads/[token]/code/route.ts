import { NextRequest, NextResponse } from "next/server";
import { sendDownloadCodeEmail } from "../../../../../../lib/resend";
import { isGrantExpired, issueAccessCode, loadGrant } from "@/lib/service-download-access";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const grant = await loadGrant(token);
  if (!grant || isGrantExpired(grant)) {
    return NextResponse.json({ error: "Dieser Link ist ungültig oder abgelaufen." }, { status: 404 });
  }

  try {
    const code = await issueAccessCode(grant, token);
    if (!code) return NextResponse.json({ error: "Bitte warten Sie eine Minute, bevor Sie einen neuen Code anfordern." }, { status: 429 });
    await sendDownloadCodeEmail(grant.email, code);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Download code failed", { grantId: grant.id, error });
    return NextResponse.json({ error: "Der Code konnte nicht versendet werden." }, { status: 500 });
  }
}
