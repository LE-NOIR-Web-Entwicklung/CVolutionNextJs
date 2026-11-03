import { supabase } from '@/integrations/supabase/client';
import { type Application, type ApplicationInput, parseApplicationInput } from './applications';

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
  if (!response.ok) throw new Error(result?.error || 'Die Bewerbung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.');
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

export function downloadApplications(applications: Application[]) {
  const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), applications }, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cvolution-bewerbungen.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
