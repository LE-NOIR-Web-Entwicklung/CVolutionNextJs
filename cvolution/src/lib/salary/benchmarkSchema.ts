export type SalaryBenchmark = {
  role: string;
  industry: string | null;
  region: string | null;
  canton: string | null;
  minimumSalary: number | null;
  medianSalary: number | null;
  maximumSalary: number | null;
  salaryPeriod: "monthly" | "annual" | "hourly" | "unknown";
  workloadPercent: number | null;
  currency: "CHF";
  sourceName: string;
  sourceUrl: string;
  sourceYear: string | null;
  methodologyNote: string | null;
  confidenceScore: number;
  extractedAt: string;
};
