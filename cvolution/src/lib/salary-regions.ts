import { LSE_REGION_ROWS, type LseBranchRow, type LseRegionKey } from "@/data/bfs-lse-grossregionen";

/**
 * The BFS publishes wages per Grossregion (NUTS-2), not per canton. Each canton belongs to
 * exactly one Grossregion, so the canton page shows the figure of its region and says so.
 */
export type SalaryRegion = {
  key: Exclude<LseRegionKey, "schweiz">;
  name: string;
  cantons: { code: string; name: string }[];
  note: string;
};

export const SALARY_REGIONS: SalaryRegion[] = [
  {
    key: "zuerich",
    name: "Zürich",
    cantons: [{ code: "ZH", name: "Zürich" }],
    note: "Höchster Medianlohn der Schweiz, getragen von Finanz, Versicherungen, Informatik und Beratung. Auch Mieten und Lebenshaltungskosten gehören zu den höchsten.",
  },
  {
    key: "nordwestschweiz",
    name: "Nordwestschweiz",
    cantons: [
      { code: "BS", name: "Basel-Stadt" },
      { code: "BL", name: "Basel-Landschaft" },
      { code: "AG", name: "Aargau" },
    ],
    note: "Die Pharma- und Chemieindustrie rund um Basel zahlt die höchsten Industrielöhne des Landes. Im Aargau prägen Maschinenbau, Energie und Logistik das Bild.",
  },
  {
    key: "zentralschweiz",
    name: "Zentralschweiz",
    cantons: [
      { code: "LU", name: "Luzern" },
      { code: "UR", name: "Uri" },
      { code: "SZ", name: "Schwyz" },
      { code: "OW", name: "Obwalden" },
      { code: "NW", name: "Nidwalden" },
      { code: "ZG", name: "Zug" },
    ],
    note: "Zug mit vielen internationalen Firmen und Rohstoffhändlern hebt den Schnitt. Die Region ist aber vielfältig: In ländlichen Kantonen prägen Gewerbe und Tourismus den Arbeitsmarkt.",
  },
  {
    key: "genferseeregion",
    name: "Genferseeregion",
    cantons: [
      { code: "GE", name: "Genf" },
      { code: "VD", name: "Waadt" },
      { code: "VS", name: "Wallis" },
    ],
    note: "Genf mit internationalen Organisationen, Banken und Rohstoffhandel und das Wallis mit Tourismus und Bau liegen wirtschaftlich weit auseinander. Die BFS-Zahl ist der Median der ganzen Region.",
  },
  {
    key: "espaceMittelland",
    name: "Espace Mittelland",
    cantons: [
      { code: "BE", name: "Bern" },
      { code: "FR", name: "Freiburg" },
      { code: "SO", name: "Solothurn" },
      { code: "NE", name: "Neuenburg" },
      { code: "JU", name: "Jura" },
    ],
    note: "Viele Stellen in der Bundesverwaltung und bei bundesnahen Betrieben in Bern, dazu Uhren- und Präzisionsindustrie im Jurabogen.",
  },
  {
    key: "ostschweiz",
    name: "Ostschweiz",
    cantons: [
      { code: "SG", name: "St. Gallen" },
      { code: "TG", name: "Thurgau" },
      { code: "GR", name: "Graubünden" },
      { code: "SH", name: "Schaffhausen" },
      { code: "AR", name: "Appenzell Ausserrhoden" },
      { code: "AI", name: "Appenzell Innerrhoden" },
      { code: "GL", name: "Glarus" },
    ],
    note: "Industrie, Gewerbe und Tourismus prägen die Region. Die Löhne liegen unter dem Schweizer Median, dafür sind Mieten meist tiefer als in Zürich.",
  },
  {
    key: "tessin",
    name: "Tessin",
    cantons: [{ code: "TI", name: "Tessin" }],
    note: "Mit Abstand tiefster Medianlohn. Als ein Grund gilt die Konkurrenz durch Grenzgängerinnen und Grenzgänger aus Italien, die einen grossen Teil der Stellen besetzen.",
  },
];

export function regionRow(code: string): LseBranchRow | undefined {
  return LSE_REGION_ROWS.find((row) => row.code === code);
}

export const REGION_TOTAL = regionRow("total") as LseBranchRow;

/** Branches shown in the comparison table: large employers, one row per field. */
export const REGION_BRANCHES: { code: string; label: string }[] = [
  { code: "64-66", label: "Banken und Versicherungen" },
  { code: "21", label: "Pharma" },
  { code: "62-63", label: "Informatik" },
  { code: "84", label: "Öffentliche Verwaltung" },
  { code: "85", label: "Erziehung und Unterricht" },
  { code: "28", label: "Maschinenbau" },
  { code: "69-71", label: "Beratung, Recht, Ingenieurbüros" },
  { code: "86-88", label: "Gesundheits- und Sozialwesen" },
  { code: "41-43", label: "Baugewerbe" },
  { code: "49-53", label: "Verkehr und Lagerei" },
  { code: "47", label: "Detailhandel" },
  { code: "55-56", label: "Gastgewerbe" },
];

export function regionForCanton(code: string) {
  return SALARY_REGIONS.find((region) => region.cantons.some((canton) => canton.code === code));
}
