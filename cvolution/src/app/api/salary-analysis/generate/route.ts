import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase-server";
import { buildCalculatedValues, normalizeSalaryInput } from "@/lib/salary/calculateSalaryValues";
import { getSalaryBenchmark } from "@/lib/salary/getSalaryBenchmark";
import { generateSalaryAnalysis } from "@/lib/openai/generateSalaryAnalysis";

export async function POST(request: Request) {
  const { id } = await request.json();
  const { data: analysis } = await supabaseAdmin.from("salary_analyses").select("*").eq("id", id).single();
  if (!analysis) return NextResponse.json({ error: "Analyse nicht gefunden." }, { status: 404 });
  await supabaseAdmin.from("salary_analyses").update({ status: "generating" }).eq("id", id);
  try {
    const benchmark = await getSalaryBenchmark(id, { jobTitle: analysis.job_title, industry: analysis.industry, workRegion: analysis.work_region, canton: analysis.canton, experienceYears: analysis.experience_years, education: analysis.education, hasLeadership: analysis.has_leadership });
    const calculated = buildCalculatedValues({ monthlyGrossSalary: normalizeSalaryInput(analysis.monthly_gross_salary), annualGrossSalary: normalizeSalaryInput(analysis.annual_gross_salary), workloadPercent: Number(analysis.workload_percent || 100), thirteenthSalary: analysis.thirteenth_salary, benchmark: benchmark.selectedBenchmark });
    const output = await generateSalaryAnalysis({ customer_data: { firstName: analysis.first_name, lastName: analysis.last_name, canton: analysis.canton, workRegion: analysis.work_region, jobTitle: analysis.job_title, industry: analysis.industry, education: analysis.education, experienceYears: analysis.experience_years, hasLeadership: analysis.has_leadership, workloadPercent: analysis.workload_percent, analysisPurpose: analysis.analysis_purpose }, salary_data: calculated, benchmark_data: benchmark.selectedBenchmark, sources: benchmark.sources, calculated_values: calculated });
    await supabaseAdmin.from("salary_analyses").update({ status: "completed", analysis_json: output, calculated_values: calculated, benchmark_confidence: benchmark.confidenceScore, quality_warnings: benchmark.qualityWarnings }).eq("id", id);
    return NextResponse.json({ ok: true });
  } catch {
    await supabaseAdmin.from("salary_analyses").update({ status: "failed" }).eq("id", id);
    return NextResponse.json({ error: "Die Analyse konnte nicht automatisch erstellt werden. Bitte prüfen Sie Ihre Angaben oder kontaktieren Sie uns." }, { status: 500 });
  }
}
