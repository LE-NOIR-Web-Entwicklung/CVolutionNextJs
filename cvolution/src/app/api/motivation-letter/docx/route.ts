import { NextRequest, NextResponse } from "next/server";
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { supabaseAdmin } from "../../../../../lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DocxRequest = {
  letter?: string;
  jobTitle?: string;
  company?: string;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+\n/g, "\n").trim().slice(0, maxLength);
}

function isSelfServiceIncluded(profile: any) {
  const now = Date.now();
  const periodEnd = profile?.subscription_current_period_end || profile?.paydate;
  const periodEndMs = periodEnd ? new Date(periodEnd).getTime() : 0;
  const isWithinPaidPeriod = Number.isFinite(periodEndMs) && periodEndMs > now;
  const hasSubscriptionStatus = ["active", "canceled"].includes(profile?.subscription_status);

  return Boolean(isWithinPaidPeriod && (profile?.paid || hasSubscriptionStatus));
}

function createLetterParagraphs(letter: string) {
  return letter.split("\n").map((line) => {
    if (!line.trim()) {
      return new Paragraph({
        children: [new TextRun({ text: "", font: "Arial", size: 22 })],
        spacing: { after: 120 },
      });
    }

    const trimmedLine = line.trim();
    const isSubjectLine = /^(betreff|subject|objet)\b/i.test(trimmedLine);

    return new Paragraph({
      children: [
        new TextRun({
          text: trimmedLine,
          font: "Arial",
          size: 22,
          bold: isSubjectLine,
        }),
      ],
      spacing: { after: isSubjectLine ? 300 : 180 },
      alignment: AlignmentType.LEFT,
    });
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  if (!token) {
    return jsonError("Unauthorized", 401);
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  const user = userData.user;

  if (userError || !user) {
    return jsonError("Unauthorized", 401);
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("paid,paydate,subscription_current_period_end,subscription_status")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile || !isSelfServiceIncluded(profile)) {
    return jsonError("Dieses Feature ist im aktiven Self-Service-Abo enthalten.", 402);
  }

  const body = (await request.json().catch(() => null)) as DocxRequest | null;
  if (!body) {
    return jsonError("Ungültige Anfrage.", 400);
  }

  const letter = cleanText(body.letter, 12000);
  const jobTitle = cleanText(body.jobTitle, 140);
  const company = cleanText(body.company, 140);

  if (!letter) {
    return jsonError("Kein Motivationsschreiben zum Exportieren vorhanden.", 400);
  }

  const docxDocument = new Document({
    creator: "CVolution",
    title: "Motivationsschreiben",
    description: `Motivationsschreiben fuer ${jobTitle || "Bewerbung"}${company ? ` bei ${company}` : ""}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: createLetterParagraphs(letter),
      },
    ],
  });

  const buffer = await Packer.toBuffer(docxDocument);
  const fileName = `motivationsschreiben-${slugify(company || jobTitle || "cvolution") || "cvolution"}.docx`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "no-store",
    },
  });
}
