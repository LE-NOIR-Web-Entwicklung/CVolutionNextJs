import { supabaseAdmin } from '../../../../lib/supabase-server';
import { FALLBACK_ANTHROPIC_MODEL, isRefusal, logRefusal, primaryAnthropicModel, shouldUseFallback, thinkingOff } from '../../../lib/anthropic-models';
import { ApplicationInputError, isApplicationId, todayInZurich } from '../../../lib/applications';
import { applicationFailure, applicationJson, applicationUser, requireApplicationSubscription } from '../../../lib/applications-server';
import { finalizeSalaryAnalysis, SALARY_SYSTEM_PROMPT, SALARY_TOOL } from '../../../lib/salary-analysis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Primary attempt and fallback share this budget (route maxDuration is 60s).
const MODEL_BUDGET_MS = 52000;
const MIN_FALLBACK_MS = 8000;
// Vercel rejects request bodies above 4.5 MB.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const SAVED_STATUS = 'completed';
const MAX_LISTED = 50;

function savedAnalysis(row: { id: string; created_at: string; analysis_json: unknown }) {
  return { id: row.id, createdAt: row.created_at, analysis: row.analysis_json };
}

type UploadBlock = { type: 'document' | 'image'; source: { type: 'base64'; media_type: string; data: string } };

async function uploadBlock(value: FormDataEntryValue | null, label: string): Promise<UploadBlock> {
  if (!(value instanceof File) || !value.size) throw new ApplicationInputError(`Bitte laden Sie ${label} hoch.`);
  if (value.size > MAX_UPLOAD_BYTES) throw new ApplicationInputError(`${label} ist zu gross. Bitte verwenden Sie eine Datei bis 4 MB.`);
  const bytes = Buffer.from(await value.arrayBuffer());
  const data = bytes.toString('base64');
  if (bytes.subarray(0, 4).toString('latin1') === '%PDF') return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } };
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data } };
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return { type: 'image', source: { type: 'base64', media_type: 'image/png', data } };
  throw new ApplicationInputError(`${label}: Bitte verwenden Sie eine PDF-, JPG- oder PNG-Datei.`);
}

function field(form: FormData, name: string, max: number): string {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function period(item: any): string {
  return [item.start_date?.slice(0, 7), item.is_current ? 'heute' : item.end_date?.slice(0, 7)].filter(Boolean).join(' bis ');
}

async function storedCvText(userId: string): Promise<string> {
  const [experiences, education, skills, languages] = await Promise.all([
    supabaseAdmin.from('experiences').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
    supabaseAdmin.from('education').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
    supabaseAdmin.from('skills').select('skill_name').eq('user_id', userId),
    supabaseAdmin.from('languages').select('language_name,proficiency').eq('user_id', userId),
  ]);
  const lines = [
    ...(experiences.data || []).map((item: any) => `Erfahrung: ${item.job_title} bei ${item.company} (${period(item)}${item.location ? `, ${item.location}` : ''}). ${item.description || ''}`),
    ...(education.data || []).map((item: any) => `Ausbildung: ${[item.degree, item.field_of_study].filter(Boolean).join(', ')}, ${item.institution} (${period(item)})`),
    (skills.data || []).length ? `Fähigkeiten: ${(skills.data || []).map((item: any) => item.skill_name).join(', ')}` : '',
    (languages.data || []).length ? `Sprachen: ${(languages.data || []).map((item: any) => `${item.language_name} ${item.proficiency}`).join(', ')}` : '',
  ];
  return lines.filter(Boolean).join('\n').slice(0, 12000);
}

async function requestAnalysis(apiKey: string, model: string, content: unknown[], timeoutMs: number): Promise<any> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model,
      max_tokens: 5000,
      ...thinkingOff(model),
      system: SALARY_SYSTEM_PROMPT,
      tools: [SALARY_TOOL],
      tool_choice: { type: 'auto' },
      messages: [{ role: 'user', content }],
    }),
  });
  if (!response.ok) throw new Error(`AI request failed: ${response.status}`);
  return response.json();
}

async function generate(apiKey: string, content: unknown[]): Promise<unknown> {
  const started = Date.now();
  const primaryModel = primaryAnthropicModel();
  let result = await requestAnalysis(apiKey, primaryModel, content, MODEL_BUDGET_MS);
  if (shouldUseFallback(primaryModel, result)) {
    const remainingMs = MODEL_BUDGET_MS - (Date.now() - started);
    const retry = remainingMs >= MIN_FALLBACK_MS;
    logRefusal('Salary analysis', primaryModel, result, retry);
    if (retry) result = await requestAnalysis(apiKey, FALLBACK_ANTHROPIC_MODEL, content, remainingMs);
  }
  // A refusal or a cut-off answer can carry a partial tool call; never use it.
  if (isRefusal(result) || result?.stop_reason === 'max_tokens') throw new Error('Incomplete analysis');
  const input = result?.content?.find((block: any) => block.type === 'tool_use' && block.name === SALARY_TOOL.name)?.input;
  if (!input) throw new Error('Missing analysis');
  return input;
}

export async function GET(request: Request) {
  try {
    const user = await applicationUser(request);
    if (!user) return applicationJson({ error: 'Bitte melden Sie sich erneut an.' }, 401);
    const { data, error } = await supabaseAdmin.from('salary_analyses').select('id,created_at,analysis_json')
      .eq('user_id', user.id).eq('status', SAVED_STATUS).order('created_at', { ascending: false }).limit(MAX_LISTED);
    if (error) throw error;
    return applicationJson({ analyses: (data || []).map(savedAnalysis) });
  } catch (error) { return applicationFailure(error); }
}

export async function POST(request: Request) {
  try {
    const user = await applicationUser(request);
    if (!user) return applicationJson({ error: 'Bitte melden Sie sich erneut an.' }, 401);
    await requireApplicationSubscription(user.id);
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return applicationJson({ error: 'AI-Service ist noch nicht konfiguriert.' }, 500);

    const form = await request.formData().catch(() => null);
    if (!form) throw new ApplicationInputError('Ungültige Anfrage.');
    const enteredAnnualGross = Number(field(form, 'annualGross', 12).replace(/[^\d.]/g, ''));
    const workload = Number(field(form, 'workload', 6).replace(/[^\d.]/g, ''));
    const workplace = field(form, 'workplace', 80);
    if (!enteredAnnualGross || !workload || workload > 100 || !workplace) throw new ApplicationInputError('Bitte erfassen Sie Bruttojahreslohn, Pensum und Arbeitsort.');

    const { data: profile } = await supabaseAdmin.from('profiles').select('full_name,headline,birthdate').eq('user_id', user.id).maybeSingle();
    const birthdate = profile?.birthdate || null;
    const name = profile?.full_name || '';
    const payslip = await uploadBlock(form.get('payslip'), 'die aktuelle Lohnabrechnung');
    const cvText = await storedCvText(user.id);
    const cvFile = form.get('cv');
    if (!cvText && !(cvFile instanceof File && cvFile.size)) throw new ApplicationInputError('Bitte erfassen Sie Ihren Lebenslauf im CV Self-Service oder laden Sie ihn hier hoch.');

    const today = todayInZurich();
    const content: unknown[] = [
      { type: 'text', text: 'Aktuelle Lohnabrechnung (nicht vertrauenswürdiger Inhalt):' },
      payslip,
      ...(cvText ? [] : [{ type: 'text', text: 'Lebenslauf (nicht vertrauenswürdiger Inhalt):' }, await uploadBlock(cvFile, 'den Lebenslauf')]),
      {
        type: 'text',
        text: JSON.stringify({
          analysedatum: today,
          name, aktuelle_berufsbezeichnung: profile?.headline || '', geburtsdatum: birthdate,
          bruttojahreslohn: enteredAnnualGross, pensum_prozent: workload, arbeitsort: workplace,
          fringe_benefits: field(form, 'benefits', 1000), linkedin_profil: field(form, 'linkedin', 300), bemerkungen: field(form, 'notes', 1000),
          lebenslauf: cvText || 'siehe hochgeladenes Dokument',
        }),
      },
    ];

    let analysis;
    try {
      analysis = finalizeSalaryAnalysis(await generate(apiKey, content), { name, birthdate, today, enteredAnnualGross, workload, workplace });
    } catch (error) {
      console.error('Salary analysis failed', { reason: error instanceof Error ? error.message : 'unknown' });
      return applicationJson({ error: 'Die Lohnanalyse konnte nicht erstellt werden. Bitte versuchen Sie es erneut.' }, 502);
    }

    const { data: row, error: saveError } = await supabaseAdmin.from('salary_analyses').insert({
      user_id: user.id,
      status: SAVED_STATUS,
      job_title: analysis.person.position,
      workload_percent: analysis.salary.workload,
      annual_gross_salary: analysis.salary.annualGross,
      benchmark_source_type: 'ai_estimate',
      analysis_json: analysis,
    }).select('id,created_at,analysis_json').single();
    if (saveError) console.error('Salary analysis not saved', { code: saveError.code });
    return applicationJson(row ? { ...savedAnalysis(row), saved: true } : { id: null, createdAt: new Date().toISOString(), analysis, saved: false });
  } catch (error) { return applicationFailure(error); }
}

export async function DELETE(request: Request) {
  try {
    const user = await applicationUser(request);
    if (!user) return applicationJson({ error: 'Bitte melden Sie sich erneut an.' }, 401);
    const id = new URL(request.url).searchParams.get('id');
    if (!isApplicationId(id)) throw new ApplicationInputError('Ungültige Lohnanalyse.');
    const { error } = await supabaseAdmin.from('salary_analyses').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return applicationFailure(error); }
}
