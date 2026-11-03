import { supabaseAdmin } from '../../../../lib/supabase-server';
import { parseApplicationInput, ApplicationInputError } from '../../../lib/applications';
import { applicationBody, applicationFailure, applicationJson, applicationUser, requireApplicationSubscription } from '../../../lib/applications-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await applicationUser(request);
    if (!user) return applicationJson({ error: 'Bitte melden Sie sich erneut an.' }, 401);
    const rawOffset = new URL(request.url).searchParams.get('offset') || '0';
    if (!/^\d+$/.test(rawOffset) || !Number.isSafeInteger(Number(rawOffset))) throw new ApplicationInputError('Ungültige Seitennummer.');
    const offset = Number(rawOffset);
    const { data, error } = await supabaseAdmin.from('applications').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).order('id', { ascending: false }).range(offset, offset + 99);
    if (error) throw error;
    return applicationJson({ applications: data || [], nextOffset: data?.length === 100 ? offset + 100 : null });
  } catch (error) { return applicationFailure(error); }
}

export async function POST(request: Request) {
  try {
    const user = await applicationUser(request);
    if (!user) return applicationJson({ error: 'Bitte melden Sie sich erneut an.' }, 401);
    await requireApplicationSubscription(user.id);
    const input = parseApplicationInput(await applicationBody(request));
    const { data, error } = await supabaseAdmin.from('applications').insert({ ...input, user_id: user.id }).select('*').single();
    if (error || !data) throw error || new Error('Missing application');
    return applicationJson({ application: data }, 201);
  } catch (error) { return applicationFailure(error); }
}
