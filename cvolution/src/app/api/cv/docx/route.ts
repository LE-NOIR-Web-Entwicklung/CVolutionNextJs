import { NextRequest, NextResponse } from "next/server";
import {
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { supabaseAdmin } from "../../../../../lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CV-Export als Word-Datei. Die drei Designs entsprechen 1:1 den PDF-Designs
// (CVPdfDocument / CVPdfDesign2 / CVPdfDesign3).

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

// ---------------------------------------------------------------------------
// Design-Themes: entsprechen exakt den Farben/Groessen der PDF-Designs
// (Masse: PDF-Punkte -> Word-Halbpunkte fuer Schrift, Twips (pt*20) fuer Layout)
// ---------------------------------------------------------------------------

type CvDesign = "design1" | "design2" | "design3";

type Theme = {
  name: string;
  headline: string;
  meta: string;
  section: string;
  sectionBorder: string;
  sectionBorderSize: number; // Achtel-Punkte
  photoBorder: string;
};

const THEMES: Record<CvDesign, Theme> = {
  // Design 1: blaue Seitenbalken + blaue Akzente (ACCENT #005B82)
  design1: {
    name: "005B82",
    headline: "555555",
    meta: "444444",
    section: "005B82",
    sectionBorder: "005B82",
    sectionBorderSize: 8,
    photoBorder: "D0D0D0",
  },
  // Design 2 (Zeitlos): neutrale Farben, graue Trennlinien
  design2: {
    name: "252525",
    headline: "666666",
    meta: "666666",
    section: "252525",
    sectionBorder: "CFCFCF",
    sectionBorderSize: 8,
    photoBorder: "CFCFCF",
  },
  // Design 3 (Klassisch): schwarz, kraeftige Linien
  design3: {
    name: "000000",
    headline: "333333",
    meta: "333333",
    section: "000000",
    sectionBorder: "000000",
    sectionBorderSize: 12,
    photoBorder: "000000",
  },
};

// Seitenraender je Design (PDF-Padding * 20)
const PAGE = {
  design1: { top: 560, bottom: 640, left: 1160, right: 1160, content: 11906 - 2 * 1160 },
  design2: { top: 600, bottom: 680, left: 1120, right: 1120, content: 11906 - 2 * 1120 },
  design3: { top: 600, bottom: 680, left: 1040, right: 1040, content: 11906 - 2 * 1040 },
};

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } as const;
const CELL_NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };
const TABLE_NO_BORDERS = {
  top: NO_BORDER,
  bottom: NO_BORDER,
  left: NO_BORDER,
  right: NO_BORDER,
  insideHorizontal: NO_BORDER,
  insideVertical: NO_BORDER,
};
const NO_CELL_MARGINS = { top: 0, bottom: 0, left: 0, right: 0 };

// Foto: 92x110pt im PDF -> Pixel bei 96dpi
const PHOTO_W_PX = 123;
const PHOTO_H_PX = 147;
const PHOTO_CELL_W = 92 * 20 + 80;

type Photo = { data: Buffer; type: "jpg" | "png" };

async function fetchProfilePhoto(url?: string | null): Promise<Photo | null> {
  if (!url || !/^https:\/\//i.test(url)) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8 || buf.length > 8 * 1024 * 1024) return null;
    if (buf[0] === 0xff && buf[1] === 0xd8) return { data: buf, type: "jpg" };
    if (buf[0] === 0x89 && buf[1] === 0x50) return { data: buf, type: "png" };
    return null;
  } catch {
    return null;
  }
}

function photoParagraph(photo: Photo, theme: Theme) {
  return new Paragraph({
    children: [
      new ImageRun({
        type: photo.type,
        data: photo.data,
        transformation: { width: PHOTO_W_PX, height: PHOTO_H_PX },
      }),
    ],
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: theme.photoBorder },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: theme.photoBorder },
      left: { style: BorderStyle.SINGLE, size: 4, color: theme.photoBorder },
      right: { style: BorderStyle.SINGLE, size: 4, color: theme.photoBorder },
    },
  });
}

function run(text: string, opts: { size?: number; bold?: boolean; color?: string } = {}) {
  return new TextRun({ text, font: FONT, size: opts.size ?? 19, bold: opts.bold, color: opts.color });
}

function sectionTitle(text: string, theme: Theme, opts: { first?: boolean; size?: number } = {}) {
  return new Paragraph({
    children: [run(text, { size: opts.size ?? 24, bold: true, color: theme.section })],
    spacing: { before: opts.first ? 0 : 240, after: 100 },
    keepNext: true,
    border: {
      bottom: { style: BorderStyle.SINGLE, size: theme.sectionBorderSize, color: theme.sectionBorder, space: 2 },
    },
  });
}

function bulletParagraph(text: string, opts: { last?: boolean } = {}) {
  return new Paragraph({
    children: [run(text)],
    bullet: { level: 0 },
    spacing: { after: opts.last ? 0 : 30 },
  });
}

// Borderless Layout-Tabelle mit fixen Spalten (ersetzt die Flex-Rows des PDFs)
function layoutTable(rows: TableRow[], columnWidths: number[], totalWidth: number) {
  return new Table({
    rows,
    columnWidths,
    width: { size: totalWidth, type: WidthType.DXA },
    borders: TABLE_NO_BORDERS,
    layout: TableLayoutType.FIXED,
  });
}

function layoutCell(children: (Paragraph | Table)[], width: number, opts: { vAlign?: "center" | "top" | "bottom" } = {}) {
  return new TableCell({
    children,
    width: { size: width, type: WidthType.DXA },
    borders: CELL_NO_BORDERS,
    margins: NO_CELL_MARGINS,
    verticalAlign: opts.vAlign,
  });
}

// Kontaktzeilen als Label/Wert-Tabelle (PDF: contactLabel width 80/90pt)
function contactTable(
  rows: Array<{ label: string; value: string; bold?: boolean; valueSize?: number }>,
  labelWidth: number,
  totalWidth: number,
  theme: Theme,
  labelColor?: string
) {
  return layoutTable(
    rows.map(
      (row, idx) =>
        new TableRow({
          children: [
            layoutCell(
              [
                new Paragraph({
                  children: [run(`${row.label}`, { color: labelColor })],
                  spacing: { after: idx === rows.length - 1 ? 0 : 40 },
                }),
              ],
              labelWidth
            ),
            layoutCell(
              [
                new Paragraph({
                  children: [run(row.value, { bold: row.bold, size: row.valueSize })],
                  spacing: { after: idx === rows.length - 1 ? 0 : 40 },
                }),
              ],
              totalWidth - labelWidth
            ),
          ],
        })
    ),
    [labelWidth, totalWidth - labelWidth],
    totalWidth
  );
}

// Berufserfahrung/Ausbildung fuer Design 1+2 (Titel fett, Meta grau, Bullets)
function experienceParagraphs(
  items: any[],
  theme: Theme,
  kind: "experience" | "education"
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  items.forEach((item: any, idx: number) => {
    const title =
      kind === "experience"
        ? item.job_title || ""
        : [item.degree, item.field_of_study].filter(Boolean).join(", ");
    const metaParts = [
      kind === "experience"
        ? [item.company, item.location].filter(Boolean).join(", ")
        : [item.institution, item.place].filter(Boolean).join(", "),
      `${formatDate(item.start_date)} - ${item.is_current ? "heute" : formatDate(item.end_date)}`,
    ].filter(Boolean);
    const bullets = extractBullets(item.description, kind === "experience" ? getMaxBullets(idx) : 3);

    paragraphs.push(
      new Paragraph({
        children: [run(title, { size: 21, bold: true })],
        spacing: { before: idx === 0 ? 0 : 160, after: 20 },
        keepNext: true,
        keepLines: true,
      })
    );
    if (metaParts.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [run(metaParts.join(" | "), { color: theme.meta })],
          spacing: { after: bullets.length > 0 ? 60 : 0 },
          keepNext: bullets.length > 0,
          keepLines: true,
        })
      );
    }
    bullets.forEach((bullet, bulletIdx) => {
      paragraphs.push(bulletParagraph(bullet, { last: bulletIdx === bullets.length - 1 }));
    });
  });

  return paragraphs;
}

// Design 3: tabellarische Darstellung mit Datumsspalte (PDF itemDate width 105pt)
function itemsTableDesign3(items: any[], theme: Theme, kind: "experience" | "education", totalWidth: number) {
  const dateWidth = 2100;

  const rows = items.map((item: any, idx: number) => {
    const title =
      kind === "experience"
        ? item.job_title || ""
        : [item.degree, item.field_of_study].filter(Boolean).join(", ");
    const meta =
      kind === "experience"
        ? [item.company, item.location].filter(Boolean).join(", ")
        : [item.institution, item.place].filter(Boolean).join(", ");
    const range = `${formatDate(item.start_date)} - ${item.is_current ? "heute" : formatDate(item.end_date)}`;
    const bullets = extractBullets(item.description, kind === "experience" ? getMaxBullets(idx) : 3);
    const isLast = idx === items.length - 1;
    // Abstand zwischen Eintraegen (PDF: marginBottom 8pt)
    const gapAfter = isLast ? 0 : 160;
    const hasBullets = bullets.length > 0;

    const body: Paragraph[] = [
      new Paragraph({
        children: [run(title, { size: 20, bold: true })],
        spacing: { after: meta || hasBullets ? 20 : gapAfter },
        keepNext: Boolean(meta) || hasBullets,
        keepLines: true,
      }),
    ];
    if (meta) {
      body.push(
        new Paragraph({
          children: [run(meta, { color: theme.meta })],
          spacing: { after: hasBullets ? 40 : gapAfter },
          keepNext: hasBullets,
          keepLines: true,
        })
      );
    }
    bullets.forEach((bullet, bulletIdx) => {
      body.push(
        new Paragraph({
          children: [run(bullet)],
          bullet: { level: 0 },
          spacing: { after: bulletIdx === bullets.length - 1 ? gapAfter : 30 },
        })
      );
    });

    return new TableRow({
      cantSplit: true,
      children: [
        layoutCell(
          [new Paragraph({ children: [run(range)], spacing: { after: gapAfter } })],
          dateWidth
        ),
        layoutCell(body, totalWidth - dateWidth),
      ],
    });
  });

  return layoutTable(rows, [dateWidth, totalWidth - dateWidth], totalWidth);
}

// Kenntnisse & Faehigkeiten: Label-Spalte (110/105pt) + Inhalt, wie im PDF
function knowledgeTable(
  theme: Theme,
  totalWidth: number,
  labelWidth: number,
  preparedLanguages: Array<{ name: string; level: string }>,
  abilities: any[],
  driverLicenses: any[]
) {
  const contentWidth = totalWidth - labelWidth;
  const rows: TableRow[] = [];

  if (preparedLanguages.length > 0) {
    const langNameWidth = 2000;
    rows.push(
      new TableRow({
        children: [
          layoutCell([new Paragraph({ children: [run("Sprachen", { bold: true })], spacing: { after: 80 } })], labelWidth),
          layoutCell(
            [
              layoutTable(
                preparedLanguages.map(
                  (lang, idx) =>
                    new TableRow({
                      children: [
                        layoutCell(
                          [new Paragraph({ children: [run(lang.name)], spacing: { after: idx === preparedLanguages.length - 1 ? 80 : 30 } })],
                          langNameWidth
                        ),
                        layoutCell(
                          [new Paragraph({ children: [run(lang.level)], spacing: { after: idx === preparedLanguages.length - 1 ? 80 : 30 } })],
                          contentWidth - langNameWidth
                        ),
                      ],
                    })
                ),
                [langNameWidth, contentWidth - langNameWidth],
                contentWidth
              ),
            ],
            contentWidth
          ),
        ],
      })
    );
  }

  if (abilities.length > 0) {
    rows.push(
      new TableRow({
        children: [
          layoutCell([new Paragraph({ children: [run("Fähigkeiten", { bold: true })], spacing: { after: 80 } })], labelWidth),
          layoutCell(
            abilities.map((skill: any, idx: number) =>
              bulletParagraph(skill.skill_name, { last: idx === abilities.length - 1 })
            ),
            contentWidth
          ),
        ],
      })
    );
  }

  if (driverLicenses.length > 0) {
    rows.push(
      new TableRow({
        children: [
          layoutCell([new Paragraph({ children: [run("Führerschein", { bold: true })] })], labelWidth),
          layoutCell(
            driverLicenses.map((license: any, idx: number) => {
              const displayName = String(license.skill_name)
                .replace(/Führerschein Kategorie /gi, "")
                .replace(/Führerschein/gi, "")
                .trim();
              return new Paragraph({
                children: [run(`Kategorie ${displayName || license.skill_name}`)],
                spacing: { after: idx === driverLicenses.length - 1 ? 0 : 30 },
              });
            }),
            contentWidth
          ),
        ],
      })
    );
  }

  return layoutTable(rows, [labelWidth, totalWidth - labelWidth], totalWidth);
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

  const body = (await request.json().catch(() => ({}))) as { design?: string };
  const design: CvDesign = body?.design === "design2" ? "design2" : body?.design === "design3" ? "design3" : "design1";
  const theme = THEMES[design];
  const page = PAGE[design];

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

  const preparedLanguages = languages.map((lang: any) => ({
    name: String(lang.language_name).split(" ")[0] || lang.language_name,
    level: mapLanguageLevel(lang.proficiency),
  }));

  // Kontaktdaten: leere Felder werden komplett weggelassen (wie im PDF)
  const contactRowsRaw: Array<[string, string | null | undefined]> = [
    ["Standort", profile.location],
    ["Telefon", profile.phone],
    ["E-Mail", user.email],
    ["Geburtsdatum", formatBirthDate(profile.birthdate)],
    ["Zivilstand", profile.civil_status],
    ["Heimatort", profile.place_of_origin],
  ];
  const contactRows = contactRowsRaw
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([label, value]) => ({ label, value: (value as string).trim() }));

  const photo = await fetchProfilePhoto(profile.profile_picture_url);
  const hasKnowledge = preparedLanguages.length > 0 || abilities.length > 0 || driverLicenses.length > 0;

  const children: (Paragraph | Table)[] = [];

  if (design === "design3") {
    // --- Design 3 (Klassisch): "Lebenslauf"-Titel, Kontakt+Foto, Datumsspalte ---
    children.push(
      new Paragraph({
        children: [run("Lebenslauf", { size: 30, bold: true })],
        spacing: { after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000", space: 4 } },
      })
    );

    const headerRows = [
      ...(profile.full_name ? [{ label: "Name", value: profile.full_name, bold: true, valueSize: 22 }] : []),
      ...contactRows,
    ];
    if (headerRows.length > 0 || photo) {
      const contactWidth = page.content - (photo ? PHOTO_CELL_W : 0);
      const headerCells = [
        layoutCell(
          headerRows.length > 0 ? [contactTable(headerRows, 1800, contactWidth - 320, theme)] : [new Paragraph({ children: [] })],
          contactWidth
        ),
      ];
      if (photo) {
        headerCells.push(layoutCell([photoParagraph(photo, theme)], PHOTO_CELL_W));
      }
      children.push(
        layoutTable(
          [new TableRow({ children: headerCells })],
          photo ? [contactWidth, PHOTO_CELL_W] : [page.content],
          page.content
        )
      );
    }

    if (experiences.length > 0) {
      children.push(sectionTitle("Berufliche Erfahrung", theme, { size: 23 }));
      children.push(itemsTableDesign3(experiences, theme, "experience", page.content));
    }
    if (education.length > 0) {
      children.push(sectionTitle("Aus- & Weiterbildungen", theme, { size: 23 }));
      children.push(itemsTableDesign3(education, theme, "education", page.content));
    }
    if (hasKnowledge) {
      children.push(sectionTitle("Kenntnisse & Fähigkeiten", theme, { size: 23 }));
      children.push(knowledgeTable(theme, page.content, 2100, preparedLanguages, abilities, driverLicenses));
    }
  } else {
    // --- Design 1 (Foto links) / Design 2 (Name links, Foto rechts) ---
    const namePara = new Paragraph({
      children: [run(profile.full_name || "", { size: 44, bold: true, color: theme.name })],
      spacing: { after: profile.headline ? 60 : 0 },
    });
    const headlinePara = profile.headline
      ? new Paragraph({
          children: [run(profile.headline, { size: 24, color: theme.headline })],
          spacing: { after: 0 },
        })
      : null;
    const nameBlock = [namePara, ...(headlinePara ? [headlinePara] : [])];

    if (photo) {
      const textWidth = page.content - PHOTO_CELL_W;
      // Design 1: Foto links, Name rechts (PDF headerText marginLeft 14pt -> Einzug)
      const nameBlockIndented =
        design === "design1"
          ? [
              new Paragraph({
                children: [run(profile.full_name || "", { size: 44, bold: true, color: theme.name })],
                spacing: { after: profile.headline ? 60 : 0 },
                indent: { left: 280 },
              }),
              ...(profile.headline
                ? [
                    new Paragraph({
                      children: [run(profile.headline, { size: 24, color: theme.headline })],
                      indent: { left: 280 },
                    }),
                  ]
                : []),
            ]
          : nameBlock;

      const cells =
        design === "design1"
          ? [
              layoutCell([photoParagraph(photo, theme)], PHOTO_CELL_W, { vAlign: "center" }),
              layoutCell(nameBlockIndented, textWidth, { vAlign: "center" }),
            ]
          : [
              layoutCell(nameBlockIndented, textWidth, { vAlign: "center" }),
              layoutCell([photoParagraph(photo, theme)], PHOTO_CELL_W, { vAlign: "center" }),
            ];
      children.push(
        layoutTable(
          [new TableRow({ children: cells })],
          design === "design1" ? [PHOTO_CELL_W, textWidth] : [textWidth, PHOTO_CELL_W],
          page.content
        )
      );
    } else {
      children.push(...nameBlock);
    }

    // Design 2: graue Trennlinie unter dem Header (PDF: borderBottom #cfcfcf)
    if (design === "design2") {
      children.push(
        new Paragraph({
          children: [],
          spacing: { before: 120, after: 160 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CFCFCF", space: 1 } },
        })
      );
    } else {
      children.push(new Paragraph({ children: [], spacing: { after: 120 } }));
    }

    if (contactRows.length > 0) {
      children.push(sectionTitle("Kontaktdaten", theme, { first: true }));
      children.push(
        contactTable(contactRows, 1600, page.content, theme, design === "design2" ? theme.meta : undefined)
      );
    }

    if (experiences.length > 0) {
      children.push(sectionTitle("Berufserfahrung", theme));
      children.push(...experienceParagraphs(experiences, theme, "experience"));
    }

    if (education.length > 0) {
      children.push(sectionTitle("Aus- & Weiterbildungen", theme));
      children.push(...experienceParagraphs(education, theme, "education"));
    }

    if (hasKnowledge) {
      children.push(sectionTitle("Kenntnisse & Fähigkeiten", theme));
      children.push(knowledgeTable(theme, page.content, 2200, preparedLanguages, abilities, driverLicenses));
    }
  }

  const docxDocument = new Document({
    creator: "CVolution",
    title: "Lebenslauf",
    description: `Lebenslauf ${profile.full_name || ""}`.trim(),
    styles: {
      default: {
        document: { run: { font: FONT, size: 19 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: page.top, right: page.right, bottom: page.bottom, left: page.left },
            // Design 1: blaue Seitenbalken links+rechts auf jeder Seite
            ...(design === "design1"
              ? {
                  borders: {
                    pageBorders: {
                      display: PageBorderDisplay.ALL_PAGES,
                      offsetFrom: PageBorderOffsetFrom.PAGE,
                      zOrder: PageBorderZOrder.FRONT,
                    },
                    pageBorderLeft: { style: BorderStyle.SINGLE, size: 96, color: "005B82", space: 0 },
                    pageBorderRight: { style: BorderStyle.SINGLE, size: 96, color: "005B82", space: 0 },
                  },
                }
              : {}),
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
