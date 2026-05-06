import type { SalaryBenchmark } from "./benchmarkSchema";

export function normalizeBenchmarkData(candidates: SalaryBenchmark[]): SalaryBenchmark[] {
  return candidates.map((c) => {
    const factor = c.salaryPeriod === "monthly" ? 13 : c.salaryPeriod === "hourly" ? 2080 : 1;
    return {
      ...c,
      minimumSalary: c.minimumSalary ? c.minimumSalary * factor : null,
      medianSalary: c.medianSalary ? c.medianSalary * factor : null,
      maximumSalary: c.maximumSalary ? c.maximumSalary * factor : null,
      salaryPeriod: "annual",
      currency: "CHF",
    };
  });
}
