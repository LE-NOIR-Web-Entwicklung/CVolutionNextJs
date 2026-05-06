import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.firstName || !body.lastName || !body.email || body.email !== body.emailConfirmation || !body.jobTitle || !body.industry || !body.experienceYears || (!body.annualGrossSalary && !body.monthlyGrossSalary)) {
    return NextResponse.json({ error: "Ungültige Formulardaten." }, { status: 400 });
  }
  const accessToken = randomBytes(24).toString("hex");
  const downloadToken = randomBytes(24).toString("hex");
  const { data, error } = await supabaseAdmin.from("salary_analyses").insert({
    status: "submitted", access_token: accessToken, download_token: downloadToken,
    first_name: body.firstName, last_name: body.lastName, email: body.email, phone: body.phone ?? null,
    work_region: body.workRegion ?? null, canton: body.canton ?? null,
    job_title: body.jobTitle, target_job_title: body.targetJobTitle ?? null,
    industry: body.industry, target_industry: body.targetIndustry ?? null,
    education: body.education ?? null, experience_years: Number(body.experienceYears), has_leadership: !!body.hasLeadership,
    team_size: body.teamSize ? Number(body.teamSize) : null, workload_percent: Number(body.workloadPercent || 100),
    monthly_gross_salary: body.monthlyGrossSalary ?? null, annual_gross_salary: body.annualGrossSalary ?? null,
    bonus: body.bonus ?? null, thirteenth_salary: body.thirteenthSalary ?? null, target_salary: body.targetSalary ?? null,
    analysis_purpose: body.analysisPurpose ?? null, linkedin_url: body.linkedinUrl ?? null, notes: body.notes ?? null,
  }).select("id,access_token").single();
  if (error) return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  return NextResponse.json({ id: data.id, accessToken: data.access_token });
}
