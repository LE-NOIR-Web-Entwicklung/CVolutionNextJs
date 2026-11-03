/* eslint-disable @typescript-eslint/no-require-imports -- Same isolated TypeScript loader as the existing route tests. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { test, beforeEach, after } = require('node:test');
const ts = require('typescript');

const originalLoad = Module._load;
const originalTs = Module._extensions['.ts'];
const owner = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
let records, databaseError, authError, operations, profile;

function query(table) {
  let operation = 'select', values, start = 0, end = Infinity;
  const filters = [];
  const builder = {
    select() { return builder; },
    order() { return builder; },
    range(from, to) { start = from; end = to; return builder; },
    eq(key, value) { filters.push([key, value]); return builder; },
    insert(value) { operation = 'insert'; values = value; return builder; },
    update(value) { operation = 'update'; values = value; return builder; },
    delete() { operation = 'delete'; return builder; },
    async maybeSingle() { const result = await run(); return { ...result, data: result.data?.[0] || null }; },
    async single() { return builder.maybeSingle(); },
    then(resolve, reject) { return run().then(resolve, reject); },
  };
  async function run() {
    operations.push({ table, operation, filters, values });
    if (databaseError) return { data: null, error: { message: 'private database details' } };
    let data = (table === 'profiles' ? [profile] : records).filter((row) => row && filters.every(([key, value]) => row[key] === value));
    if (operation === 'insert') {
      const row = { ...values, id, created_at: '2026-11-03T10:00:00.000Z', updated_at: '2026-11-03T10:00:00.000Z' };
      records.push(row);
      data = [row];
    } else if (operation === 'update') {
      data = data.map((row) => ({ ...row, ...values, updated_at: '2026-11-03T11:00:00.000Z' }));
      records = records.map((row) => data.find((next) => next.id === row.id) || row);
    } else if (operation === 'delete') {
      records = records.filter((row) => !data.includes(row));
    }
    return { data: data.slice(start, end + 1), error: null };
  }
  return builder;
}

Module._extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, inlineSourceMap: true, inlineSources: true },
  }).outputText, filename);
};
Module._load = function(request, parent, isMain) {
  if (request.endsWith('supabase-server')) return { supabaseAdmin: {
    auth: { getUser: async (token) => ({ data: { user: token === 'valid' ? { id: owner } : null }, error: authError }) },
    from: (table) => query(table),
  } };
  return originalLoad.call(this, request, parent, isMain);
};
after(() => { Module._load = originalLoad; if (originalTs) Module._extensions['.ts'] = originalTs; else delete Module._extensions['.ts']; });
const domain = () => require('../src/lib/applications.ts');
const collection = () => require('../src/app/api/applications/route.ts');
const item = () => require('../src/app/api/applications/[id]/route.ts');
const valid = () => ({ ...domain().emptyApplication(), company: 'Muster AG', job_title: 'Projektleitung' });
const context = (value = id) => ({ params: Promise.resolve({ id: value }) });
function request(body, token = 'valid', method = 'POST', url = 'https://example.test/api/applications') {
  return new Request(url, { method, headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), 'content-type': 'application/json' }, ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }) });
}
beforeEach(() => { records = []; databaseError = false; authError = null; operations = []; profile = { user_id: owner, paid: true, subscription_current_period_end: '2099-01-01', subscription_status: 'active' }; });

test('application defaults are independent and cover every status', () => {
  const first = domain().emptyApplication();
  first.motivation_form.company = 'changed';
  assert.equal(domain().emptyApplication().motivation_form.company, '');
  assert.deepEqual(Object.keys(domain().APPLICATION_STATUSES), ['draft', 'sent', 'interview', 'offer', 'rejected', 'withdrawn']);
});

test('validation normalizes ownership-free data and keeps letter paragraphs', () => {
  const input = { ...valid(), company: ' Muster AG ', motivation_letter: 'Betreff\n\nAbsatz eins.\n\nAbsatz zwei.', motivation_form: { ...valid().motivation_form, company: 'stale', jobTitle: 'stale', jobAdUrl: 'https://example.test/job' } };
  const result = domain().parseApplicationInput(input);
  assert.equal(result.company, 'Muster AG');
  assert.equal(result.motivation_form.company, result.company);
  assert.equal(result.motivation_form.jobTitle, result.job_title);
  assert.equal(result.motivation_letter, input.motivation_letter);
});

test('validation rejects invalid fields, dates, URLs and unexpected ownership', () => {
  for (const patch of [
    { company: '' }, { job_title: ' ' }, { company: 'a'.repeat(141) }, { status: 'admin' },
    { notes: [] }, { notes: 'a'.repeat(5001) }, { user_id: other }, { motivation_letter: 'a'.repeat(12001) },
    { deadline: '2026-02-30' }, { applied_at: '03.11.2026' }, { next_action_at: '2026-13-01' },
    { motivation_form: { ...valid().motivation_form, jobAdUrl: 'javascript:alert(1)' } },
    { motivation_form: { ...valid().motivation_form, jobAdUrl: 'https://user:password@example.test' } },
    { motivation_form: { ...valid().motivation_form, language: 'xx' } },
    { motivation_form: { ...valid().motivation_form, applicationType: 'invalid' } },
    { motivation_form: { ...valid().motivation_form, recipient: 123 } },
    { motivation_form: { ...valid().motivation_form, secret: 'extra' } },
    { motivation_form: null },
  ]) assert.throws(() => domain().parseApplicationInput({ ...valid(), ...patch }), undefined, JSON.stringify(patch).slice(0, 150));
  for (const input of [null, [], 'text']) assert.throws(() => domain().parseApplicationInput(input));
  assert.equal(domain().parseApplicationInput({ ...valid(), deadline: '2028-02-29' }).deadline, '2028-02-29');
});

test('search, status and next-action sorting work with overdue and closed applications', () => {
  const rows = [
    { ...valid(), id: 'a', status: 'sent', next_action_at: '2026-11-10', updated_at: '2026-11-01' },
    { ...valid(), id: 'b', company: 'Andere Firma', status: 'interview', next_action_at: '2026-11-02', updated_at: '2026-11-02' },
    { ...valid(), id: 'c', status: 'rejected', next_action_at: '2026-11-01', updated_at: '2026-11-03' },
  ];
  assert.deepEqual(domain().filterApplications(rows, '', 'all').map((row) => row.id), ['b', 'a', 'c']);
  assert.deepEqual(domain().filterApplications(rows, 'mUsTeR', 'sent').map((row) => row.id), ['a']);
  assert.equal(domain().isActionDue(rows[1], '2026-11-03'), true);
  assert.equal(domain().isActionDue(rows[0], '2026-11-03'), false);
  assert.equal(domain().isActionDue(rows[2], '2026-11-03'), false);
  assert.equal(domain().isActionDue({ ...rows[0], next_action_at: null }, '2026-11-03'), false);
  assert.deepEqual(domain().filterApplications(rows, '', 'all', 'open', '2026-11-03').map((row) => row.id), ['b', 'a']);
  assert.deepEqual(domain().filterApplications(rows, '', 'all', 'due', '2026-11-03').map((row) => row.id), ['b']);
  assert.deepEqual(domain().filterApplications(rows, 'andere', 'all', 'due', '2026-11-03').map((row) => row.id), ['b']);
  assert.deepEqual(domain().filterApplications(rows, '', 'sent', 'due', '2026-11-03').map((row) => row.id), []);
});

test('date-only reminders use Zurich midnight and extracting input drops record metadata', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-11-03T23:30:00Z') });
  assert.equal(domain().todayInZurich(), '2026-11-04');
  const input = valid();
  const record = { ...input, id, user_id: owner, created_at: '2026-11-03', updated_at: '2026-11-03' };
  assert.deepEqual(domain().applicationInput(record), input);
  assert.equal(domain().isActionDue({ ...input, next_action_at: '2026-11-04' }), true);
});

test('all endpoints require a verified bearer token', async () => {
  for (const token of ['', 'invalid']) {
    assert.equal((await collection().GET(request(undefined, token, 'GET'))).status, 401);
    assert.equal((await collection().POST(request(valid(), token))).status, 401);
    assert.equal((await item().PUT(request(valid(), token, 'PUT'), context())).status, 401);
    assert.equal((await item().DELETE(request(undefined, token, 'DELETE'), context())).status, 401);
  }
  assert.equal(operations.length, 0);
});

test('creation enforces ownership and works with an active subscription', async () => {
  const response = await collection().POST(request(valid()));
  assert.equal(response.status, 201);
  const { application } = await response.json();
  assert.equal(application.user_id, owner);
  assert.equal(records.length, 1);
  assert.equal((await collection().POST(request({ ...valid(), user_id: other }))).status, 400);
  assert.equal(records.length, 1);
});

test('creating and updating require an active server-side subscription', async () => {
  for (const state of [
    { paid: false, subscription_status: 'inactive' },
    { subscription_current_period_end: '2000-01-01' },
    { subscription_current_period_end: null },
    { subscription_current_period_end: 'invalid' },
  ]) {
    profile = { user_id: owner, paid: true, subscription_current_period_end: '2099-01-01', subscription_status: 'active', ...state };
    assert.equal((await collection().POST(request(valid()))).status, 402);
    assert.equal((await item().PUT(request({ ...valid(), expected_updated_at: '2026-11-03T10:00:00Z' }, 'valid', 'PUT'), context())).status, 402);
  }
  assert.ok(operations.every((operation) => operation.table === 'profiles'));
  assert.ok(operations.every((operation) => operation.filters.some(([key, value]) => key === 'user_id' && value === owner)));
  assert.equal(records.length, 0);
});

test('cancellation preserves access until period end; legacy paid periods remain supported', async () => {
  profile.paid = false;
  profile.subscription_status = 'canceled';
  assert.equal((await collection().POST(request(valid()))).status, 201);
  profile = { user_id: owner, paid: true, paydate: '2099-01-01' };
  assert.equal((await collection().POST(request(valid()))).status, 201);
});

test('expired subscriptions retain access to saved data and deletion', async () => {
  records = [{ ...valid(), id, user_id: owner }];
  profile.subscription_current_period_end = '2000-01-01';
  const response = await collection().GET(request(undefined, 'valid', 'GET'));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).applications.length, 1);
  assert.equal((await item().DELETE(request(undefined, 'valid', 'DELETE'), context())).status, 204);
});

test('listing returns only the owner data and disables caching', async () => {
  records = [{ ...valid(), id, user_id: owner }, { ...valid(), id: other, user_id: other }];
  const response = await collection().GET(request(undefined, 'valid', 'GET'));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Cache-Control'), /no-store/);
  assert.equal((await response.json()).applications.length, 1);
  assert.ok(operations[0].filters.some(([key, value]) => key === 'user_id' && value === owner));
});

test('pagination is bounded and invalid offsets are rejected', async () => {
  records = Array.from({ length: 101 }, (_, index) => ({ ...valid(), id: String(index), user_id: owner }));
  const page = await (await collection().GET(request(undefined, 'valid', 'GET'))).json();
  assert.equal(page.applications.length, 100);
  assert.equal(page.nextOffset, 100);
  const last = await (await collection().GET(request(undefined, 'valid', 'GET', 'https://example.test/api/applications?offset=100'))).json();
  assert.equal(last.applications.length, 1);
  assert.equal(last.nextOffset, null);
  for (const offset of ['-1', 'NaN', '1.5']) assert.equal((await collection().GET(request(undefined, 'valid', 'GET', `https://example.test/api/applications?offset=${offset}`))).status, 400);
});

test('saved applications survive new requests and letter drafts remain separate', async () => {
  await collection().POST(request({ ...valid(), motivation_letter: 'Erster Brief' }));
  records[0].id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  await collection().POST(request({ ...valid(), company: 'Zweite AG', motivation_letter: 'Zweiter Brief' }));
  const { applications } = await (await collection().GET(request(undefined, 'valid', 'GET'))).json();
  assert.deepEqual(applications.map((row) => row.motivation_letter), ['Erster Brief', 'Zweiter Brief']);
});

test('updating requires the saved version and preserves owner boundaries', async () => {
  const created = await (await collection().POST(request(valid()))).json();
  const payload = { ...valid(), status: 'sent', expected_updated_at: created.application.updated_at };
  const response = await item().PUT(request(payload, 'valid', 'PUT'), context());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).application.status, 'sent');
  assert.equal((await item().PUT(request(payload, 'valid', 'PUT'), context())).status, 409);
  records[0].user_id = other;
  assert.equal((await item().PUT(request({ ...payload, expected_updated_at: records[0].updated_at }, 'valid', 'PUT'), context())).status, 409);
  assert.equal(records[0].status, 'sent');
});

test('deletion is owner scoped and removes the complete saved application', async () => {
  records = [{ ...valid(), id, user_id: other }];
  assert.equal((await item().DELETE(request(undefined, 'valid', 'DELETE'), context())).status, 404);
  assert.equal(records.length, 1);
  records[0].user_id = owner;
  assert.equal((await item().DELETE(request(undefined, 'valid', 'DELETE'), context())).status, 204);
  assert.equal(records.length, 0);
});

test('invalid JSON, oversized bodies, invalid ids and missing versions are rejected', async () => {
  assert.equal((await collection().POST(request('{bad json'))).status, 400);
  assert.equal((await collection().POST(request('x'.repeat(100001)))).status, 413);
  assert.equal((await item().PUT(request(valid(), 'valid', 'PUT'), context())).status, 400);
  assert.equal((await item().DELETE(request(undefined, 'valid', 'DELETE'), context('not-a-uuid'))).status, 400);
});

test('database failures do not leak details or return success', async () => {
  databaseError = true;
  for (const response of [
    await collection().GET(request(undefined, 'valid', 'GET')),
    await collection().POST(request(valid())),
    await item().PUT(request({ ...valid(), expected_updated_at: '2026-11-03T10:00:00.000Z' }, 'valid', 'PUT'), context()),
    await item().DELETE(request(undefined, 'valid', 'DELETE'), context()),
  ]) {
    assert.equal(response.status, 500);
    assert.doesNotMatch(await response.text(), /private database details/);
  }
});
