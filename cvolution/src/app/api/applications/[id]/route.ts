import { supabaseAdmin } from '../../../../../lib/supabase-server';
import { isApplicationId, parseApplicationInput, ApplicationInputError } from '../../../../lib/applications';
import { applicationBody, applicationFailure, applicationJson, applicationUser } from '../../../../lib/applications-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    const user = await applicationUser(request);
    if (!user) return applicationJson({ error: 'Bitte melden Sie sich erneut an.' }, 401);
    const { id } = await context.params;
    if (!isApplicationId(id)) throw new ApplicationInputError('Ungültige Bewerbung.');
    const { expected_updated_at, ...body } = await applicationBody(request);
    if (typeof expected_updated_at !== 'string' || expected_updated_at.length > 40 || !Number.isFinite(Date.parse(expected_updated_at))) throw new ApplicationInputError('Bitte öffnen Sie die gespeicherte Bewerbung erneut.');
    const input = parseApplicationInput(body);
    const { data, error } = await supabaseAdmin.from('applications').update(input).eq('id', id).eq('user_id', user.id)
      .eq('updated_at', expected_updated_at).select('*').maybeSingle();
    if (error) throw error;
    if (!data) return applicationJson({ error: 'Die Bewerbung wurde zwischenzeitlich geändert oder gelöscht. Ihre Eingaben bleiben erhalten. Bitte laden Sie den gespeicherten Stand erneut.' }, 409);
    return applicationJson({ application: data });
  } catch (error) { return applicationFailure(error); }
}

export async function DELETE(request: Request, context: Context) {
  try {
    const user = await applicationUser(request);
    if (!user) return applicationJson({ error: 'Bitte melden Sie sich erneut an.' }, 401);
    const { id } = await context.params;
    if (!isApplicationId(id)) throw new ApplicationInputError('Ungültige Bewerbung.');
    const { data, error } = await supabaseAdmin.from('applications').delete().eq('id', id).eq('user_id', user.id).select('id').maybeSingle();
    if (error) throw error;
    if (!data) return applicationJson({ error: 'Die Bewerbung wurde nicht gefunden.' }, 404);
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return applicationFailure(error); }
}
