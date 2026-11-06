import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { personalizeDownload } from "@/lib/service-download-files";
import {
  claimDownload,
  DOWNLOAD_SESSION_COOKIE,
  hasValidSession,
  isGrantExpired,
  loadGrant,
  loadGrantItem,
} from "@/lib/service-download-access";
import { getServiceDownload } from "@/lib/service-downloads";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CONTENT_TYPES = {
  PDF: "application/pdf",
  Word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; itemId: string }> }
) {
  const { token, itemId } = await params;
  const grant = await loadGrant(token);
  if (!grant || isGrantExpired(grant) || !hasValidSession(grant, request.cookies.get(DOWNLOAD_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Bitte bestätigen Sie zuerst den Code." }, { status: 401 });
  }

  const item = UUID.test(itemId) ? await loadGrantItem(grant.id, itemId) : null;
  const download = getServiceDownload(item?.product_key);
  if (!item || !download) return NextResponse.json({ error: "Dokument nicht gefunden." }, { status: 404 });

  const source = await readFile(path.join(process.cwd(), "private-downloads", download.file));
  const personalized = await personalizeDownload(download.file, source, {
    buyerName: grant.buyer_name,
    email: grant.email,
    orderReference: grant.order_reference,
  });

  if (!(await claimDownload(item))) {
    return NextResponse.json({ error: "Das Download-Limit für dieses Dokument ist erreicht." }, { status: 403 });
  }

  return new NextResponse(Buffer.from(personalized), {
    headers: {
      "Content-Type": CONTENT_TYPES[download.format],
      "Content-Disposition": `attachment; filename="${download.downloadName}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
