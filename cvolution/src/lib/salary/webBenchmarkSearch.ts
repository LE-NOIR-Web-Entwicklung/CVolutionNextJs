import { buildBenchmarkQueries } from "./buildBenchmarkQueries";
import type { SalaryBenchmark } from "./benchmarkSchema";

export async function searchSalaryBenchmarks(input: { jobTitle: string; industry: string; workRegion?: string | null; canton?: string | null; experienceYears?: number | null; education?: string | null; hasLeadership?: boolean; }) {
  const queries = buildBenchmarkQueries(input);
  if (process.env.ENABLE_SALARY_WEB_SEARCH !== "true") return { queries, candidates: [] as SalaryBenchmark[], sources: [], qualityWarnings: ["Websuche deaktiviert."] };
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { queries, candidates: [] as SalaryBenchmark[], sources: [], qualityWarnings: ["OPENAI_API_KEY fehlt."] };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_BENCHMARK_MODEL || "gpt-5",
      tools: [{ type: "web_search_preview" }],
      input: [{ role: "system", content: "Du recherchierst Schweizer Lohnbenchmarkdaten. Erfinde keine Zahlen. Gib nur JSON zurück." }, { role: "user", content: JSON.stringify({ queries, profile: input }) }],
      text: { format: { type: "json_object" } },
    }),
  });
  const data = await res.json();
  const parsed = JSON.parse(data.output_text || "{}");
  return { queries, candidates: (parsed.candidates || []) as SalaryBenchmark[], sources: parsed.sources || [], qualityWarnings: parsed.qualityWarnings || [] };
}
