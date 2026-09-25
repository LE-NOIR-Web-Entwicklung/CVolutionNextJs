import { NextRequest, NextResponse } from "next/server";
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { supabaseAdmin } from "../../../../../lib/supabase-server";
import { checkMotivationLetter } from "../../../../lib/motivation-letter-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DocxRequest = {
  letter?: string;
  jobTitle?: string;
  company?: string;
};

const FONT = "Arial";
const FONT_SIZE = 22; // 11pt
const LINE_SPACING = 240; // Einfacher Zeilenabstand

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  // Nur Leerzeichen/Tabs am Zeilenende entfernen. Leerzeilen (\n\n) muessen
  // erhalten bleiben, sie trennen die Absatz-Bloecke fuer die Word-Formatierung.
  return value.replace(/[ \t]+\n/g, "\n").trim().slice(0, maxLength);
}

function normalizeSwissMotivationLetter(value: string) {
  return value
    .replace(/ß/g, "ss")
    .replace(/ẞ/g, "SS")
    .replace(/[ \t]*[–—―][ \t]*/g, ", ")
    // Spaced hyphens nur innerhalb einer Zeile ersetzen, Bulletpoints ("- ") am Zeilenanfang bleiben erhalten
    .replace(/(\S)[ \t]+-[ \t]+/g, "$1, ")
    .replace(/,{2,}/g, ",")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/,\s*([.!?])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isSelfServiceIncluded(profile: any) {
  const now = Date.now();
  const periodEnd = profile?.subscription_current_period_end || profile?.paydate;
  const periodEndMs = periodEnd ? new Date(periodEnd).getTime() : 0;
  const isWithinPaidPeriod = Number.isFinite(periodEndMs) && periodEndMs > now;
  const hasSubscriptionStatus = ["active", "canceled"].includes(profile?.subscription_status);

  return Boolean(isWithinPaidPeriod && (profile?.paid || hasSubscriptionStatus));
}

function isSubjectLine(line: string) {
  return /^(betreff|subject|objet)\b/i.test(line) || /^(bewerbung|spontanbewerbung|initiativbewerbung)\s/i.test(line);
}

function isSalutationLine(line: string) {
  return /^(sehr geehrte|liebe[rs]?\s|guten tag|dear\s|madame|monsieur|mesdames)/i.test(line);
}

function isClosingLine(line: string) {
  return /^(freundliche gr(ü|ue)sse|mit freundlichen gr(ü|ue)ssen|beste gr(ü|ue)sse|kind regards|best regards|meilleures salutations|cordialement)/i.test(line);
}

function isBulletLine(line: string) {
  return /^[-–•*]\s+/.test(line);
}

function stripBullet(line: string) {
  return line.replace(/^[-–•*]\s+/, "").trim();
}

// Saubere Briefformatierung:
// - Adressbloecke mit engem Zeilenabstand
// - Betreff fett
// - Echte Word-Bulletpoints
// - Einfacher Zeilenabstand und sichtbare Blocktrennung
function createLetterParagraphs(letter: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const blocks = letter
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  blocks.forEach((block, blockIdx) => {
    // A blank paragraph keeps separate letter blocks readable without adding
    // Word paragraph spacing.
    if (blockIdx > 0) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 0, after: 0, line: LINE_SPACING },
        })
      );
    }

    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const allBullets = lines.length > 0 && lines.every(isBulletLine);

    // Bullet-Block: echte Word-Aufzaehlung
    if (allBullets) {
      lines.forEach((line) => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: stripBullet(line), font: FONT, size: FONT_SIZE })],
            bullet: { level: 0 },
            spacing: {
              before: 0,
              after: 0,
              line: LINE_SPACING,
            },
            alignment: AlignmentType.LEFT,
          })
        );
      });
      return;
    }

    // Betreffzeile: fett mit groesserem Abstand
    if (lines.length === 1 && isSubjectLine(lines[0])) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: lines[0], font: FONT, size: FONT_SIZE, bold: true })],
          spacing: { before: 0, after: 0, line: LINE_SPACING },
          alignment: AlignmentType.LEFT,
        })
      );
      return;
    }

    // Anrede
    if (lines.length === 1 && isSalutationLine(lines[0])) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: lines[0], font: FONT, size: FONT_SIZE })],
          spacing: { before: 0, after: 0, line: LINE_SPACING },
          alignment: AlignmentType.LEFT,
        })
      );
      return;
    }

    // Grussformel: Abstand vor der Unterschrift
    if (isClosingLine(lines[0])) {
      lines.forEach((line) => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line, font: FONT, size: FONT_SIZE })],
            spacing: {
              before: 0,
              after: 0,
              line: LINE_SPACING,
            },
            alignment: AlignmentType.LEFT,
          })
        );
      });
      return;
    }

    // Mehrzeilige Bloecke (Absender-/Empfaengerblock): enger Zeilenabstand
    if (lines.length > 1) {
      lines.forEach((line) => {
        const bulletLine = isBulletLine(line);
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: bulletLine ? stripBullet(line) : line,
                font: FONT,
                size: FONT_SIZE,
              }),
            ],
            ...(bulletLine ? { bullet: { level: 0 } } : {}),
            spacing: {
              before: 0,
              after: 0,
              line: LINE_SPACING,
            },
            alignment: AlignmentType.LEFT,
          })
        );
      });
      return;
    }

    // Normaler Textabsatz
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: lines[0], font: FONT, size: FONT_SIZE })],
        spacing: { before: 0, after: 0, line: LINE_SPACING },
        alignment: AlignmentType.LEFT,
      })
    );
  });

  return paragraphs;
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

  const letter = normalizeSwissMotivationLetter(cleanText(body.letter, Number.MAX_SAFE_INTEGER));
  const jobTitle = cleanText(body.jobTitle, 140);
  const company = cleanText(body.company, 140);

  if (!letter) {
    return jsonError("Kein Motivationsschreiben zum Exportieren vorhanden.", 400);
  }

  const letterCheck = checkMotivationLetter(letter);
  if (!letterCheck.valid) {
    return jsonError(letterCheck.reason || "Das Motivationsschreiben überschreitet die erlaubten Grenzen.", 422);
  }

  const docxDocument = new Document({
    creator: "CVolution",
    title: "Motivationsschreiben",
    description: `Motivationsschreiben fuer ${jobTitle || "Bewerbung"}${company ? ` bei ${company}` : ""}`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: FONT_SIZE },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
            },
            margin: {
              top: 1134,
              right: 1134,
              bottom: 1134,
              left: 1134,
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
