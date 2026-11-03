import { applicationBody, applicationFailure, applicationJson, applicationUser, requireApplicationSubscription } from '../../../../lib/applications-server';
import { ApplicationInputError } from '../../../../lib/applications';
import { extractJobAd } from '../../../../lib/job-ad-extraction';
import { fetchPageText, parseSafeExternalUrl } from '../../../../lib/motivation-letter-source';
import { supabaseAdmin } from '../../../../../lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 45;

export async function POST(request: Request) {
  try {
    const user = await applicationUser(request);
    if (!user) return applicationJson({ error: 'Bitte melden Sie sich erneut an.' }, 401);
    await requireApplicationSubscription(user.id);
    const body = await applicationBody(request);
    if (Object.keys(body).some((key) => key !== 'url') || typeof body.url !== 'string' || !body.url.trim() || body.url.length > 500 || !/^https?:\/\//i.test(body.url.trim())) throw new ApplicationInputError('Bitte geben Sie einen vollständigen HTTP(S)-Link zum Stelleninserat ein.');
    const url = parseSafeExternalUrl(body.url.trim());
    if (!url) throw new ApplicationInputError('Der Inserat-Link ist ungültig. Bitte verwenden Sie einen öffentlichen HTTP(S)-Link ohne Zugangsdaten.');
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return applicationJson({ error: 'AI-Service ist noch nicht konfiguriert.' }, 500);
    const { data: allowed, error: limitError } = await supabaseAdmin.rpc('claim_application_import', { p_user_id: user.id });
    if (limitError) throw limitError;
    if (allowed !== true) {
      const response = applicationJson({ error: 'Bitte warten Sie 10 Sekunden, bevor Sie ein weiteres Inserat auslesen.' }, 429);
      response.headers.set('Retry-After', '10');
      return response;
    }
    const source = await fetchPageText(url, 9000);
    if (!source) return applicationJson({ error: 'Das Inserat konnte nicht gelesen werden. Die Seite ist möglicherweise geschützt oder nicht mehr verfügbar. Bitte erfassen Sie die Angaben manuell.' }, 422);
    try {
      return applicationJson({ extraction: await extractJobAd(apiKey, source, url.toString()) });
    } catch {
      return applicationJson({ error: 'Die KI konnte die Stellenangaben nicht zuverlässig auslesen. Bitte versuchen Sie es erneut oder erfassen Sie die Angaben manuell.' }, 502);
    }
  } catch (error) { return applicationFailure(error); }
}
