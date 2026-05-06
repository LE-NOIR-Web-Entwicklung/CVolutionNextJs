export type ThirteenthSalary = "yes" | "no" | "unknown" | null;

export type BenchmarkBand = { minimumSalary: number | null; medianSalary: number | null; maximumSalary: number | null };

export function parseSwissCurrency(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined) return null;
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  const cleaned = input.replace(/CHF|chf|\s|'/g, "").replace(/[’]/g, "").replace(/,/g, ".");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function normalizeSalaryInput(input: string | number | null | undefined): number | null {
  return parseSwissCurrency(input);
}

export function calculateAnnualSalary(monthly: number | null, annual: number | null, thirteenthSalary: ThirteenthSalary) {
  if (annual && annual > 0) return { annualGrossSalary: annual, assumptions: [] as string[] };
  if (!monthly || monthly <= 0) return { annualGrossSalary: null, assumptions: [] as string[] };
  if (thirteenthSalary === "no") return { annualGrossSalary: monthly * 12, assumptions: [] as string[] };
  if (thirteenthSalary === "unknown") return { annualGrossSalary: monthly * 13, assumptions: ["13. Monatslohn als Annahme verwendet."] };
  return { annualGrossSalary: monthly * 13, assumptions: [] as string[] };
}

export function calculateFullTimeEquivalent(annualSalary: number | null, workloadPercent: number | null): number | null {
  if (!annualSalary || !workloadPercent || workloadPercent <= 0) return null;
  if (workloadPercent === 100) return annualSalary;
  return (annualSalary / workloadPercent) * 100;
}

export function calculateDifferenceToMedian(currentAnnualSalary: number | null, benchmarkMedian: number | null) {
  if (!currentAnnualSalary || !benchmarkMedian) return { differenceToMedianChf: null, differenceToMedianPercent: null };
  const differenceToMedianChf = currentAnnualSalary - benchmarkMedian;
  return {
    differenceToMedianChf,
    differenceToMedianPercent: (differenceToMedianChf / benchmarkMedian) * 100,
  };
}

export function classifyMarketPosition(currentAnnualSalary: number | null, benchmark: BenchmarkBand | null) {
  if (!benchmark || !currentAnnualSalary || benchmark.minimumSalary == null || benchmark.maximumSalary == null) return "nicht eindeutig bewertbar";
  if (currentAnnualSalary < benchmark.minimumSalary) return "unter Marktband";
  if (currentAnnualSalary > benchmark.maximumSalary) return "über Marktband";
  return "marktgerecht";
}

export function calculatePotentialScenarios(currentAnnualSalary: number | null, benchmark: BenchmarkBand | null) {
  if (!currentAnnualSalary) return null;
  const median = benchmark?.medianSalary ?? currentAnnualSalary * 1.04;
  const max = benchmark?.maximumSalary ?? currentAnnualSalary * 1.08;
  return {
    conservative: { salaryFrom: currentAnnualSalary, salaryTo: Math.max(median, currentAnnualSalary * 1.03), estimateOnly: !benchmark },
    realistic: { salaryFrom: median, salaryTo: max, estimateOnly: !benchmark },
    optimistic: { salaryFrom: max, salaryTo: max * 1.08, estimateOnly: !benchmark },
    ambitious: { salaryFrom: max, salaryTo: max * 1.15, estimateOnly: true },
  };
}

export function buildCalculatedValues(input: { monthlyGrossSalary: number | null; annualGrossSalary: number | null; workloadPercent: number | null; thirteenthSalary: ThirteenthSalary; benchmark: BenchmarkBand | null; }) {
  const annual = calculateAnnualSalary(input.monthlyGrossSalary, input.annualGrossSalary, input.thirteenthSalary);
  const fullTimeEquivalent = calculateFullTimeEquivalent(annual.annualGrossSalary, input.workloadPercent);
  const diffs = calculateDifferenceToMedian(fullTimeEquivalent, input.benchmark?.medianSalary ?? null);
  return {
    annualGrossSalary: annual.annualGrossSalary,
    fullTimeEquivalentSalary: fullTimeEquivalent,
    marketPosition: classifyMarketPosition(fullTimeEquivalent, input.benchmark),
    ...diffs,
    assumptions: annual.assumptions,
    potentialScenarios: calculatePotentialScenarios(fullTimeEquivalent, input.benchmark),
  };
}
