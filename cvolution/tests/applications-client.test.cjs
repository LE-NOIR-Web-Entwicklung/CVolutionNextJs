/* eslint-disable @typescript-eslint/no-require-imports -- Isolates the authenticated client boundary without a live Supabase session. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const { test, beforeEach, after } = require('node:test');
const ts = require('typescript');

const originalLoad = Module._load;
const originalTs = Module._extensions['.ts'];
const originalFetch = global.fetch;
const originalDocument = global.document;
const originalCreateURL = URL.createObjectURL;
const originalRevokeURL = URL.revokeObjectURL;
let session, responses, requests, exportBlob, clicked, removed, revoked;
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename,
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, inlineSourceMap: true, inlineSources: true },
}).outputText, filename);
Module._load = function(request, parent, isMain) {
  if (request === '@/integrations/supabase/client') return { supabase: { auth: { getSession: async () => ({ data: { session } }) } } };
  return originalLoad.call(this, request, parent, isMain);
};
global.fetch = async (url, options) => { requests.push({ url, ...options }); return responses.shift(); };
const client = require('../src/lib/applications-client.ts');
const domain = require('../src/lib/applications.ts');
const valid = () => ({ ...domain.emptyApplication(), company: 'Muster AG', job_title: 'Beratung' });
const json = (data, status = 200) => Response.json(data, { status });
beforeEach(() => { session = { access_token: 'fixture-token' }; responses = []; requests = []; clicked = false; removed = false; revoked = false; });
after(() => {
  Module._load = originalLoad;
  if (originalTs) Module._extensions['.ts'] = originalTs; else delete Module._extensions['.ts'];
  global.fetch = originalFetch;
  if (originalDocument === undefined) delete global.document; else global.document = originalDocument;
  URL.createObjectURL = originalCreateURL;
  URL.revokeObjectURL = originalRevokeURL;
});

test('missing sessions stop every client operation before a request is sent', async () => {
  session = null;
  await assert.rejects(client.loadApplications(), /erneut an/);
  await assert.rejects(client.saveApplication(valid(), null), /erneut an/);
  await assert.rejects(client.deleteApplication('id'), /erneut an/);
  await assert.rejects(client.extractApplication('https://example.test/job'), /erneut an/);
  assert.equal(requests.length, 0);
});

test('extraction sends the advert URL and preserves subscription errors for the UI', async () => {
  responses = [json({ extraction: { company: 'Muster AG' } }), json({ error: 'Abo erforderlich' }, 402)];
  assert.equal((await client.extractApplication('https://example.test/job')).company, 'Muster AG');
  assert.equal(requests[0].url, '/api/applications/extract');
  assert.deepEqual(JSON.parse(requests[0].body), { url: 'https://example.test/job' });
  await assert.rejects(client.extractApplication('https://example.test/job'), (error) => error instanceof client.ApplicationRequestError && error.status === 402);
});

test('loading combines pages, authenticates requests and forwards cancellation', async () => {
  responses = [json({ applications: [{ id: 'a' }], nextOffset: 100 }), json({ applications: [{ id: 'b' }], nextOffset: null })];
  const controller = new AbortController();
  assert.deepEqual(await client.loadApplications(controller.signal), [{ id: 'a' }, { id: 'b' }]);
  assert.equal(requests[1].url, '/api/applications?offset=100');
  assert.equal(requests[0].headers.Authorization, 'Bearer fixture-token');
  assert.equal(requests[0].cache, 'no-store');
  assert.equal(requests[0].signal, controller.signal);
});

test('creation and update validate data and send the last saved version', async () => {
  responses = [json({ application: { id: 'created' } }), json({ application: { id: 'updated' } })];
  assert.equal((await client.saveApplication(valid(), null)).id, 'created');
  assert.equal(requests[0].method, 'POST');
  assert.equal(JSON.parse(requests[0].body).motivation_form.company, 'Muster AG');
  assert.equal((await client.saveApplication(valid(), { id: 'saved-id', updated_at: '2026-11-03T10:00:00Z' })).id, 'updated');
  assert.equal(requests[1].method, 'PUT');
  assert.equal(requests[1].url, '/api/applications/saved-id');
  assert.equal(JSON.parse(requests[1].body).expected_updated_at, '2026-11-03T10:00:00Z');
  await assert.rejects(client.saveApplication({ ...valid(), company: '' }, null));
  assert.equal(requests.length, 2);
});

test('errors remain actionable and deletion handles an empty successful response', async () => {
  responses = [json({ error: 'Speicherkonflikt' }, 409), new Response('<html>Unavailable</html>', { status: 503 }), new Response(null, { status: 204 })];
  await assert.rejects(client.saveApplication(valid(), null), /Speicherkonflikt/);
  await assert.rejects(client.loadApplications(), /erneut/);
  await client.deleteApplication('saved-id');
  assert.equal(requests[2].method, 'DELETE');
});

test('data export contains all saved content and cleans up its temporary download', async () => {
  URL.createObjectURL = (blob) => { exportBlob = blob; return 'blob:fixture'; };
  URL.revokeObjectURL = (url) => { revoked = url === 'blob:fixture'; };
  const link = { click() { clicked = true; }, remove() { removed = true; } };
  global.document = { createElement: () => link, body: { appendChild() {} } };
  const rows = [{ ...valid(), motivation_letter: 'Absatz eins.\n\nAbsatz zwei.' }];
  client.downloadApplications(rows);
  const exported = JSON.parse(await exportBlob.text());
  assert.deepEqual(exported.applications, rows);
  assert.ok(Number.isFinite(Date.parse(exported.exported_at)));
  assert.equal(link.download, 'cvolution-bewerbungen.json');
  assert.ok(clicked && removed && revoked);
});
