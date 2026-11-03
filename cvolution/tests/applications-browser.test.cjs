/* eslint-disable @typescript-eslint/no-require-imports -- Optional Playwright journey tests against a local production build, with all user/API data intercepted. */
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');

const baseUrl = process.env.APPLICATIONS_BROWSER_URL;
const owner = '11111111-1111-4111-8111-111111111111';
const options = { skip: !baseUrl, timeout: 60000 };

async function fixture(t) {
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(baseUrl).hostname), 'Only an isolated local server is allowed');
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined, headless: true });
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const state = { records: [], paid: true, failSave: false, failLoad: false, words: [], generations: [], errors: [] };
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
  const manager = page.getByRole('tabpanel', { name: 'Bewerbungen', exact: true });
  await manager.getByRole('heading', { name: 'Ihre erste Bewerbung beginnt hier' }).waitFor();
  return { page, manager, state };
}

async function create(manager, company = 'Muster AG', job = 'Projektleitung') {
  await manager.getByRole('button', { name: 'Bewerbung erfassen', exact: true }).click();
  await manager.getByLabel('Unternehmen *', { exact: true }).fill(company);
  await manager.getByLabel('Stellenbezeichnung *', { exact: true }).fill(job);
  await manager.getByLabel(/^Stellenanzeige/).fill('Gesucht wird eine erfahrene Person für Beratung und Projektleitung.');
}

async function save(manager) {
  await manager.getByRole('button', { name: 'Bewerbung speichern', exact: true }).first().click();
  await manager.getByRole('status').filter({ hasText: 'Alle Änderungen gespeichert' }).waitFor();
}

test('application journey saves separate letters, survives refresh and reuses the CV export', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await create(manager);
  await manager.getByLabel('Wiedervorlage am').fill('2026-11-02');
  await manager.getByLabel('Nächster Schritt', { exact: true }).fill('Nachfassen');
  await manager.getByRole('button', { name: 'Erstellen', exact: true }).click();
  await manager.getByRole('status').filter({ hasText: 'Alle Änderungen gespeichert' }).waitFor();
  assert.equal(state.records.length, 1);
  await manager.getByLabel('Schreiben bearbeiten', { exact: true }).fill('Mein bearbeiteter Brief.\n\nZweiter Absatz.');
  await manager.getByLabel('Status', { exact: true }).selectOption('sent');
  await save(manager);
  await page.getByRole('tab', { name: 'CV Self-Service', exact: true }).click();
  await page.getByRole('tab', { name: 'Bewerbungen', exact: true }).click();
  assert.equal(await manager.getByLabel('Schreiben bearbeiten', { exact: true }).inputValue(), 'Mein bearbeiteter Brief.\n\nZweiter Absatz.');
  await manager.getByRole('button', { name: 'Aktuellen CV exportieren' }).click();
  await page.getByRole('dialog').getByRole('heading', { name: 'CV Exportieren' }).waitFor();
  await page.getByRole('dialog').getByRole('button', { name: 'Abbrechen' }).click();
  await page.reload();
  await manager.getByRole('button').filter({ hasText: 'Projektleitung' }).click();
  assert.equal(await manager.getByLabel('Schreiben bearbeiten', { exact: true }).inputValue(), 'Mein bearbeiteter Brief.\n\nZweiter Absatz.');
  await manager.getByRole('button', { name: 'Übersicht', exact: true }).click();
  await create(manager, 'Zweite AG', 'Beratung');
  await manager.getByRole('button', { name: 'Erstellen', exact: true }).click();
  await manager.getByRole('status').filter({ hasText: 'Alle Änderungen gespeichert' }).waitFor();
  assert.equal(state.records.length, 2);
  assert.match(state.records.find((row) => row.company === 'Muster AG').motivation_letter, /bearbeiteter Brief/);
  assert.match(state.records.find((row) => row.company === 'Zweite AG').motivation_letter, /Zweite AG/);
  await manager.getByRole('button', { name: 'Übersicht', exact: true }).click();
  await manager.getByLabel('Bewerbungen durchsuchen').fill('mUsTeR');
  assert.equal(await manager.locator('li').count(), 1);
  await manager.getByLabel('Nach Status filtern').selectOption('rejected');
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
  await save(manager);
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
  await tool.getByLabel('Schreiben bearbeiten', { exact: true }).waitFor();
  assert.equal(state.records.length, 0);
  await page.getByRole('tab', { name: 'Bewerbungen', exact: true }).click();
  await page.getByRole('tab', { name: 'AI Motivationsschreiben', exact: true }).click();
  assert.match(await tool.getByLabel('Schreiben bearbeiten', { exact: true }).inputValue(), /Transfer AG/);
  await tool.getByRole('button', { name: 'Bewerbung speichern', exact: true }).click();
  await manager.getByLabel('Schreiben bearbeiten', { exact: true }).waitFor();
  assert.equal(state.records.length, 1);
  await page.getByRole('tab', { name: 'AI Motivationsschreiben', exact: true }).click();
  assert.equal(await tool.getByLabel('Unternehmen (optional)', { exact: true }).inputValue(), '');
  await page.getByRole('tab', { name: 'Bewerbungen', exact: true }).click();
  state.paid = false;
  await page.reload();
  await manager.getByRole('button').filter({ hasText: 'Transfer AG' }).click();
  await manager.getByRole('button', { name: 'Abo aktivieren', exact: true }).waitFor();
  await manager.getByLabel('Schreiben bearbeiten', { exact: true }).fill('Auch nach Abo-Ende bearbeitbar.');
  const download = page.waitForEvent('download');
  await manager.getByRole('button', { name: 'Word', exact: true }).click();
  await download;
  assert.equal(state.words[0].applicationId, state.records[0].id);
  assert.equal(state.records[0].motivation_letter, 'Auch nach Abo-Ende bearbeitbar.');
  const exportDownload = page.waitForEvent('download');
  await manager.getByRole('button', { name: 'Daten exportieren' }).click();
  const exported = await exportDownload;
  assert.equal(exported.suggestedFilename(), 'cvolution-bewerbungen.json');
  assert.equal(state.generations.length, 1);
  assert.deepEqual(state.errors, []);
});

test('standalone advert-only letters still download without creating an application', options, async (t) => {
  const { page, state } = await fixture(t);
  await page.getByRole('tab', { name: 'AI Motivationsschreiben', exact: true }).click();
  const tool = page.getByRole('tabpanel', { name: 'AI Motivationsschreiben', exact: true });
  await tool.getByLabel(/^Stellenanzeige/).fill('Gesucht wird eine Person für die Beratung.');
  await tool.getByRole('button', { name: 'Erstellen', exact: true }).click();
  await tool.getByLabel('Schreiben bearbeiten', { exact: true }).waitFor();
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
  assert.equal(new URL(page.url()).pathname, '/dashboard');
  assert.equal(await manager.getByLabel('Unternehmen *', { exact: true }).inputValue(), 'Muster AG');
});

test('responsive layouts, labels, focus and document ids remain usable', options, async (t) => {
  const { page, manager, state } = await fixture(t);
  await create(manager, 'Unternehmen'.repeat(10), 'Projektleitung'.repeat(8));
  await save(manager);
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
  assert.equal(await page.locator(':focus').getAttribute('id'), 'application-company');
  assert.deepEqual(state.errors, []);
});
