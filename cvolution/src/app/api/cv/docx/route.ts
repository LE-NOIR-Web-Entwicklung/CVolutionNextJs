import { NextRequest, NextResponse } from "next/server";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { supabaseAdmin } from "../../../../../lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CV-Export als Word-Datei (Review-Feedback: "Export soll auch im Word möglich sein.")

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isSelfServiceIncluded(profile: any) {
  const now = Date.now();
  const periodEnd = profile?.subscription_current_period_end || profile?.paydate;
  const periodEndMs = periodEnd ? new Date(periodEnd).getTime() : 0;
  const isWithinPaidPeriod = Number.isFinite(periodEndMs) && periodEndMs > now;
  const hasSubscriptionStatus = ["active", "canceled"].includes(profile?.subscription_status);

  return Boolean(isWithinPaidPeriod && (profile?.paid || hasSubscriptionStatus));
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${month}.${d.getFullYear()}`;
}

function formatBirthDate(dateString?: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${d.getFullYear()}`;
}

function sortByCurrentThenEndDate(items: any[]) {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    const aDate = a.end_date ? new Date(a.end_date).getTime() : 0;
    const bDate = b.end_date ? new Date(b.end_date).getTime() : 0;
    return bDate - aDate;
  });
}

// Aktuellste Stelle mehr Details, aeltere Stellen weniger
function getMaxBullets(index: number) {
  if (index === 0) return 6;
  if (index <= 2) return 4;
  return 2;
}

// Taetigkeiten immer als Bulletpoints aufbereiten
function extractBullets(description?: string | null, maxBullets = 6): string[] {
  if (!description) return [];

  let bullets: string[] = [];
  const rawLines = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of rawLines) {
    const parts = line.split(/\s*[•▪◦]\s+/).filter(Boolean);
    for (const part of parts) {
      const clean = part.replace(/^[-–—*•▪◦\s]+/, "").trim();
      if (clean) bullets.push(clean);
    }
  }

  if (bullets.length === 1 && bullets[0].length > 160) {
    bullets = bullets[0]
      .split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ])/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
  }

  return bullets.slice(0, Math.max(1, maxBullets));
}

const LEGACY_LANGUAGE_LEVELS: Record<string, string> = {
  beginner: "A2",
  intermediate: "B1",
  advanced: "B2",
  expert: "C1",
  native: "Muttersprache",
  muttersprache: "Muttersprache",
};

function mapLanguageLevel(proficiency?: string | null) {
  if (!proficiency) return "";
  const key = proficiency.toLowerCase().trim();
  if (LEGACY_LANGUAGE_LEVELS[key]) return LEGACY_LANGUAGE_LEVELS[key];
  const firstToken = proficiency.split(" ")[0] || proficiency;
  // CEFR-Level (a1-c2) immer gross schreiben
  if (/^[abc][12]$/i.test(firstToken)) return firstToken.toUpperCase();
  return firstToken;
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

const FONT = "Arial";

function sectionHeading(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 24, bold: true, color: "204878" })],
    spacing: { before: 280, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "204878", space: 2 },
    },
  });
}

function labelValueParagraph(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, font: FONT, size: 21, bold: true }),
      new TextRun({ text: value, font: FONT, size: 21 }),
    ],
    spacing: { after: 40 },
  });
}

function bulletParagraph(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 21 })],
    bullet: { level: 0 },
    spacing: { after: 40 },
  });
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

  const [profileResult, experiencesResult, educationResult, skillsResult, languagesResult] = await Promise.all([
    supabaseAdmin.from("profiles").select("*").eq("user_id", user.id).single(),
    supabaseAdmin.from("experiences").select("*").eq("user_id", user.id),
    supabaseAdmin.from("education").select("*").eq("user_id", user.id),
    supabaseAdmin.from("skills").select("*").eq("user_id", user.id).order("skill_name", { ascending: true }),
    supabaseAdmin.from("languages").select("*").eq("user_id", user.id).order("language_name", { ascending: true }),
  ]);

  const profile = profileResult.data;
  if (profileResult.error || !profile || !isSelfServiceIncluded(profile)) {
    return jsonError("Dieses Feature ist im aktiven Self-Service-Abo enthalten.", 402);
  }

  const experiences = sortByCurrentThenEndDate(experiencesResult.data || []);
  const education = sortByCurrentThenEndDate(educationResult.data || []);
  const skills = (skillsResult.data || []).filter((s: any) => s?.skill_name);
  const languages = (languagesResult.data || []).filter((l: any) => l?.language_name);

  const abilities = skills.filter((s: any) => !s.category || s.category.toLowerCase() !== "führerschein");
  const driverLicenses = skills.filter((s: any) => s.category && s.category.toLowerCase() === "führerschein");

  const children: Paragraph[] = [];

  // Name + Headline
  if (profile.full_name) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: profile.full_name, font: FONT, size: 40, bold: true, color: "204878" })],
        spacing: { after: 60 },
      })
    );
  }
  if (profile.headline) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: profile.headline, font: FONT, size: 24, color: "555555" })],
        spacing: { after: 160 },
      })
    );
  }

  // Kontaktdaten: leere Felder werden komplett weggelassen
  const contactRows: Array<[string, string | null | undefined]> = [
    ["Standort", profile.location],
    ["Telefon", profile.phone],
    ["E-Mail", user.email],
    ["Geburtsdatum", formatBirthDate(profile.birthdate)],
    ["Zivilstand", profile.civil_status],
    ["Heimatort", profile.place_of_origin],
  ];
  const presentContactRows = contactRows.filter(([, value]) => typeof value === "string" && value.trim());

  if (presentContactRows.length > 0) {
    children.push(sectionHeading("Kontaktdaten"));
    for (const [label, value] of presentContactRows) {
      children.push(labelValueParagraph(label, (value as string).trim()));
    }
  }

  // Berufserfahrung
  if (experiences.length > 0) {
    children.push(sectionHeading("Berufserfahrung"));
    experiences.forEach((exp: any, idx: number) => {
      const meta = [
        [exp.company, exp.location].filter(Boolean).join(", "),
        `${formatDate(exp.start_date)} - ${exp.is_current ? "heute" : formatDate(exp.end_date)}`,
      ]
        .filter(Boolean)
        .join(" | ");

      children.push(
        new Paragraph({
          children: [new TextRun({ text: exp.job_title || "", font: FONT, size: 22, bold: true })],
          spacing: { before: idx === 0 ? 0 : 160, after: 20 },
          keepNext: true,
        })
      );
      if (meta) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: meta, font: FONT, size: 21, color: "555555" })],
            spacing: { after: 60 },
            keepNext: true,
          })
        );
      }
      for (const bullet of extractBullets(exp.description, getMaxBullets(idx))) {
        children.push(bulletParagraph(bullet));
      }
    });
  }

  // Aus- & Weiterbildungen
  if (education.length > 0) {
    children.push(sectionHeading("Aus- & Weiterbildungen"));
    education.forEach((edu: any, idx: number) => {
      const title = [edu.degree, edu.field_of_study].filter(Boolean).join(", ");
      const meta = [
        [edu.institution, edu.place].filter(Boolean).join(", "),
        `${formatDate(edu.start_date)} - ${edu.is_current ? "heute" : formatDate(edu.end_date)}`,
      ]
        .filter(Boolean)
        .join(" | ");

      children.push(
        new Paragraph({
          children: [new TextRun({ text: title, font: FONT, size: 22, bold: true })],
          spacing: { before: idx === 0 ? 0 : 160, after: 20 },
          keepNext: true,
        })
      );
      if (meta) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: meta, font: FONT, size: 21, color: "555555" })],
            spacing: { after: 60 },
            keepNext: true,
          })
        );
      }
      for (const bullet of extractBullets(edu.description, 3)) {
        children.push(bulletParagraph(bullet));
      }
    });
  }

  // Kenntnisse & Faehigkeiten: nur vorhandene Bereiche
  if (languages.length > 0 || abilities.length > 0 || driverLicenses.length > 0) {
    children.push(sectionHeading("Kenntnisse & Fähigkeiten"));

    if (languages.length > 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "Sprachen", font: FONT, size: 21, bold: true })],
          spacing: { after: 40 },
          keepNext: true,
        })
      );
      for (const lang of languages) {
        const name = String(lang.language_name).split(" ")[0] || lang.language_name;
        const level = mapLanguageLevel(lang.proficiency);
        children.push(bulletParagraph(level ? `${name}: ${level}` : name));
      }
    }

    if (abilities.length > 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "Fähigkeiten", font: FONT, size: 21, bold: true })],
          spacing: { before: 120, after: 40 },
          keepNext: true,
        })
      );
      for (const skill of abilities) {
        children.push(bulletParagraph(skill.skill_name));
      }
    }

    if (driverLicenses.length > 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "Führerschein", font: FONT, size: 21, bold: true })],
          spacing: { before: 120, after: 40 },
          keepNext: true,
        })
      );
      for (const license of driverLicenses) {
        const displayName = String(license.skill_name)
          .replace(/Führerschein Kategorie /gi, "")
          .replace(/Führerschein/gi, "")
          .trim();
        children.push(bulletParagraph(`Kategorie ${displayName || license.skill_name}`));
      }
    }
  }

  const docxDocument = new Document({
    creator: "CVolution",
    title: "Lebenslauf",
    description: `Lebenslauf ${profile.full_name || ""}`.trim(),
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(docxDocument);
  const fileName = `lebenslauf-${slugify(profile.full_name || "cvolution") || "cvolution"}.docx`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "no-store",
    },
  });
}
