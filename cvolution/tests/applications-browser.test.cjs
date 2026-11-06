/* eslint-disable @typescript-eslint/no-require-imports -- Optional Playwright journey tests against a local production build, with all user/API data intercepted. */
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');

const baseUrl = process.env.APPLICATIONS_BROWSER_URL;
const owner = '11111111-1111-4111-8111-111111111111';
const options = { skip: !baseUrl, timeout: 60000 };

async function fixture(t) {
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(baseUrl).hostname), 'Only an isolated local server is allowed');
  const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const browserType = process.env.APPLICATIONS_BROWSER_ENGINE === 'webkit' ? webkit : chromium;
  const browser = await browserType.launch({ executablePath: process.env.PLAYWRIGHT_BROWSER_EXECUTABLE || process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined, headless: true });
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-US', acceptDownloads: true });
  const state = { records: [], paid: true, failSave: false, failLoad: false, failExtract: false, words: [], generations: [], extractions: [], errors: [] };
  const user = { id: owner, email: 'fixture@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
  const token = `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')}.${Buffer.from(JSON.stringify({ sub: owner, exp: 4102444800, aud: 'authenticated', role: 'authenticated' })).toString('base64url')}.fixture`;
  await context.addInitScript(({ token, user }) => {
    localStorage.setItem('sb-umvuqbeuzjqmmudkvscy-auth-token', JSON.stringify({ access_token: token, refresh_token: 'fixture', token_type: 'bearer', expires_at: 4102444800, expires_in: 3600, user }));
  }, { token, user });
  await context.route('**/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (url.hostname.endsWith('supabase.co')) {
      if (url.pathname.startsWith('/auth/')) return json(user);
      if (url.pathname.endsWith('/profiles')) return json({ user_id: owner, full_name: 'Testperson Muster', paid: state.paid, subscription_status: state.paid ? 'active' : 'canceled', subscription_provider: 'saferpay', subscription_current_period_end: state.paid ? '2099-01-01' : '2000-01-01' });
      return json([]);
    }
    if (url.pathname === '/api/applications/extract') {
      if (!state.paid) return json({ error: 'Abo erforderlich' }, 402);
      state.extractions.push(req.postDataJSON());
      if (state.failExtract) return json({ error: 'Das Inserat konnte nicht gelesen werden. Bitte erfassen Sie die Angaben manuell.' }, 422);
      return json({ extraction: {
        company: 'Import AG', job_title: 'Teamleitung', deadline: '2026-12-15',
        motivation_form: { applicationType: 'reactive', jobTitle: 'Teamleitung', company: 'Import AG', companyStreet: 'Musterweg 1', companyPostalCode: '8000', companyCity: 'Zürich', recipient: 'Frau Beispiel', jobAd: 'Importierter Inserattext mit den Aufgaben und Anforderungen.', jobAdUrl: req.postDataJSON().url, language: 'de-CH' },
      } });
    }
    if (url.pathname.startsWith('/api/applications')) {
      const id = url.pathname.split('/')[3];
      if (req.method() === 'GET') {
        if (state.failLoad) { state.failLoad = false; return json({ error: 'Test: Laden fehlgeschlagen' }, 500); }
        return json({ applications: state.records, nextOffset: null });
      }
      if (req.method() === 'DELETE') {
        state.records = state.records.filter((row) => row.id !== id);
        return route.fulfill({ status: 204 });
      }
      if (!state.paid) return json({ error: 'Der Bewerbungsmanager ist im aktiven Self-Service-Abo enthalten.' }, 402);
      if (state.failSave) { state.failSave = false; return json({ error: 'Test: Speichern fehlgeschlagen' }, 500); }
      const { expected_updated_at, ...input } = req.postDataJSON();
      const saved = state.records.find((row) => row.id === id);
      if (id && saved?.updated_at !== expected_updated_at) return json({ error: 'Die Bewerbung wurde zwischenzeitlich geändert. Ihre Eingaben bleiben erhalten.' }, 409);
      const timestamp = new Date().toISOString();
      const application = { ...input, id: id || randomUUID(), user_id: owner, created_at: saved?.created_at || timestamp, updated_at: timestamp };
      state.records = [application, ...state.records.filter((row) => row.id !== application.id)];
      return json({ application }, id ? 200 : 201);
    }
    if (url.pathname === '/api/motivation-letter/generate') {
      const form = req.postDataJSON();
      state.generations.push(form);
      return state.paid ? json({ letter: `Bewerbung als ${form.jobTitle}\n\nSehr geehrte Damen und Herren\n\nMein Entwurf für ${form.company}.\n\nFreundliche Grüsse` }) : json({ error: 'Abo erforderlich' }, 402);
    }
    if (url.pathname === '/api/motivation-letter/docx') {
      state.words.push(req.postDataJSON());
      return route.fulfill({ status: 200, contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', body: Buffer.from('fixture-docx') });
    }
    if (url.origin !== new URL(baseUrl).origin) return route.abort();
    // Never let a journey accidentally call a production-backed mutation.
    if (url.pathname.startsWith('/api/')) return json({ error: 'Unexpected API in isolated browser test' }, 500);
    return route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => state.errors.push(error.message));
  await page.goto(`${baseUrl}/dashboard#applications`);
  const manager = page.getByRole('tabpanel', { name: 'Bewerbungsmanager', exact: true });
  await manager.getByRole('heading', { name: 'Ihre erste Bewerbung beginnt hier' }).waitFor();
  return { page, manager, state };
}

// Leaves the letter dialog open with the job advert filled in.
async function create(manager, company = 'Muster AG', job = 'Projektleitung') {
  await manager.getByRole('button', { name: 'Bewerbung erfassen', exact: true }).click();
  await manager.getByLabel('Unternehmen *', { exact: true }).fill(company);
  await manager.getByLabel('Stellenbezeichnung *', { exact: true }).fill(job);
  await manager.getByRole('button', { name: 'Schreiben erstellen', exact: true }).click();
  await manager.page().getByRole('dialog').getByLabel(/^Stellenanzeige/).fill('Gesucht wird eine erfahrene Person für Beratung und Projektleitung.');
}

async function closeLetter(manager) {
  await manager.page().keyboard.press('Escape');
  await manager.page().getByRole('dialog').waitFor({ state: 'hidden' });
}

async function save(manager) {
  if (await manager.page().getByRole('dialog').count()) await closeLetter(manager);
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByRole('status').filter({ hasText: 'Alle Änderungen gespeichert' }).waitFor();
}

test('first successful save returns to the overview while later edits stay open', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await create(manager);
  state.failSave = true;
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByRole('alert').filter({ hasText: 'Test: Speichern fehlgeschlagen' }).waitFor();
  assert.equal(await manager.getByLabel('Unternehmen *', { exact: true }).inputValue(), 'Muster AG');
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor({ timeout: 2000 });
  assert.equal(state.records.length, 1);
  assert.equal(await manager.getByLabel('Unternehmen *', { exact: true }).count(), 0);
  await page.waitForFunction(() => document.activeElement?.tagName === 'H2' && document.activeElement.textContent === 'Bewerbungen');
  await manager.getByRole('button').filter({ hasText: 'Projektleitung' }).click();
  await manager.getByLabel('Notizen', { exact: true }).fill('Nachträgliche Änderung');
  await save(manager);
  assert.equal(await manager.getByLabel('Notizen', { exact: true }).inputValue(), 'Nachträgliche Änderung');
  assert.equal(state.records[0].notes, 'Nachträgliche Änderung');
  assert.deepEqual(state.errors, []);
});

test('application journey saves separate letters, survives refresh and reuses the CV export', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await create(manager);
  await manager.getByLabel('Nächste Aktion am', { exact: true }).fill('02.11.2026');
  await manager.getByLabel('Nächster Schritt', { exact: true }).fill('Nachfassen');
  await page.getByRole('dialog').getByRole('button', { name: 'Erstellen', exact: true }).click();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor();
  assert.equal(state.records.length, 1);
  await manager.getByRole('button').filter({ hasText: 'Projektleitung' }).click();
  await manager.getByRole('button', { name: 'Öffnen', exact: true }).click();
  await page.getByRole('dialog').getByRole('article').waitFor();
  await page.getByRole('dialog').getByRole('button', { name: 'Bearbeiten', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Schreiben bearbeiten', { exact: true }).fill('Mein bearbeiteter Brief.\n\nZweiter Absatz.');
  await closeLetter(manager);
  await manager.getByRole('button', { name: 'Versendet', exact: true }).click();
  assert.match(await manager.getByLabel('Versendet am', { exact: true }).inputValue(), /^\d{2}\.\d{2}\.\d{4}$/, 'Marking as sent dates the dispatch');
  await save(manager);
  await page.getByRole('tab', { name: 'CV Self-Service', exact: true }).click();
  await page.getByRole('tab', { name: 'Bewerbungsmanager', exact: true }).click();
  await manager.getByRole('button', { name: 'Aktuellen CV exportieren' }).click();
  await page.getByRole('dialog').getByRole('heading', { name: 'CV Exportieren' }).waitFor();
  await page.getByRole('dialog').getByRole('button', { name: 'Abbrechen' }).click();
  await page.reload();
  await manager.getByRole('button').filter({ hasText: 'Projektleitung' }).click();
  await manager.getByRole('button', { name: 'Öffnen', exact: true }).click();
  await page.getByRole('dialog').getByRole('article').filter({ hasText: 'Zweiter Absatz.' }).waitFor();
  await page.getByRole('dialog').getByRole('button', { name: 'Bearbeiten', exact: true }).click();
  assert.equal(await page.getByRole('dialog').getByLabel('Schreiben bearbeiten', { exact: true }).inputValue(), 'Mein bearbeiteter Brief.\n\nZweiter Absatz.');
  await closeLetter(manager);
  assert.equal(state.records.find((row) => row.company === 'Muster AG').status, 'sent');
  await manager.getByRole('button', { name: 'Übersicht', exact: true }).click();
  await create(manager, 'Zweite AG', 'Beratung');
  await page.getByRole('dialog').getByRole('button', { name: 'Erstellen', exact: true }).click();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor();
  assert.equal(state.records.length, 2);
  assert.match(state.records.find((row) => row.company === 'Muster AG').motivation_letter, /bearbeiteter Brief/);
  assert.match(state.records.find((row) => row.company === 'Zweite AG').motivation_letter, /Zweite AG/);
  await manager.getByLabel('Bewerbungen durchsuchen').fill('mUsTeR');
  assert.equal(await manager.locator('li').count(), 1);
  await manager.getByRole('button', { name: 'Absagen (0)', exact: true }).click();
  await manager.getByRole('heading', { name: 'Keine passenden Bewerbungen' }).waitFor();
  assert.deepEqual(state.errors, []);
});

test('save, load and conflict failures keep input; deletion requires confirmation', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await create(manager);
  state.failSave = true;
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByRole('alert').filter({ hasText: 'Test: Speichern fehlgeschlagen' }).waitFor();
  assert.equal(await manager.getByLabel('Unternehmen *', { exact: true }).inputValue(), 'Muster AG');
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor();
  await manager.getByRole('button').filter({ hasText: 'Projektleitung' }).click();
  state.records[0].updated_at = '2099-01-01T00:00:00.000Z';
  await manager.getByLabel('Notizen', { exact: true }).fill('Lokale Eingabe bleibt');
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByRole('alert').filter({ hasText: 'zwischenzeitlich geändert' }).waitFor();
  assert.equal(await manager.getByLabel('Notizen', { exact: true }).inputValue(), 'Lokale Eingabe bleibt');
  page.once('dialog', (dialog) => dialog.dismiss());
  await manager.getByRole('button', { name: 'Übersicht', exact: true }).click();
  assert.equal(await manager.getByLabel('Notizen', { exact: true }).inputValue(), 'Lokale Eingabe bleibt');
  page.once('dialog', (dialog) => dialog.accept());
  await manager.getByRole('button', { name: 'Gespeicherten Stand laden' }).click();
  await manager.getByRole('status').filter({ hasText: 'Alle Änderungen gespeichert' }).waitFor();
  assert.equal(await manager.getByLabel('Notizen', { exact: true }).inputValue(), '');
  page.once('dialog', (dialog) => dialog.dismiss());
  await manager.getByRole('button', { name: 'Löschen', exact: true }).click();
  assert.equal(state.records.length, 1);
  page.once('dialog', (dialog) => dialog.accept());
  await manager.getByRole('button', { name: 'Löschen', exact: true }).click();
  await manager.getByRole('heading', { name: 'Ihre erste Bewerbung beginnt hier' }).waitFor();
  assert.equal(state.records.length, 0);
  state.failLoad = true;
  await page.reload();
  await manager.getByRole('alert').filter({ hasText: 'Test: Laden fehlgeschlagen' }).waitFor();
  assert.equal(await manager.getByRole('heading', { name: 'Ihre erste Bewerbung beginnt hier' }).count(), 0);
  await manager.getByRole('button', { name: 'Erneut versuchen' }).click();
  await manager.getByRole('heading', { name: 'Ihre erste Bewerbung beginnt hier' }).waitFor();
  assert.deepEqual(state.errors, []);
});

test('standalone letters transfer to applications and stored data remains usable after expiry', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await page.getByRole('tab', { name: 'AI Motivationsschreiben', exact: true }).click();
  const tool = page.getByRole('tabpanel', { name: 'AI Motivationsschreiben', exact: true });
  await tool.getByLabel('Stelle (optional)', { exact: true }).fill('Beratung');
  await tool.getByLabel('Unternehmen (optional)', { exact: true }).fill('Transfer AG');
  await tool.getByLabel(/^Stellenanzeige/).fill('Ein Inserat für die Beratung.');
  await tool.getByRole('button', { name: 'Erstellen', exact: true }).click();
  await tool.getByRole('article').filter({ hasText: 'Transfer AG' }).waitFor();
  await tool.getByRole('button', { name: 'Bearbeiten', exact: true }).click();
  assert.equal(state.records.length, 0);
  await page.getByRole('tab', { name: 'Bewerbungsmanager', exact: true }).click();
  await page.getByRole('tab', { name: 'AI Motivationsschreiben', exact: true }).click();
  assert.match(await tool.getByLabel('Schreiben bearbeiten', { exact: true }).inputValue(), /Transfer AG/);
  await tool.getByRole('button', { name: 'Bewerbung speichern', exact: true }).click();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor();
  assert.equal(state.records.length, 1);
  await page.getByRole('tab', { name: 'AI Motivationsschreiben', exact: true }).click();
  assert.equal(await tool.getByLabel('Unternehmen (optional)', { exact: true }).inputValue(), '');
  await page.getByRole('tab', { name: 'Bewerbungsmanager', exact: true }).click();
  state.paid = false;
  await page.reload();
  await manager.getByRole('button').filter({ hasText: 'Transfer AG' }).click();
  await manager.getByRole('button', { name: 'Abo aktivieren', exact: true }).waitFor();
  await manager.getByRole('button', { name: 'Öffnen', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Text', exact: true }).click();
  assert.equal(await page.getByRole('dialog').getByLabel('Gespeichertes Schreiben', { exact: true }).getAttribute('readonly'), '');
  await closeLetter(manager);
  assert.equal(await manager.getByLabel('Unternehmen *', { exact: true }).isDisabled(), true);
  assert.equal(await manager.getByRole('button', { name: 'Mit KI auslesen', exact: true }).isDisabled(), true);
  const download = page.waitForEvent('download');
  await manager.getByRole('button', { name: 'Word herunterladen', exact: true }).click();
  await download;
  assert.equal(state.words[0].applicationId, state.records[0].id);
  assert.match(state.records[0].motivation_letter, /Transfer AG/);
  const exportDownload = page.waitForEvent('download');
  await manager.getByRole('button', { name: 'Daten exportieren' }).click();
  const exported = await exportDownload;
  assert.equal(exported.suggestedFilename(), 'cvolution-bewerbungen.xlsx');
  assert.equal(state.generations.length, 1);
  await manager.getByRole('button', { name: 'Bewerbung erfassen', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  page.once('dialog', (dialog) => dialog.accept());
  await manager.getByRole('button', { name: 'Löschen', exact: true }).click();
  await manager.getByRole('heading', { name: 'Ihre erste Bewerbung beginnt hier' }).waitFor();
  assert.equal(state.records.length, 0);
  assert.deepEqual(state.errors, []);
});

test('advert link extraction fills a reviewable draft and preserves notes', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await manager.getByRole('button', { name: 'Bewerbung erfassen', exact: true }).click();
  await manager.getByLabel('Notizen', { exact: true }).fill('Eigene Notizen bleiben erhalten');
  await manager.getByLabel('Link zum Stelleninserat', { exact: true }).fill('https://example.test/job');
  await manager.getByRole('button', { name: 'Mit KI auslesen', exact: true }).click();
  await page.waitForFunction(() => document.getElementById('application-company')?.value === 'Import AG');
  assert.equal(await manager.getByLabel('Stellenbezeichnung *', { exact: true }).inputValue(), 'Teamleitung');
  await manager.getByRole('button', { name: 'Schreiben erstellen', exact: true }).click();
  assert.equal(await page.getByRole('dialog').getByLabel('Ansprechperson (optional)', { exact: true }).inputValue(), 'Frau Beispiel');
  await closeLetter(manager);
  assert.equal(await manager.getByLabel('Notizen', { exact: true }).inputValue(), 'Eigene Notizen bleiben erhalten');
  assert.equal(state.records.length, 0, 'Import must not save before review');
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByRole('button').filter({ hasText: 'Teamleitung' }).click();
  assert.equal(await manager.getByRole('link', { name: 'example.test' }).getAttribute('href'), 'https://example.test/job');
  assert.match(state.records[0].motivation_form.jobAd, /Importierter Inserattext/);
  page.once('dialog', (dialog) => dialog.dismiss());
  await manager.getByRole('button', { name: 'Erneut auslesen', exact: true }).click();
  assert.equal(state.extractions.length, 1, 'Rejecting replacement must not call AI');
  page.once('dialog', (dialog) => dialog.accept());
  await manager.getByRole('button', { name: 'Erneut auslesen', exact: true }).click();
  await manager.getByRole('button', { name: 'Erneut auslesen', exact: true }).waitFor();
  assert.equal(state.extractions.length, 2);
  await manager.getByRole('button', { name: 'Link ändern', exact: true }).click();
  assert.equal(await manager.getByLabel('Link zum Stelleninserat', { exact: true }).inputValue(), 'https://example.test/job');
  assert.equal(await manager.getByLabel('Notizen', { exact: true }).inputValue(), 'Eigene Notizen bleiben erhalten');
  assert.deepEqual(state.errors, []);
});

test('failed advert imports keep inputs and permit manual entry', options, async (t) => {
  const { manager, state } = await fixture(t);
  await manager.getByRole('button', { name: 'Bewerbung erfassen', exact: true }).click();
  await manager.getByLabel('Link zum Stelleninserat', { exact: true }).fill('https://example.test/protected');
  state.failExtract = true;
  await manager.getByRole('button', { name: 'Mit KI auslesen', exact: true }).click();
  await manager.getByRole('alert').filter({ hasText: 'Bitte erfassen Sie die Angaben manuell' }).waitFor();
  assert.equal(await manager.getByLabel('Link zum Stelleninserat', { exact: true }).inputValue(), 'https://example.test/protected');
  await manager.getByLabel('Unternehmen *', { exact: true }).fill('Manuell AG');
  await manager.getByLabel('Stellenbezeichnung *', { exact: true }).fill('Beratung');
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor();
  assert.equal(state.records[0].company, 'Manuell AG');
});

test('subscription expiry during editing blocks saving and opens the subscription dialog', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await create(manager);
  state.paid = false;
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await page.getByRole('dialog').waitFor();
  assert.equal(state.records.length, 0);
  await page.keyboard.press('Escape');
  assert.equal(await manager.getByLabel('Unternehmen *', { exact: true }).inputValue(), 'Muster AG');
});

test('standalone advert-only letters still download without creating an application', options, async (t) => {
  const { page, state } = await fixture(t);
  await page.getByRole('tab', { name: 'AI Motivationsschreiben', exact: true }).click();
  const tool = page.getByRole('tabpanel', { name: 'AI Motivationsschreiben', exact: true });
  await tool.getByLabel(/^Stellenanzeige/).fill('Gesucht wird eine Person für die Beratung.');
  await tool.getByRole('button', { name: 'Erstellen', exact: true }).click();
  await tool.getByRole('article').waitFor();
  const download = page.waitForEvent('download', { timeout: 5000 });
  await tool.getByRole('button', { name: 'Word', exact: true }).click();
  await download;
  assert.equal(state.words[0].applicationId, undefined);
  assert.equal(state.records.length, 0);
});

test('internal site navigation warns before discarding unsaved application input', options, async (t) => {
  const { page, manager } = await fixture(t);
  await create(manager);
  let warned = false;
  page.once('dialog', async (dialog) => { warned = true; await dialog.dismiss(); });
  await page.getByRole('link', { name: 'Home', exact: true }).first().click();
  assert.ok(warned, 'Leaving through the site navigation must confirm unsaved changes');
  assert.equal(new URL(page.url()).pathname, '/dashboard/bewerbungen/neu');
  assert.equal(await manager.getByLabel('Unternehmen *', { exact: true }).inputValue(), 'Muster AG');
});

test('detail views have their own URL, follow browser history and survive a reload', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  assert.equal(new URL(page.url()).pathname, '/dashboard/bewerbungen');
  await create(manager);
  assert.equal(new URL(page.url()).pathname, '/dashboard/bewerbungen/neu');
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor();
  assert.equal(new URL(page.url()).pathname, '/dashboard/bewerbungen');
  const detail = `/dashboard/bewerbungen/${state.records[0].id}`;
  await manager.getByRole('button').filter({ hasText: 'Projektleitung' }).click();
  await manager.getByLabel('Unternehmen *', { exact: true }).waitFor();
  assert.equal(new URL(page.url()).pathname, detail);
  assert.equal(await manager.getByRole('group', { name: 'Bewerbungen filtern' }).count(), 0, 'The overview is hidden in the detail view');
  await page.goBack();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor();
  await page.goForward();
  await manager.getByLabel('Unternehmen *', { exact: true }).waitFor();
  await page.reload();
  await manager.getByLabel('Unternehmen *', { exact: true }).waitFor();
  assert.equal(await manager.getByLabel('Unternehmen *', { exact: true }).inputValue(), 'Muster AG');
  await page.getByRole('tab', { name: 'CV Self-Service', exact: true }).click();
  assert.equal(new URL(page.url()).pathname, '/dashboard');
  await page.getByRole('tab', { name: 'Bewerbungsmanager', exact: true }).click();
  assert.equal(new URL(page.url()).pathname, detail, 'Returning to the tab keeps the open application');
  await manager.getByRole('button', { name: 'Übersicht', exact: true }).click();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor();
  assert.equal(new URL(page.url()).pathname, '/dashboard/bewerbungen');
  await page.goto(`${baseUrl}/dashboard/bewerbungen/${randomUUID()}`);
  await manager.getByRole('alert').filter({ hasText: 'Diese Bewerbung wurde nicht gefunden.' }).waitFor();
  assert.equal(new URL(page.url()).pathname, '/dashboard/bewerbungen');
  assert.equal((await page.goto(`${baseUrl}/dashboard/unbekannt`)).status(), 404);
  assert.deepEqual(state.errors, []);
});

test('filter chips count and filter open and due applications', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  const base = { status: 'sent', applied_at: null, deadline: null, next_action: '', notes: '', motivation_letter: '', user_id: owner, created_at: '2026-11-01T00:00:00Z', updated_at: '2026-11-01T00:00:00Z' };
  const row = (id, job, patch) => ({ ...base, id, company: 'Filter AG', job_title: job, next_action_at: null, motivation_form: { applicationType: 'reactive', jobTitle: job, company: 'Filter AG', companyStreet: '', companyPostalCode: '', companyCity: '', recipient: '', jobAd: '', jobAdUrl: '', language: 'de-CH' }, ...patch });
  state.records = [row(randomUUID(), 'Fällige Stelle', { next_action_at: '2020-01-01' }), row(randomUUID(), 'Offene Stelle', {}), row(randomUUID(), 'Abgesagte Stelle', { status: 'rejected' })];
  await manager.getByRole('button', { name: 'Bewerbungen aktualisieren' }).click();
  await manager.getByRole('button', { name: 'Alle (3)', exact: true }).waitFor();
  await manager.getByRole('button', { name: 'Offen (2)', exact: true }).click();
  assert.equal(await manager.getByRole('listitem').count(), 2);
  await manager.getByRole('button', { name: 'Absagen (1)', exact: true }).click();
  assert.equal(await manager.getByRole('listitem').count(), 1);
  await manager.getByRole('listitem').filter({ hasText: 'Abgesagte Stelle' }).waitFor();
  await manager.getByLabel('Bewerbungen durchsuchen').fill('Offene Stelle');
  await manager.getByRole('heading', { name: 'Keine passenden Bewerbungen' }).waitFor();
  await manager.getByRole('button', { name: 'Filter zurücksetzen', exact: true }).click();
  assert.equal(await manager.getByRole('listitem').count(), 3);
  assert.equal(await manager.getByRole('button', { name: 'Alle (3)', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.deepEqual(state.errors, []);
});

test('date fields use Swiss formatting, validate input and retain calendar selection', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await create(manager);
  await closeLetter(manager);
  await manager.getByLabel('Versendet am', { exact: true }).fill('03.11.2026');
  await manager.getByRole('button', { name: 'Versendet', exact: true, pressed: true }).waitFor();
  await manager.getByLabel('Gespräch 1 am', { exact: true }).fill('30112026');
  await manager.getByLabel('Nächste Aktion am', { exact: true }).fill('17.11.2026');
  assert.equal(await manager.getByLabel('Gespräch 1 am', { exact: true }).inputValue(), '30.11.2026');
  await manager.getByRole('button', { name: 'Kalender: Nächste Aktion am', exact: true }).click();
  const calendar = page.getByRole('dialog', { name: 'Datum auswählen: Nächste Aktion am', exact: true });
  await calendar.getByRole('button', { name: /18\. November 2026/ }).click();
  assert.equal(await manager.getByLabel('Nächste Aktion am', { exact: true }).inputValue(), '18.11.2026');
  await manager.getByLabel('Gespräch 1 am', { exact: true }).fill('31.11.2026');
  assert.equal(await manager.getByLabel('Gespräch 1 am', { exact: true }).evaluate((input) => input.checkValidity()), false);
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  assert.equal(state.records.length, 0);
  await manager.getByLabel('Gespräch 1 am', { exact: true }).fill('30.11.2026');
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByLabel('Bewerbungen durchsuchen').waitFor();
  assert.equal(state.records[0].applied_at, '2026-11-03');
  assert.equal(state.records[0].deadline, '2026-11-30');
  assert.equal(state.records[0].next_action_at, '2026-11-18');
  await page.reload();
  await manager.getByRole('button').filter({ hasText: 'Projektleitung' }).click();
  assert.equal(await manager.getByLabel('Versendet am', { exact: true }).inputValue(), '03.11.2026');
  await manager.getByLabel('Nächste Aktion am', { exact: true }).fill('');
  await page.waitForFunction(() => document.getElementById('application-next-date')?.value === '', undefined, { timeout: 3000 });
  assert.equal(await manager.getByLabel('Nächste Aktion am', { exact: true }).inputValue(), '');
  await manager.getByRole('status').filter({ hasText: 'Ungespeicherte Änderungen' }).waitFor();
  const cleared = page.waitForResponse((response) => response.url().includes('/api/applications/') && response.request().method() === 'PUT');
  await save(manager);
  await cleared;
  assert.equal(state.records[0].next_action_at, null);
  await page.setViewportSize({ width: 375, height: 900 });
  await manager.getByRole('button', { name: 'Kalender: Gespräch 1 am', exact: true }).click();
  const bounds = await page.getByRole('dialog', { name: 'Datum auswählen: Gespräch 1 am', exact: true }).boundingBox();
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 375);
  await page.keyboard.press('Escape');
  assert.deepEqual(state.errors, []);
});

test('calendar month navigation keeps its height, placement and page scroll stable', options, async (t) => {
  const { page, manager } = await fixture(t);
  await create(manager);
  await manager.getByLabel('Nächste Aktion am', { exact: true }).fill('23.02.2027');
  const trigger = manager.getByRole('button', { name: 'Kalender: Nächste Aktion am', exact: true });
  const calendar = page.getByRole('dialog', { name: 'Datum auswählen: Nächste Aktion am', exact: true });
  await trigger.click();
  const measured = await calendar.boundingBox();
  await page.keyboard.press('Escape');
  // Place the field where February fits below it but a taller month would flip above it.
  const button = await trigger.boundingBox();
  await page.evaluate(({ height, buttonHeight }) => {
    const field = document.getElementById('application-next-date');
    window.scrollBy(0, field.getBoundingClientRect().top - (innerHeight - height - buttonHeight - 16));
  }, { height: measured.height, buttonHeight: button.height });
  await trigger.click();
  const initial = await calendar.boundingBox();
  const initialSide = await calendar.getAttribute('data-side');
  const initialScroll = await page.evaluate(() => scrollY);
  for (const [direction, caption] of [
    ['Next', 'März 2027'], ['Next', 'April 2027'], ['Next', 'Mai 2027'],
    ['Previous', 'April 2027'], ['Previous', 'März 2027'], ['Previous', 'Februar 2027'],
  ]) {
    await calendar.getByRole('button', { name: new RegExp(`Go to the ${direction} Month`, 'i') }).click();
    await calendar.getByText(caption, { exact: true }).waitFor();
    await page.waitForFunction((side) => document.querySelector('[role="dialog"][data-side]')?.getAttribute('data-side') === side, initialSide, { timeout: 1500 });
    const bounds = await calendar.boundingBox();
    assert.ok(Math.abs(bounds.height - initial.height) <= 1, `Calendar height changed in ${caption}`);
    assert.ok(Math.abs(bounds.y - initial.y) <= 1, `Calendar moved in ${caption}`);
    assert.ok(Math.abs((await page.evaluate(() => scrollY)) - initialScroll) <= 1, `Page scrolled in ${caption}`);
  }
  await page.keyboard.press('Escape');
});

test('responsive layouts, labels, focus and document ids remain usable', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await create(manager, 'Unternehmen'.repeat(10), 'Projektleitung'.repeat(8));
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByRole('button').filter({ hasText: 'Projektleitung'.repeat(8) }).click();
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Detail overflows at ${width}px`);
    assert.deepEqual(await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    }), []);
    const unlabelled = await manager.locator('input,textarea,select').evaluateAll((elements) => elements.filter((element) => element.getAttribute('aria-hidden') !== 'true' && element.type !== 'hidden' && !element.labels?.length && !element.getAttribute('aria-label')).map((element) => element.id));
    assert.deepEqual(unlabelled, []);
  }
  await manager.getByRole('button', { name: 'Übersicht', exact: true }).click();
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `List overflows at ${width}px`);
    if (process.env.APPLICATIONS_SCREENSHOT_DIR) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `${process.env.APPLICATIONS_SCREENSHOT_DIR}/applications-${width}.png`, fullPage: true });
    }
  }
  await manager.getByRole('button', { name: 'Bewerbung erfassen', exact: true }).focus();
  await page.keyboard.press('Enter');
  await manager.getByRole('heading', { name: 'Neue Bewerbung erfassen' }).waitFor();
  await page.waitForFunction(() => document.activeElement?.tagName === 'H2' && document.activeElement.textContent === 'Neue Bewerbung erfassen');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'application-job-url');
  assert.deepEqual(state.errors, []);
});
