import { supabaseAdmin } from "../../../lib/supabase-server";
import { normalizeBenchmarkData } from "./normalizeBenchmarkData";
import { selectBestBenchmark } from "./selectBestBenchmark";
import { searchSalaryBenchmarks } from "./webBenchmarkSearch";

export async function getSalaryBenchmark(salaryAnalysisId: string, normalized: { jobTitle: string; industry: string; workRegion?: string | null; canton?: string | null; experienceYears?: number | null; education?: string | null; hasLeadership?: boolean; }) {
  const cacheKey = `${normalized.jobTitle}|${normalized.industry}|${normalized.workRegion || normalized.canton || "ch"}|${normalized.experienceYears || "na"}`.toLowerCase();
  const now = new Date();
  const { data: cached } = await supabaseAdmin.from("salary_benchmark_cache").select("*").eq("cache_key", cacheKey).gt("expires_at", now.toISOString()).maybeSingle();
  if (cached) return { selectedBenchmark: cached.selected_benchmark, sources: cached.sources || [], confidenceScore: cached.confidence_score || null, qualityWarnings: [], cacheHit: true };

  const search = await searchSalaryBenchmarks(normalized);
  const normalizedCandidates = normalizeBenchmarkData(search.candidates);
  const selected = selectBestBenchmark(normalizedCandidates);
  await supabaseAdmin.from("salary_benchmark_searches").insert({ salary_analysis_id: salaryAnalysisId, status: "completed", queries: search.queries, benchmark_candidates: normalizedCandidates, selected_benchmark: selected, sources: search.sources, quality_warnings: search.qualityWarnings });

  if (selected) {
    const days = Number(process.env.SALARY_BENCHMARK_CACHE_DAYS || 30);
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();
    await supabaseAdmin.from("salary_benchmark_cache").upsert({ cache_key: cacheKey, normalized_role: normalized.jobTitle, industry: normalized.industry, region: normalized.workRegion || normalized.canton || null, experience_level: String(normalized.experienceYears || "na"), selected_benchmark: selected, sources: search.sources, confidence_score: selected.confidenceScore, expires_at: expiresAt });
  }

  return { selectedBenchmark: selected, sources: search.sources, confidenceScore: selected?.confidenceScore ?? null, qualityWarnings: search.qualityWarnings, cacheHit: false };
}
