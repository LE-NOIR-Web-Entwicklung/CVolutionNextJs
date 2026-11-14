import { supabase } from '@/integrations/supabase/client';
import { type Application, type ApplicationInput, type JobAdExtraction, parseApplicationInput } from './applications';
import { applicationsWorkbook } from './applications-export';
import { downloadBlob } from './download-blob';

export class ApplicationRequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function applicationRequest(path: string, options: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Bitte melden Sie sich erneut an.');
  const response = await fetch(`/api/applications${path}`, {
    ...options,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (response.status === 204) return null;
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new ApplicationRequestError(result?.error || 'Die Bewerbung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.', response.status);
  return result;
}

export async function loadApplications(signal?: AbortSignal): Promise<Application[]> {
  const applications: Application[] = [];
  let offset: number | null = 0;
  do {
    const page = await applicationRequest(`?offset=${offset}`, { signal });
    applications.push(...page.applications);
    offset = page.nextOffset;
  } while (offset !== null);
  return applications;
}

export async function saveApplication(input: ApplicationInput, saved: Application | null): Promise<Application> {
  const data = parseApplicationInput(input);
  const result = await applicationRequest(saved ? `/${saved.id}` : '', {
    method: saved ? 'PUT' : 'POST',
    body: JSON.stringify(saved ? { ...data, expected_updated_at: saved.updated_at } : data),
  });
  return result.application;
}

export async function deleteApplication(id: string): Promise<void> {
  await applicationRequest(`/${id}`, { method: 'DELETE' });
}

export async function extractApplication(url: string): Promise<JobAdExtraction> {
  const result = await applicationRequest('/extract', { method: 'POST', body: JSON.stringify({ url }) });
  return result.extraction;
}

export async function downloadApplications(applications: Application[]) {
  downloadBlob(await applicationsWorkbook(applications), 'cvolution-bewerbungen.xlsx');
}
