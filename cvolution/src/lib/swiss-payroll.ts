/**
 * Swiss employee payroll deductions, Stand 1. Januar 2026.
 * Update every January. Sources:
 * - BSV, Masszahlen 2025/2026 (Eintrittsschwelle, Koordinationsabzug, oberer Grenzbetrag):
 *   https://www.bsv.admin.ch/dam/de/sd-web/GZplHByBJoFc/Internet_Masszahlenarticles_25_26_d.pdf
 * - BSV, Entwicklung Beitragssätze 2026 (AHV/IV/EO, ALV):
 *   https://www.bsv.admin.ch/dam/de/sd-web/p1k1Z4DTI902/Entwicklung_Beitragss%C3%A4tze_2026.pdf
 * - BFS, LSE 2024 (Medianlohn CHF 7'024, Vollzeit, inkl. 1/12 des 13. Monatslohns), publiziert 25.11.2025.
 * Note: from 1.1.2027 the BVG thresholds rise (Eintrittsschwelle 23'040, Koordinationsabzug 26'880).
 */
export const PAYROLL_YEAR = 2026;

export const RATES = {
  /** AHV 4.35 % + IV 0.7 % + EO 0.25 %, employee share. */
  ahvIvEo: 0.053,
  /** ALV employee share, on income up to the ceiling. No solidarity contribution since 2023. */
  alv: 0.011,
  alvCeiling: 148_200,
} as const;

export const BVG = {
  entryThreshold: 22_680,
  coordinationDeduction: 26_460,
  upperLimit: 90_720,
  minCoordinated: 3_780,
  /** Legal minimum age credits (Altersgutschriften) as share of the coordinated salary, total. Employee pays at least half. */
  ageCredits: [
    { from: 25, to: 34, rate: 0.07 },
    { from: 35, to: 44, rate: 0.1 },
    { from: 45, to: 54, rate: 0.15 },
    { from: 55, to: 65, rate: 0.18 },
  ],
} as const;

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
};

export type PayrollLine = { label: string; note: string; annual: number };

export type PayrollResult = {
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

function bvgEmployeeRate(age: number) {
  const band = BVG.ageCredits.find((b) => age >= b.from && age <= b.to);
  return band ? band.rate / 2 : 0;
}

export function coordinatedSalary(annualGross: number) {
  if (annualGross < BVG.entryThreshold) return 0;
  const capped = Math.min(annualGross, BVG.upperLimit);
  return Math.max(capped - BVG.coordinationDeduction, BVG.minCoordinated);
}

const round = (value: number) => Math.round(value);

export function calculatePayroll(input: PayrollInput): PayrollResult {
  const gross = Math.max(0, input.gross || 0);
  const annualGross = input.period === "year" ? gross : gross * input.payments;
  const monthlyGross = annualGross / input.payments;

  const ahv = annualGross * RATES.ahvIvEo;
  const alv = Math.min(annualGross, RATES.alvCeiling) * RATES.alv;
  const coordinated = coordinatedSalary(annualGross);
  const bvgRate = bvgEmployeeRate(input.age);
  const bvg = coordinated * bvgRate;
  const other = annualGross * (Math.max(0, input.otherPercent) / 100);

  const lines: PayrollLine[] = [
    { label: "AHV / IV / EO", note: "5.3 %", annual: round(ahv) },
    { label: "ALV", note: `1.1 % bis CHF ${RATES.alvCeiling.toLocaleString("de-CH")}`, annual: round(alv) },
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
