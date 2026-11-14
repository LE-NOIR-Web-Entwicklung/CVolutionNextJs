/**
 * Swiss employee payroll deductions, one entry per calendar year in `PAYROLL_CONFIG`.
 *
 * Yearly update (do it in autumn, when the Federal Council publishes the next year's amounts):
 * add a new entry to `PAYROLL_CONFIG`, nothing else. Pages and the calculator pick the year
 * from the current date (Europe/Zurich), so the new rates go live on 1 January by themselves.
 *
 * Sources:
 * - BSV, Masszahlen 2025/2026 and «Neue Beträge ab 1. Januar 2027» (BVG-Grenzbeträge, AHV-Mindestbeitrag):
 *   https://www.bsv.admin.ch/dam/de/sd-web/GZplHByBJoFc/Internet_Masszahlenarticles_25_26_d.pdf
 *   https://www.bsv.admin.ch/dam/de/sd-web/7b0mzel2zpRw/d_neue-Betraege-2027_bf.pdf
 * - BSV, Entwicklung Beitragssätze 2026 (AHV/IV/EO, ALV):
 *   https://www.bsv.admin.ch/dam/de/sd-web/p1k1Z4DTI902/Entwicklung_Beitragss%C3%A4tze_2026.pdf
 * - AHV-IV Merkblatt 2.01 (Lohnbeiträge): https://www.ahv-iv.ch/p/2.01.d
 * - BFS, LSE 2024 (Medianlohn CHF 7'024, Vollzeit, inkl. 1/12 des 13. Monatslohns), publiziert 25.11.2025.
 *
 * 13. AHV-Rente (Stand 14.11.2026): Parliament finances it through VAT only (8.1 % → 8.5 %, vote on
 * 29.11.2026, extra revenue from 2029) and rejected higher payroll contributions. Payroll rates for 2027
 * are therefore unchanged. If a later reform raises AHV payroll contributions, add it to that year's entry.
 */

export type BvgAgeCredit = { from: number; to: number; rate: number };

export type PayrollConfig = {
  year: number;
  /** AHV + IV + EO, employee share (half of the total rate), on the full salary. */
  ahvIvEo: number;
  /** Breakdown of the employee share, for display. */
  ahvIvEoParts: { ahv: number; iv: number; eo: number };
  /** ALV employee share, on income up to `alvCeiling`. No solidarity contribution since 2023. */
  alv: number;
  /** Maximum insured salary for ALV (same as UVG). */
  alvCeiling: number;
  bvg: {
    entryThreshold: number;
    coordinationDeduction: number;
    upperLimit: number;
    minCoordinated: number;
    /** Legal minimum age credits (Altersgutschriften) as share of the coordinated salary, total. Employee pays at least half. */
    ageCredits: readonly BvgAgeCredit[];
  };
};

const BVG_AGE_CREDITS: readonly BvgAgeCredit[] = [
  { from: 25, to: 34, rate: 0.07 },
  { from: 35, to: 44, rate: 0.1 },
  { from: 45, to: 54, rate: 0.15 },
  { from: 55, to: 65, rate: 0.18 },
];

export const PAYROLL_CONFIG: Readonly<Record<number, PayrollConfig>> = {
  2026: {
    year: 2026,
    ahvIvEo: 0.053,
    ahvIvEoParts: { ahv: 0.0435, iv: 0.007, eo: 0.0025 },
    alv: 0.011,
    alvCeiling: 148_200,
    bvg: {
      entryThreshold: 22_680,
      coordinationDeduction: 26_460,
      upperLimit: 90_720,
      minCoordinated: 3_780,
      ageCredits: BVG_AGE_CREDITS,
    },
  },
  2027: {
    // Contribution rates unchanged; BVG amounts follow the 1.59 % AHV pension increase (max. pension CHF 30'720).
    year: 2027,
    ahvIvEo: 0.053,
    ahvIvEoParts: { ahv: 0.0435, iv: 0.007, eo: 0.0025 },
    alv: 0.011,
    alvCeiling: 148_200,
    bvg: {
      entryThreshold: 23_040,
      coordinationDeduction: 26_880,
      upperLimit: 92_160,
      minCoordinated: 3_840,
      ageCredits: BVG_AGE_CREDITS,
    },
  },
};

/** All configured years, ascending. */
export const PAYROLL_YEARS = Object.keys(PAYROLL_CONFIG)
  .map(Number)
  .sort((a, b) => a - b);

/** Calendar year in Switzerland, so the switch happens at midnight Swiss time, not UTC. */
export function swissYear(date: Date = new Date()) {
  return Number(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric" }).format(date));
}

/**
 * Payroll year in force on `date`: the latest configured year that has started.
 * Falls back to the oldest year for dates before it; for years not yet configured,
 * the latest known year keeps being used (update `PAYROLL_CONFIG`!).
 */
export function payrollYearFor(date: Date = new Date()) {
  const year = swissYear(date);
  const started = PAYROLL_YEARS.filter((y) => y <= year);
  return started.length > 0 ? started[started.length - 1] : PAYROLL_YEARS[0];
}

/** Config for `year`, or for the year in force today. Unknown years resolve like `payrollYearFor`. */
export function payrollConfig(year?: number): PayrollConfig {
  if (year !== undefined && PAYROLL_CONFIG[year]) return PAYROLL_CONFIG[year];
  if (year !== undefined) return PAYROLL_CONFIG[payrollYearFor(new Date(Date.UTC(year, 6, 1)))];
  return PAYROLL_CONFIG[payrollYearFor()];
}

/** Years worth offering in the calculator around `year`: the previous, current and next configured year. */
export function selectablePayrollYears(year: number) {
  return PAYROLL_YEARS.filter((y) => y >= year - 1 && y <= year + 1);
}

export const MEDIAN_MONTHLY_2024 = 7_024;

export type PayrollInput = {
  /** Gross salary per payment (monthly) or per year, see `period`. */
  gross: number;
  period: "month" | "year";
  /** 12 or 13 monthly payments. */
  payments: 12 | 13;
  /** Workload in percent (10–100), used only for the median comparison. */
  workload: number;
  age: number;
  /** NBU and KTG together, employee share in percent. Varies by employer. */
  otherPercent: number;
  /** Payroll year; defaults to the year in force today. */
  year?: number;
};

export type PayrollLine = { label: string; note: string; annual: number };

export type PayrollResult = {
  year: number;
  annualGross: number;
  monthlyGross: number;
  lines: PayrollLine[];
  totalDeductions: number;
  annualNet: number;
  /** Net per payment (divided by `payments`). */
  netPerPayment: number;
  /** Full-time equivalent monthly gross incl. 1/12 of the 13th salary, comparable with the BFS median. */
  fullTimeMonthly: number;
  medianDeltaPercent: number;
};

/** Swiss percent format: 0.053 → "5.3 %". */
export function formatPercent(rate: number, digits = 1) {
  return `${(rate * 100).toFixed(digits).replace(/\.0+$/, "")} %`;
}

export function bvgEmployeeRate(age: number, config: PayrollConfig = payrollConfig()) {
  const band = config.bvg.ageCredits.find((b) => age >= b.from && age <= b.to);
  return band ? band.rate / 2 : 0;
}

export function coordinatedSalary(annualGross: number, config: PayrollConfig = payrollConfig()) {
  const { bvg } = config;
  if (annualGross < bvg.entryThreshold) return 0;
  const capped = Math.min(annualGross, bvg.upperLimit);
  return Math.max(capped - bvg.coordinationDeduction, bvg.minCoordinated);
}

const round = (value: number) => Math.round(value);

export function calculatePayroll(input: PayrollInput): PayrollResult {
  const config = payrollConfig(input.year);
  const gross = Math.max(0, input.gross || 0);
  const annualGross = input.period === "year" ? gross : gross * input.payments;
  const monthlyGross = annualGross / input.payments;

  const ahv = annualGross * config.ahvIvEo;
  const alv = Math.min(annualGross, config.alvCeiling) * config.alv;
  const coordinated = coordinatedSalary(annualGross, config);
  const bvgRate = bvgEmployeeRate(input.age, config);
  const bvg = coordinated * bvgRate;
  const other = annualGross * (Math.max(0, input.otherPercent) / 100);

  const lines: PayrollLine[] = [
    { label: "AHV / IV / EO", note: formatPercent(config.ahvIvEo), annual: round(ahv) },
    { label: "ALV", note: `${formatPercent(config.alv)} bis CHF ${config.alvCeiling.toLocaleString("de-CH")}`, annual: round(alv) },
    {
      label: "Pensionskasse (BVG)",
      note: bvgRate > 0 ? `${(bvgRate * 100).toFixed(1)} % des koordinierten Lohns (Minimum)` : "unter 25 oder unter Eintrittsschwelle: kein Sparbeitrag",
      annual: round(bvg),
    },
    { label: "NBU / KTG", note: `${input.otherPercent.toFixed(1)} % (je nach Arbeitgeber)`, annual: round(other) },
  ];

  const totalDeductions = lines.reduce((sum, line) => sum + line.annual, 0);
  const annualNet = annualGross - totalDeductions;
  const workload = Math.min(100, Math.max(10, input.workload || 100)) / 100;
  const fullTimeMonthly = annualGross / 12 / workload;

  return {
    year: config.year,
    annualGross: round(annualGross),
    monthlyGross: round(monthlyGross),
    lines,
    totalDeductions,
    annualNet: round(annualNet),
    netPerPayment: round(annualNet / input.payments),
    fullTimeMonthly: round(fullTimeMonthly),
    medianDeltaPercent: fullTimeMonthly > 0 ? ((fullTimeMonthly - MEDIAN_MONTHLY_2024) / MEDIAN_MONTHLY_2024) * 100 : 0,
  };
}

export function formatChf(value: number) {
  return `CHF ${Math.round(value).toLocaleString("de-CH")}`;
}
