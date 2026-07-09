// Gemeinsame Helper fuer alle CV-PDF-Designs
// Umsetzung Review-Feedback:
// - Taetigkeiten immer als Bulletpoints
// - Aktuellste Stelle mehr Details, aeltere Stellen weniger
// - Leere Felder komplett weglassen (z. B. Fuehrerschein)
// - Kompakte Darstellung, damit der CV wenn moeglich auf eine Seite passt

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}.${year}`;
}

export function formatBirthDate(dateString?: string | null): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatPeriod(startDate?: string | null, endDate?: string | null, isCurrent?: boolean): string {
  const start = formatDate(startDate);
  const end = isCurrent ? "heute" : formatDate(endDate);
  if (!start && !end) return "";
  return [start, end].filter(Boolean).join(" - ");
}

export function sortByCurrentThenEndDate(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    const aDate = a.end_date ? new Date(a.end_date).getTime() : 0;
    const bDate = b.end_date ? new Date(b.end_date).getTime() : 0;
    return bDate - aDate;
  });
}

// Aktuellste Stelle: mehr Details, aeltere Stellen: weniger Details
export function getMaxBullets(index: number): number {
  if (index === 0) return 6;
  if (index <= 2) return 4;
  return 2;
}

// Wandelt eine Beschreibung immer in Bulletpoints um.
// - Zeilen mit Aufzaehlungszeichen werden bereinigt
// - Ein langer Fliesstext wird in Saetze aufgeteilt
export function extractBullets(description?: string | null, maxBullets = 6): string[] {
  if (!description) return [];

  let bullets: string[] = [];
  const rawLines = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of rawLines) {
    // Zeilen mit mehreren Inline-Bullets zusaetzlich aufteilen
    const parts = line.split(/\s*[•▪◦]\s+/).filter(Boolean);
    for (const part of parts) {
      const clean = part.replace(/^[-–—*•▪◦\s]+/, "").trim();
      if (clean) bullets.push(clean);
    }
  }

  // Ein einzelner langer Absatz wird in Saetze als Bulletpoints aufgeteilt
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

// "B1 – Fortgeschrittene Sprachverwendung" -> "B1", Legacy-Werte werden korrekt gemappt
export function mapLanguageLevel(proficiency?: string | null): string {
  if (!proficiency) return "";
  const key = proficiency.toLowerCase().trim();
  if (LEGACY_LANGUAGE_LEVELS[key]) return LEGACY_LANGUAGE_LEVELS[key];
  const firstToken = proficiency.split(" ")[0] || proficiency;
  // CEFR-Level (a1-c2) immer gross schreiben
  if (/^[abc][12]$/i.test(firstToken)) return firstToken.toUpperCase();
  return firstToken;
}

export type ContactRow = { label: string; value: string };

// Nur Zeilen mit vorhandenen Werten, leere Felder werden komplett weggelassen
export function buildContactRows(user: any, profile: any): ContactRow[] {
  const rows: Array<[string, string | null | undefined]> = [
    ["Standort", profile?.location],
    ["Telefon", profile?.phone],
    ["E-Mail", user?.email],
    ["Geburtsdatum", formatBirthDate(profile?.birthdate)],
    ["Zivilstand", profile?.civil_status],
    ["Heimatort", profile?.place_of_origin],
  ];

  return rows
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([label, value]) => ({ label, value: (value as string).trim() }));
}

export type SplitSkills = {
  abilities: any[];
  driverLicenses: any[];
};

export function splitSkills(skills: any[]): SplitSkills {
  const list = Array.isArray(skills) ? skills.filter((s) => s?.skill_name) : [];
  return {
    abilities: list.filter((s) => !s.category || s.category.toLowerCase() !== "führerschein"),
    driverLicenses: list.filter((s) => s.category && s.category.toLowerCase() === "führerschein"),
  };
}

export function formatDriverLicense(skill: any): string {
  const displayName = String(skill.skill_name || "")
    .replace(/Führerschein Kategorie /gi, "")
    .replace(/Führerschein/gi, "")
    .trim();
  return `Kategorie ${displayName || skill.skill_name}`;
}

export type PreparedLanguage = { id: string | number; name: string; level: string };

export function prepareLanguages(languages: any[]): PreparedLanguage[] {
  if (!Array.isArray(languages)) return [];
  return languages
    .filter((lang) => lang?.language_name)
    .map((lang, idx) => ({
      id: lang.id ?? idx,
      name: String(lang.language_name).split(" ")[0] || lang.language_name,
      level: mapLanguageLevel(lang.proficiency),
    }));
}
