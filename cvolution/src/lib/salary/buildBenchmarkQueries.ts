export function buildBenchmarkQueries(input: { jobTitle: string; industry: string; workRegion?: string | null; canton?: string | null; experienceYears?: number | null }) {
  const region = input.workRegion || input.canton || "Schweiz";
  const year = new Date().getFullYear();
  return [
    `${input.jobTitle} Lohn Schweiz ${year} ${region}`,
    `${input.jobTitle} Gehalt Schweiz Median ${year}`,
    `${input.jobTitle} Lohnvergleich Schweiz`,
    `${input.industry} Lohnstudie Schweiz ${input.jobTitle}`,
    `Salarium ${input.jobTitle} Schweiz Lohn`,
  ].slice(0, Number(process.env.MAX_BENCHMARK_SEARCH_QUERIES || 5));
}
