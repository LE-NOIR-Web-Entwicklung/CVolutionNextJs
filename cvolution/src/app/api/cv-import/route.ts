import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { supabaseAdmin } from "../../../../lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClaudeResponse = {
  content?: Array<{ type: string; text?: string }>;
  error?: {
    message?: string;
  };
};

type ParsedCv = {
  profile?: {
    full_name?: string | null;
    headline?: string | null;
    summary?: string | null;
    location?: string | null;
    phone?: string | null;
    linkedin_url?: string | null;
    website?: string | null;
    birthdate?: string | null;
    civil_status?: string | null;
    place_of_origin?: string | null;
  };
  experiences?: Array<{
    job_title?: string | null;
    company?: string | null;
    employment_type?: string | null;
    location?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current?: boolean | null;
    description?: string | null;
    skills_used?: string[] | null;
  }>;
  education?: Array<{
    institution?: string | null;
    degree?: string | null;
    place?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current?: boolean | null;
  }>;
  skills?: Array<{
    skill_name?: string | null;
    proficiency?: string | null;
    years_of_experience?: number | null;
    category?: string | null;
  }>;
  driver_licenses?: Array<string | null> | null;
  languages?: Array<{
    language_name?: string | null;
    proficiency?: string | null;
  }>;
};

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const MAX_DOCX_TEXT_LENGTH = 50000;
const allowedEmploymentTypes = new Set(["full_time", "part_time", "contract", "internship", "freelance", "volunteer"]);
const allowedSkillLevels = new Set(["beginner", "intermediate", "advanced", "expert"]);
const allowedLanguageLevels = new Set(["a1", "a2", "b1", "b2", "c1", "c2", "native"]);
const driverLicenseCategories = [
  "C1E",
  "D1E",
  "BPT",
  "CZV",
  "A1",
  "B1",
  "C1",
  "D1",
  "BE",
  "CE",
  "DE",
  "A-",
  "A",
  "B",
  "C",
  "D",
  "M",
  "F",
  "G",
];
const driverLicenseCategorySet = new Set(driverLicenseCategories);

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\s+\n/g, "\n").trim().slice(0, maxLength);
  return cleaned || null;
}

function cleanDate(value: unknown) {
  const cleaned = cleanString(value, 10);
  if (!cleaned) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;
  if (/^\d{4}-\d{2}$/.test(cleaned)) return `${cleaned}-01`;
  return null;
}

function foldText(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—−]/g, "-")
    .toUpperCase();
}

function extractDriverLicenseCategories(...values: unknown[]) {
  const found = new Set<string>();

  values.forEach((value) => {
    const folded = foldText(value).replace(/(^|[^A-Z0-9])A\s*-(?=$|[^A-Z0-9])/g, "$1A-");
    const tokens = folded.match(/[A-Z0-9]+-?/g) || [];

    tokens.forEach((token) => {
      const cleaned = token.replace(/[^A-Z0-9-]/g, "");
      if (driverLicenseCategorySet.has(cleaned)) {
        found.add(cleaned);
      }
    });
  });

  return driverLicenseCategories.filter((category) => found.has(category));
}

function hasDriverLicenseHint(...values: unknown[]) {
  const folded = values.map(foldText).join(" ");
  return /FUHRERSCHEIN|FUEHRERSCHEIN|FAHRERAUSWEIS|FAHRERLAUBNIS|LENKBERECHTIGUNG|DRIVING\s*LICEN[CS]E|DRIVER'?S?\s*LICEN[CS]E|PERMIS|KATEGORIE|CATEGORY|CAT\./.test(
    folded
  );
}

function isSelfServiceIncluded(profile: any) {
  const now = Date.now();
  const periodEnd = profile?.subscription_current_period_end || profile?.paydate;
  const periodEndMs = periodEnd ? new Date(periodEnd).getTime() : 0;
  const isWithinPaidPeriod = Number.isFinite(periodEndMs) && periodEndMs > now;
  const hasSubscriptionStatus = ["active", "canceled"].includes(profile?.subscription_status);

  return Boolean(isWithinPaidPeriod && (profile?.paid || hasSubscriptionStatus));
}

function getFileKind(file: File) {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return "docx";
  }
  return null;
}

function getJsonText(responseText: string) {
  const trimmed = responseText.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

function normalizeParsedCv(parsed: ParsedCv) {
  const profile = parsed.profile || {};
  const experiences = (parsed.experiences || [])
    .slice(0, 12)
    .map((item) => {
      const jobTitle = cleanString(item.job_title, 160);
      const company = cleanString(item.company, 160);
      const startDate = cleanDate(item.start_date);
      if (!jobTitle || !company || !startDate) return null;

      const employmentType = cleanString(item.employment_type, 32) || "full_time";
      return {
        job_title: jobTitle,
        company,
        employment_type: allowedEmploymentTypes.has(employmentType) ? employmentType : "full_time",
        location: cleanString(item.location, 160),
        start_date: startDate,
        end_date: item.is_current ? null : cleanDate(item.end_date),
        is_current: Boolean(item.is_current),
        description: cleanString(item.description, 4000),
        skills_used: Array.isArray(item.skills_used)
          ? item.skills_used.map((skill) => cleanString(skill, 80)).filter(Boolean).slice(0, 20)
          : null,
      };
    })
    .filter(Boolean);

  const education = (parsed.education || [])
    .slice(0, 8)
    .map((item) => {
      const institution = cleanString(item.institution, 180);
      const degree = cleanString(item.degree, 180);
      if (!institution || !degree) return null;
      return {
        institution,
        degree,
        place: cleanString(item.place, 160),
        start_date: cleanDate(item.start_date),
        end_date: item.is_current ? null : cleanDate(item.end_date),
        is_current: Boolean(item.is_current),
      };
    })
    .filter(Boolean);

  const driverLicenses = new Set<string>();
  (parsed.driver_licenses || []).forEach((item) => {
    extractDriverLicenseCategories(item).forEach((category) => driverLicenses.add(category));
  });

  const skills = (parsed.skills || [])
    .slice(0, 60)
    .map((item) => {
      const skillName = cleanString(item.skill_name, 120);
      if (!skillName) return null;
      const proficiency = cleanString(item.proficiency, 32) || "intermediate";
      const category = cleanString(item.category, 80) || "Fähigkeiten";
      const licenseCategories = extractDriverLicenseCategories(skillName, category);

      if (licenseCategories.length && hasDriverLicenseHint(skillName, category)) {
        licenseCategories.forEach((licenseCategory) => driverLicenses.add(licenseCategory));
        return null;
      }

      return {
        skill_name: skillName,
        proficiency: allowedSkillLevels.has(proficiency) ? proficiency : "intermediate",
        years_of_experience: typeof item.years_of_experience === "number" ? Math.max(0, Math.min(50, item.years_of_experience)) : null,
        category,
      };
    })
    .filter(Boolean)
    .concat(
      driverLicenseCategories
        .filter((category) => driverLicenses.has(category))
        .map((category) => ({
          skill_name: `Führerschein Kategorie ${category}`,
          proficiency: "expert",
          years_of_experience: null,
          category: "Führerschein",
        }))
    );

  const languages = (parsed.languages || [])
    .slice(0, 12)
    .map((item) => {
      const languageName = cleanString(item.language_name, 80);
      if (!languageName) return null;
      const proficiency = cleanString(item.proficiency, 16) || "b2";
      return {
        language_name: languageName,
        proficiency: allowedLanguageLevels.has(proficiency) ? proficiency : "b2",
      };
    })
    .filter(Boolean);

  return {
    profile: {
      full_name: cleanString(profile.full_name, 180),
      headline: cleanString(profile.headline, 180),
      summary: cleanString(profile.summary, 2000),
      location: cleanString(profile.location, 180),
      phone: cleanString(profile.phone, 80),
      linkedin_url: cleanString(profile.linkedin_url, 300),
      website: cleanString(profile.website, 300),
      birthdate: cleanDate(profile.birthdate),
      civil_status: cleanString(profile.civil_status, 80),
      place_of_origin: cleanString(profile.place_of_origin, 120),
    },
    experiences,
    education,
    skills,
    languages,
  };
}

function buildJsonInstruction() {
  return `
Lies die Datei aus. Sie kann ein klassischer Lebenslauf/CV, ein Resume oder ein exportiertes LinkedIn-Profil-PDF sein. Mappe die enthaltenen beruflichen Daten auf diese JSON-Struktur. Antworte ausschliesslich mit validem JSON, ohne Markdown:
{
  "profile": {
    "full_name": string|null,
    "headline": string|null,
    "summary": string|null,
    "location": string|null,
    "phone": string|null,
    "linkedin_url": string|null,
    "website": string|null,
    "birthdate": "YYYY-MM-DD"|null,
    "civil_status": string|null,
    "place_of_origin": string|null
  },
  "experiences": [{
    "job_title": string,
    "company": string,
    "employment_type": "full_time"|"part_time"|"contract"|"internship"|"freelance"|"volunteer",
    "location": string|null,
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"|null,
    "is_current": boolean,
    "description": string|null,
    "skills_used": string[]|null
  }],
  "education": [{
    "institution": string,
    "degree": string,
    "place": string|null,
    "start_date": "YYYY-MM-DD"|null,
    "end_date": "YYYY-MM-DD"|null,
    "is_current": boolean
  }],
  "skills": [{
    "skill_name": string,
    "proficiency": "beginner"|"intermediate"|"advanced"|"expert",
    "years_of_experience": number|null,
    "category": string|null
  }],
  "driver_licenses": string[],
  "languages": [{
    "language_name": string,
    "proficiency": "a1"|"a2"|"b1"|"b2"|"c1"|"c2"|"native"
  }]
}

Regeln:
- Unterstützte Quellen: klassischer CV/Lebenslauf/Resume als PDF oder DOCX sowie LinkedIn-Profil-PDF.
- Bei LinkedIn-Profilen: "About"/"Info" als Profilzusammenfassung verwenden; "Headline" als headline; "Experience"/"Berufserfahrung" als experiences; "Education"/"Ausbildung" sowie "Licenses & certifications"/"Bescheinigungen und Zertifikate" als education/Weiterbildung; "Skills"/"Kenntnisse" als skills; "Languages"/"Sprachen" als languages.
- Bei LinkedIn-Datumsangaben wie "Present", "Heute", "Aktuell" oder "Current" setze "is_current": true und "end_date": null.
- LinkedIn-Kontaktdaten wie URL, Website oder Ort übernehmen, wenn sie sichtbar sind. Nicht sichtbare private Daten nicht erfinden.
- Wenn nur Monat/Jahr vorhanden ist, verwende den ersten Tag des Monats.
- Wenn ein Eintrag bis heute/aktuell läuft, setze "is_current": true und "end_date": null.
- Erfinde keine Daten. Fehlendes als null oder leere Arrays.
- Schreibe Beschreibungen knapp, professionell und als CV-taugliche Zusammenfassung.
- Führerschein/Fahrerausweis/Permis de conduire nicht als normale Fähigkeit ausgeben. Verwende dafür "driver_licenses" mit reinen Kategorien wie "A-", "B", "BE" oder "C1E".
`.trim();
}

async function callClaudeForCv(fileKind: "pdf" | "docx", buffer: Buffer, extractedText?: string) {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    throw new Error("AI-Service ist noch nicht konfiguriert.");
  }

  const instruction = buildJsonInstruction();
  const content =
    fileKind === "pdf"
      ? [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: buffer.toString("base64"),
            },
          },
          {
            type: "text",
            text: instruction,
          },
        ]
      : [
          {
            type: "text",
            text: `${instruction}\n\nDOCX-Text:\n"""\n${(extractedText || "").slice(0, MAX_DOCX_TEXT_LENGTH)}\n"""`,
          },
        ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": anthropicApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 6000,
      temperature: 0.1,
      system:
        "Du bist ein präziser Schweizer CV-Datenextraktor. Du gibst ausschliesslich valides JSON zurück und mapst Lebenslaufdaten konservativ auf das angeforderte Schema.",
      messages: [{ role: "user", content }],
    }),
  });

  const claudeData = (await response.json().catch(() => null)) as ClaudeResponse | null;
  if (!response.ok) {
    console.error("CV import Claude request failed", {
      status: response.status,
      error: claudeData?.error?.message,
    });
    throw new Error("Die Datei konnte nicht ausgelesen werden.");
  }

  const text = claudeData?.content
    ?.map((block) => (block.type === "text" ? block.text || "" : ""))
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Der AI-Service hat keine strukturierten Daten zurückgegeben.");
  }

  try {
    return JSON.parse(getJsonText(text)) as ParsedCv;
  } catch {
    throw new Error("Die ausgelesenen CV-Daten konnten nicht strukturiert werden.");
  }
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

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return jsonError("Bitte laden Sie einen CV als PDF/DOCX oder ein LinkedIn-Profil als PDF hoch.", 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    return jsonError("Die Datei ist zu gross. Bitte maximal 12 MB hochladen.", 400);
  }

  const fileKind = getFileKind(file);
  if (!fileKind) {
    return jsonError("Bitte laden Sie einen CV als PDF/DOCX oder ein LinkedIn-Profil als PDF hoch.", 400);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    if (fileKind === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value.trim();
      if (!extractedText) {
        return jsonError("Aus der DOCX-Datei konnte kein Text gelesen werden.", 400);
      }
    }

    const parsed = await callClaudeForCv(fileKind, buffer, extractedText);
    const normalized = normalizeParsedCv(parsed);

    const profileFields = Object.fromEntries(
      Object.entries(normalized.profile).filter(([, value]) => value !== null)
    );

    await supabaseAdmin.from("profiles").upsert(
      {
        user_id: user.id,
        ...profileFields,
      },
      { onConflict: "user_id" }
    );

    await supabaseAdmin.from("experiences").delete().eq("user_id", user.id);
    if (normalized.experiences.length) {
      const { error } = await supabaseAdmin.from("experiences").insert(
        normalized.experiences.map((item) => ({
          user_id: user.id,
          ...item,
        }))
      );
      if (error) throw error;
    }

    await supabaseAdmin.from("education").delete().eq("user_id", user.id);
    if (normalized.education.length) {
      const { error } = await supabaseAdmin.from("education").insert(
        normalized.education.map((item) => ({
          user_id: user.id,
          ...item,
        }))
      );
      if (error) throw error;
    }

    await supabaseAdmin.from("skills").delete().eq("user_id", user.id);
    if (normalized.skills.length) {
      const { error } = await supabaseAdmin.from("skills").insert(
        normalized.skills.map((item) => ({
          user_id: user.id,
          ...item,
        }))
      );
      if (error) throw error;
    }

    await supabaseAdmin.from("languages").delete().eq("user_id", user.id);
    if (normalized.languages.length) {
      const { error } = await supabaseAdmin.from("languages").insert(
        normalized.languages.map((item) => ({
          user_id: user.id,
          ...item,
        }))
      );
      if (error) throw error;
    }

    return NextResponse.json({
      imported: true,
      counts: {
        experiences: normalized.experiences.length,
        education: normalized.education.length,
        skills: normalized.skills.length,
        languages: normalized.languages.length,
      },
    });
  } catch (error) {
    console.error("CV import failed", error);
    return jsonError(error instanceof Error ? error.message : "Die Datei konnte nicht importiert werden.", 500);
  }
}
