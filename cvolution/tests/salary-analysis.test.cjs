/* eslint-disable @typescript-eslint/no-require-imports -- Same local TypeScript loader as the existing feature tests. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const { test, after, beforeEach } = require('node:test');
const ts = require('typescript');
const originalTs = Module._extensions['.ts'];
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const originalLoad = Module._load;
const originalFetch = global.fetch;
let tables, saved, deletedBy, modelRequests, modelBody, paid;
function query(table) {
  const result = () => ({ data: tables[table] ?? null, error: null });
  const chain = {
    select: () => chain, eq: () => chain, order: () => chain,
    single: async () => result(), maybeSingle: async () => result(),
    limit: () => chain,
    insert: (row) => { if (tables.saveFails) return { select: () => ({ single: async () => ({ data: null, error: { code: '23514' } }) }) }; saved = row; return { select: () => ({ single: async () => ({ data: { id: 'row-1', created_at: '2026-11-06T10:00:00Z', analysis_json: row.analysis_json }, error: null }) }) }; },
    delete: () => { saved = 'deleted'; deletedBy = []; return { eq: (column, value) => { deletedBy.push([column, value]); return { eq: async (nextColumn, nextValue) => { deletedBy.push([nextColumn, nextValue]); return { error: null }; } }; } }; },
    then: (resolve) => resolve(result()),
  };
  return chain;
}
const supabaseStub = { supabaseAdmin: {
  auth: { getUser: async (token) => (token === 'valid' ? { data: { user: { id: 'user-1' } }, error: null } : { data: { user: null }, error: new Error('invalid') }) },
  from: (table) => (table === 'profiles' && !paid ? { select: () => ({ eq: () => ({ single: async () => ({ data: { paid: false }, error: null }) }) }) } : query(table)),
} };
Module._load = function load(request, parent, isMain) {
  if (request.endsWith('supabase-server')) return supabaseStub;
  return originalLoad.call(this, request, parent, isMain);
};
after(() => {
  Module._load = originalLoad;
  global.fetch = originalFetch;
  if (originalTs) Module._extensions['.ts'] = originalTs; else delete Module._extensions['.ts'];
});
const salary = () => require('../src/lib/salary-analysis.ts');

const context = { name: 'Testperson Muster', birthdate: '2000-05-01', today: '2026-10-29', enteredAnnualGross: 87000, workload: 100, workplace: 'Pfäffikon LU' };
const scenario = (amount) => ({ amount, description: 'Text' });
const raw = () => ({
  person: { position: 'Financial Controller', employer: 'Muster AG', workplace: 'Anderswo' },
  salary: { monthly: 6735, months: 13, variable: 0 },
  market: { low: 90000, median: 100000, high: 115000, intro: 'Spanne' },
  summary: { intro: 'Einleitung mit Strasse und gross', points: [{ tone: 'negative', title: 'Unter Markt', text: 'Text' }] },
  scenarios: { pessimistic: scenario(92000), realistic: scenario(100000), optimistic: scenario(110000) },
});

test('derived figures are calculated from the payslip, not taken from the model', () => {
  const result = salary().finalizeSalaryAnalysis({ ...raw(), deviation: { percent: 99 } }, context);
  assert.equal(result.salary.annualGross, 87555);
  assert.equal(result.deviation.amount, -12445);
  assert.equal(result.deviation.percent, -12.4);
  assert.equal(result.deviation.rating, 'unterbezahlt');
  assert.equal(result.person.age, 26);
  assert.equal(result.person.workplace, 'Pfäffikon LU');
  assert.deepEqual(result.scenarios.map((item) => item.delta), [4445, 12445, 22445]);
  assert.equal(result.scenarios[1].deltaPercent, 14.2);
});

test('part-time salaries are compared on a full-time basis', () => {
  const data = { ...raw(), salary: { monthly: 4000, months: 13, variable: 1000 } };
  const result = salary().finalizeSalaryAnalysis(data, { ...context, workload: 50 });
  assert.equal(result.salary.total, 53000);
  assert.equal(result.salary.totalFullTime, 106000);
  assert.equal(result.deviation.percent, 6);
  assert.equal(result.deviation.rating, 'überdurchschnittlich');
});

test('the entered salary is the fallback when the payslip gives no monthly amount', () => {
  const result = salary().finalizeSalaryAnalysis({ ...raw(), salary: { monthly: 0, months: 99, variable: 0 } }, context);
  assert.equal(result.salary.annualGross, 87000);
  assert.equal(result.salary.months, 13);
});

test('without profile data, name and age come from the documents', () => {
  const data = { ...raw(), person: { ...raw().person, name: 'Aus Dokument', birth_year: 1990 } };
  const result = salary().finalizeSalaryAnalysis(data, { ...context, name: '', birthdate: null });
  assert.equal(result.person.name, 'Aus Dokument');
  assert.equal(result.person.age, 36);
  const kept = salary().finalizeSalaryAnalysis(data, context);
  assert.equal(kept.person.name, 'Testperson Muster', 'Profile data takes precedence');
  assert.equal(kept.person.age, 26);
  assert.equal(salary().finalizeSalaryAnalysis({ ...data, person: {} }, { ...context, name: '', birthdate: null }).person.age, null);
});

test('incomplete model results are rejected', () => {
  assert.throws(() => salary().finalizeSalaryAnalysis({ ...raw(), market: { median: 0 } }, context));
  assert.throws(() => salary().finalizeSalaryAnalysis({ ...raw(), scenarios: {} }, context));
  assert.throws(() => salary().finalizeSalaryAnalysis(null, context));
});

test('ratings use the ±5% thresholds and Swiss formats', () => {
  const { rateDeviation, formatChf, formatSignedChf, formatSignedPercent, ageInYear } = salary();
  assert.equal(rateDeviation(5).rating, 'marktgerecht');
  assert.equal(rateDeviation(-5).rating, 'marktgerecht');
  assert.equal(rateDeviation(5.1).tone, 'positive');
  assert.equal(rateDeviation(-5.1).tone, 'negative');
  assert.equal(formatChf(87555), "CHF 87'555");
  assert.equal(formatChf(1234567), "CHF 1'234'567");
  assert.equal(formatSignedChf(-12445), "-CHF 12'445");
  assert.equal(formatSignedPercent(14.2), '+14.2%');
  assert.equal(ageInYear('1995-12-31', '2026-01-02'), 31);
  assert.equal(ageInYear(null, '2026-01-02'), null);
});

const route = () => require(path.join(__dirname, '../src/app/api/salary-analysis/route.ts'));
const pdf = (name = 'lohn.pdf') => new File(['%PDF-1.7 fixture'], name, { type: 'application/pdf' });
function form(overrides = {}) {
  const body = new FormData();
  const values = { annualGross: "CHF 87'000", workload: '100%', workplace: 'Luzern', payslip: pdf(), ...overrides };
  for (const [key, value] of Object.entries(values)) if (value !== null) body.append(key, value);
  return new Request('https://example.test/api/salary-analysis', { method: 'POST', headers: { authorization: 'Bearer valid' }, body });
}
beforeEach(() => {
  paid = true;
  saved = null;
  modelRequests = 0;
  process.env.ANTHROPIC_API_KEY = 'test-key';
  tables = {
    profiles: { paid: true, paydate: '2099-01-01', subscription_status: 'active', full_name: 'Testperson Muster', headline: 'Controller', birthdate: '2000-05-01' },
    experiences: [{ job_title: 'Controller', company: 'Muster AG', start_date: '2020-01-01', is_current: true, description: 'Reporting' }],
    education: [], skills: [], languages: [],
  };
  global.fetch = async (url, options) => {
    modelRequests += 1;
    modelBody = JSON.parse(options.body);
    return Response.json({ stop_reason: 'tool_use', content: [{ type: 'tool_use', name: 'submit_salary_analysis', input: raw() }] });
  };
});

test('an analysis uses the stored CV, sends the payslip and is saved', async () => {
  const response = await route().POST(form());
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.saved, true);
  assert.equal(result.analysis.person.name, 'Testperson Muster');
  assert.equal(result.id, 'row-1');
  assert.equal(saved.user_id, 'user-1');
  assert.equal(saved.status, 'completed');
  assert.equal(saved.analysis_json.person.name, 'Testperson Muster');
  const content = modelBody.messages[0].content;
  assert.equal(content.filter((block) => block.type === 'document').length, 1, 'Only the payslip is uploaded');
  assert.match(content.at(-1).text, /Reporting/);
  assert.doesNotMatch(JSON.stringify(result), /hochgeladenes Dokument/);
});

test('without CV data a CV upload is required and then sent along', async () => {
  tables.experiences = [];
  const missing = await route().POST(form());
  assert.equal(missing.status, 400);
  assert.equal(modelRequests, 0);
  const response = await route().POST(form({ cv: pdf('cv.pdf') }));
  assert.equal(response.status, 200);
  assert.equal(modelBody.messages[0].content.filter((block) => block.type === 'document').length, 2);
});

test('an empty profile works with an uploaded CV', async () => {
  tables.experiences = [];
  tables.profiles = { ...tables.profiles, full_name: null, headline: null, birthdate: null };
  global.fetch = async () => Response.json({ stop_reason: 'tool_use', content: [{ type: 'tool_use', name: 'submit_salary_analysis', input: { ...raw(), person: { ...raw().person, name: 'Aus Dokument', birth_year: 1990 } } }] });
  const response = await route().POST(form({ cv: pdf('cv.pdf') }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).analysis.person.name, 'Aus Dokument');
});

test('invalid requests stop before any model call', async () => {
  assert.equal((await route().POST(form({ payslip: null }))).status, 400);
  assert.equal((await route().POST(form({ payslip: new File(['hello'], 'lohn.txt') }))).status, 400);
  assert.equal((await route().POST(form({ workload: '150' }))).status, 400);
  paid = false;
  assert.equal((await route().POST(form())).status, 402);
  assert.equal(modelRequests, 0);
});

test('saved analyses are listed per user and a failed save still shows the result', async () => {
  const headers = { authorization: 'Bearer valid' };
  tables.salary_analyses = [{ id: 'row-1', created_at: '2026-11-06T10:00:00Z', analysis_json: { person: { position: 'Controller' } } }];
  const loaded = await (await route().GET(new Request('https://example.test/api/salary-analysis', { headers }))).json();
  assert.deepEqual(loaded.analyses, [{ id: 'row-1', createdAt: '2026-11-06T10:00:00Z', analysis: { person: { position: 'Controller' } } }]);
  tables.saveFails = true;
  const response = await route().POST(form());
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.saved, false);
  assert.equal(result.id, null);
  assert.equal(result.analysis.person.name, 'Testperson Muster');
  global.fetch = async () => Response.json({ stop_reason: 'max_tokens', content: [] });
  assert.equal((await route().POST(form())).status, 502);
});

test('deleting is limited to the signed-in owner and needs a valid id', async () => {
  const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const url = 'https://example.test/api/salary-analysis';
  const headers = { authorization: 'Bearer valid' };
  assert.equal((await route().DELETE(new Request(`${url}?id=nope`, { method: 'DELETE', headers }))).status, 400);
  assert.equal((await route().DELETE(new Request(`${url}?id=${id}`, { method: 'DELETE', headers }))).status, 204);
  assert.deepEqual(deletedBy, [['id', id], ['user_id', 'user-1']]);
});
