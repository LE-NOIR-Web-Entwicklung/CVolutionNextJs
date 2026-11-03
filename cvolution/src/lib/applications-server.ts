import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../lib/supabase-server';
import { ApplicationInputError } from './applications';

export function applicationJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
}

export async function applicationUser(request: Request) {
  const header = request.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return error ? null : data.user;
}

class ApplicationSubscriptionRequired extends Error {}

export async function requireApplicationSubscription(userId: string) {
  const { data: profile, error } = await supabaseAdmin.from('profiles')
    .select('paid,paydate,subscription_current_period_end,subscription_status').eq('user_id', userId).single();
  if (error) throw error;
  const periodEnd = profile?.subscription_current_period_end || profile?.paydate;
  const active = periodEnd && Date.parse(periodEnd) > Date.now() &&
    (profile?.paid || ['active', 'canceled'].includes(profile?.subscription_status));
  if (!active) throw new ApplicationSubscriptionRequired();
}

export async function applicationBody(request: Request): Promise<Record<string, unknown>> {
  // Bound the stream as well as Content-Length; chunked requests have no trusted length.
  const reader = request.body?.getReader();
  if (!reader) throw new ApplicationInputError('Ungültige Anfrage.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 100000) {
      await reader.cancel();
      throw new ApplicationBodyTooLarge();
    }
    chunks.push(value);
  }
  let body: unknown;
  try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new ApplicationInputError('Ungültige Anfrage.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ApplicationInputError('Ungültige Anfrage.');
  return body as Record<string, unknown>;
}

class ApplicationBodyTooLarge extends Error {}

export function applicationFailure(error: unknown) {
  if (error instanceof ApplicationSubscriptionRequired) return applicationJson({ error: 'Der Bewerbungsmanager ist im aktiven Self-Service-Abo enthalten.' }, 402);
  if (error instanceof ApplicationBodyTooLarge) return applicationJson({ error: 'Die Bewerbung ist zu gross.' }, 413);
  if (error instanceof ApplicationInputError) return applicationJson({ error: error.message }, 400);
  return applicationJson({ error: 'Die Bewerbung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.' }, 500);
}
