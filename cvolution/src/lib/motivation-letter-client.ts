import { supabase } from '@/integrations/supabase/client';

export class MotivationLetterRequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 64);
}

// Word export of a letter; a saved application id makes the server use the stored letter.
export async function downloadMotivationLetterDocx({ applicationId, letter, jobTitle, company }: { applicationId?: string; letter: string; jobTitle: string; company: string }) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Bitte melden Sie sich erneut an.');
  const response = await fetch('/api/motivation-letter/docx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...(applicationId ? { applicationId } : {}), letter, jobTitle, company }),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new MotivationLetterRequestError(result?.error || 'Das DOCX konnte nicht erstellt werden.', response.status);
  }
  const url = URL.createObjectURL(await response.blob());
  const link = window.document.createElement('a');
  link.href = url;
  link.download = `motivationsschreiben-${slugify(company || jobTitle || 'cvolution')}.docx`;
  window.document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
