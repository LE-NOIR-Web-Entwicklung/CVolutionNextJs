import type { SalaryBenchmark } from "./benchmarkSchema";

export function selectBestBenchmark(candidates: SalaryBenchmark[]) {
  return [...candidates].sort((a, b) => b.confidenceScore - a.confidenceScore)[0] ?? null;
}
