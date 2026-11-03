/* eslint-disable @typescript-eslint/no-require-imports -- Isolated route, DNS and HTTP fixtures; no live AI or website requests. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const { EventEmitter } = require('node:events');
const { PassThrough } = require('node:stream');
const { test, beforeEach, after } = require('node:test');
const ts = require('typescript');

const originalLoad = Module._load;
const originalTs = Module._extensions['.ts'];
const originalKey = process.env.ANTHROPIC_API_KEY;
const jobUrl = 'https://careers.example.test/job';
let profile, pages, requests, payloads, dnsAddress, modelStatus, modelBody, modelError, hangModel, importAllowed, importLimitError;
const extracted = () => ({ company: 'Muster AG', job_title: 'Projektleitung', recipient: 'Frau Beispiel', company_street: 'Musterweg 1', company_postal_code: '8000', company_city: 'Zürich', deadline: '2026-12-15' });

function mockRequest(url, options, callback) {
  const req = new EventEmitter();
  let body = '';
  req.write = (chunk) => { body += chunk; };
  req.destroy = (error) => { if (error) queueMicrotask(() => req.emit('error', error)); return req; };
  req.end = () => queueMicrotask(() => {
    const send = () => {
      const address = String(url);
      requests.push(address);
      const model = new URL(url).hostname === 'api.anthropic.com';
      if (model) payloads.push(JSON.parse(body));
      if (model && hangModel) return;
      if (model && modelError) { req.destroy(new Error('Private provider failure')); return; }
      const page = model ? { status: modelStatus, body: typeof modelBody === 'string' ? modelBody : JSON.stringify(modelBody) } : pages.get(address) || { status: 404, body: '' };
      const response = new PassThrough();
      response.statusCode = page.status;
      response.headers = { 'content-type': 'text/html', ...page.headers };
      callback(response);
      queueMicrotask(() => response.end(page.body));
    };
    if (options.lookup) options.lookup(new URL(url).hostname, {}, (error) => error ? req.destroy(error) : send());
    else send();
  });
  return req;
}

Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename,
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, inlineSourceMap: true, inlineSources: true },
}).outputText, filename);
Module._load = function(request, parent, isMain) {
  if (request.endsWith('supabase-server')) return { supabaseAdmin: {
    auth: { getUser: async (token) => ({ data: { user: token === 'valid' ? { id: 'owner' } : null }, error: null }) },
    async rpc(name, args) {
      assert.equal(name, 'claim_application_import');
      assert.deepEqual(args, { p_user_id: 'owner' });
      return { data: importAllowed, error: importLimitError };
    },
    from(table) {
      assert.equal(table, 'profiles', 'Extraction must not load the CV or other user data');
      const query = { select() { return query; }, eq(key, value) { assert.equal(key, 'user_id'); assert.equal(value, 'owner'); return query; }, single: async () => ({ data: profile, error: null }) };
      return query;
    },
  } };
  if (request === 'node:https' || request === 'node:http') return { request: mockRequest };
  if (request === 'node:dns') return { lookup: (_host, _options, callback) => callback(null, dnsAddress, 4) };
  return originalLoad.call(this, request, parent, isMain);
};
after(() => {
  Module._load = originalLoad;
  if (originalTs) Module._extensions['.ts'] = originalTs; else delete Module._extensions['.ts'];
  if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = originalKey;
});
beforeEach(() => {
  profile = { paid: true, subscription_current_period_end: '2099-01-01', subscription_status: 'active' };
  pages = new Map([[jobUrl, { status: 200, body: '<main>Muster AG sucht eine Projektleitung. Frau Beispiel, Musterweg 1, 8000 Zürich. Bewerbungsfrist: 15. Dezember 2026. Sie leiten Beratungsprojekte und koordinieren ein Team.</main>' }]]);
  requests = []; payloads = []; dnsAddress = '93.184.216.34'; modelStatus = 200; modelError = false; hangModel = false; importAllowed = true; importLimitError = null;
  modelBody = { stop_reason: 'tool_use', content: [{ type: 'tool_use', name: 'extract_job_ad', input: extracted() }] };
  process.env.ANTHROPIC_API_KEY = 'fixture-key-no-live-requests';
});
function extract(body = { url: jobUrl }, token = 'valid') {
  const { POST } = require('../src/app/api/applications/extract/route.ts');
  return POST(new Request('https://example.test/api/applications/extract', {
    method: 'POST', headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }));
}

test('only authenticated subscribers can cause website or AI requests', async () => {
  assert.equal((await extract(undefined, '')).status, 401);
  assert.equal((await extract(undefined, 'invalid')).status, 401);
  profile.paid = false; profile.subscription_status = 'inactive';
  assert.equal((await extract()).status, 402);
  profile.paid = true; profile.subscription_current_period_end = '2000-01-01';
  assert.equal((await extract()).status, 402);
  assert.equal(requests.length, 0);
});

test('rapid repeated imports are rejected before website and AI requests', async () => {
  importAllowed = false;
  const response = await extract();
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '10');
  assert.equal(requests.length, 0);
  importLimitError = { message: 'Private database details' };
  assert.equal((await extract()).status, 500);
  assert.equal(requests.length, 0);
});

test('public advert data becomes a reviewable draft without loading personal CV data', async () => {
  const response = await extract();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Cache-Control'), /no-store/);
  const { extraction } = await response.json();
  assert.equal(extraction.company, 'Muster AG');
  assert.equal(extraction.job_title, 'Projektleitung');
  assert.equal(extraction.deadline, '2026-12-15');
  assert.equal(extraction.motivation_form.recipient, 'Frau Beispiel');
  assert.equal(extraction.motivation_form.companyStreet, 'Musterweg 1');
  assert.equal(extraction.motivation_form.jobAdUrl, jobUrl);
  assert.match(extraction.motivation_form.jobAd, /Beratungsprojekte/);
  assert.equal(payloads.length, 1);
  assert.match(payloads[0].system, /keine.*(?:Anweisungen|Instruktionen)/i);
  assert.ok(payloads[0].tools[0].input_schema.properties.deadline);
});

test('missing facts remain empty and missing deadlines remain null', async () => {
  modelBody.content[0].input = { ...extracted(), company: '', recipient: '', company_street: '', company_postal_code: '', company_city: '', deadline: null };
  const { extraction } = await (await extract()).json();
  assert.equal(extraction.company, '');
  assert.equal(extraction.deadline, null);
  assert.equal(extraction.motivation_form.companyStreet, '');
});

test('structured advert deadlines and contacts are retained in the AI source', async () => {
  pages.set(jobUrl, { status: 200, body: `<script type="application/ld+json">${JSON.stringify({ '@type': 'JobPosting', title: 'Projektleitung', hiringOrganization: { name: 'Muster AG' }, applicationContact: { name: 'Frau Beispiel' }, validThrough: '2026-12-15', description: 'Sie übernehmen die Projektleitung für die Beratung und koordinieren ein Team mit vielen verschiedenen Aufgaben und Kundenprojekten.' })}</script>` });
  assert.equal((await extract()).status, 200);
  const source = payloads[0].messages[0].content;
  assert.match(source, /Bewerbungsfrist.*2026-12-15/);
  assert.match(source, /Frau Beispiel/);
});

test('invalid request bodies and unsafe URLs never cause external requests', async () => {
  for (const body of ['{broken', {}, { url: 123 }, { url: 'x'.repeat(501) }, { url: jobUrl, paid: true }, { url: 'javascript:alert(1)' }, { url: 'http://127.0.0.1/private' }, { url: 'https://user:secret@example.test' }]) {
    assert.equal((await extract(body)).status, 400);
  }
  assert.equal(requests.length, 0);
});

test('redirects and DNS resolution cannot access private networks', async () => {
  pages.set(jobUrl, { status: 302, headers: { location: 'http://169.254.169.254/metadata' }, body: '' });
  assert.equal((await extract()).status, 422);
  assert.ok(requests.every((url) => !url.includes('169.254')));
  assert.equal(payloads.length, 0);
  requests = []; dnsAddress = '127.0.0.1';
  assert.equal((await extract()).status, 422);
  assert.equal(requests.length, 0);
});

test('unreadable pages and missing AI configuration return actionable errors without calling AI', async () => {
  pages.set(jobUrl, { status: 403, body: '' });
  const response = await extract();
  assert.equal(response.status, 422);
  assert.match((await response.json()).error, /manuell/i);
  assert.equal(payloads.length, 0);
  delete process.env.ANTHROPIC_API_KEY;
  assert.equal((await extract()).status, 500);
});

test('invalid, truncated and overlong AI output is rejected rather than saved', async () => {
  for (const input of [
    { ...extracted(), company: 'a'.repeat(141) }, { ...extracted(), deadline: '2026-02-30' },
    { ...extracted(), deadline: '15.12.2026' }, { ...extracted(), recipient: [] },
    { ...extracted(), user_id: 'injected' }, { company: 'Missing fields' },
    { ...extracted(), company: '', job_title: '' },
  ]) {
    modelBody = { stop_reason: 'tool_use', content: [{ type: 'tool_use', name: 'extract_job_ad', input }] };
    assert.equal((await extract()).status, 502);
  }
  modelBody = { stop_reason: 'max_tokens', content: [{ type: 'tool_use', name: 'extract_job_ad', input: extracted() }] };
  assert.equal((await extract()).status, 502);
  modelBody = 'not JSON';
  assert.equal((await extract()).status, 502);
});

test('AI requests have an absolute timeout', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  hangModel = true;
  const pending = extract();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(payloads.length, 1);
  t.mock.timers.tick(30001);
  assert.equal((await pending).status, 502);
});

test('provider failures and oversized responses are bounded and do not expose private errors', async () => {
  modelStatus = 429; modelBody = { error: { message: 'Private provider failure' } };
  let response = await extract();
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /Private provider/);
  modelStatus = 200; modelBody = 'x'.repeat(100001);
  assert.equal((await extract()).status, 502);
  modelError = true;
  response = await extract();
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /Private provider/);
});
