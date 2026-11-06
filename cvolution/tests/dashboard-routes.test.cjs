/* eslint-disable @typescript-eslint/no-require-imports -- Same local TypeScript loader as the existing feature tests. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const { test, after } = require('node:test');
const ts = require('typescript');
const originalTs = Module._extensions['.ts'];
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
after(() => { if (originalTs) Module._extensions['.ts'] = originalTs; else delete Module._extensions['.ts']; });
const routes = () => require('../src/lib/dashboard-routes.ts');
const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

test('dashboard paths map to areas and application detail routes', () => {
  assert.deepEqual(routes().parseDashboardPath('/dashboard'), { area: 'cv', applicationId: null });
  assert.deepEqual(routes().parseDashboardPath('/dashboard/'), { area: 'cv', applicationId: null });
  assert.deepEqual(routes().parseDashboardPath('/dashboard/motivationsschreiben'), { area: 'motivation', applicationId: null });
  assert.deepEqual(routes().parseDashboardPath('/dashboard/einstellungen'), { area: 'settings', applicationId: null });
  assert.deepEqual(routes().parseDashboardPath('/dashboard/lohnanalyse'), { area: 'salary', applicationId: null });
  assert.deepEqual(routes().parseDashboardPath('/dashboard/bewerbungen'), { area: 'applications', applicationId: null });
  assert.deepEqual(routes().parseDashboardPath(`/dashboard/bewerbungen/${id.toUpperCase()}`), { area: 'applications', applicationId: id });
  assert.deepEqual(routes().parseDashboardPath('/dashboard/bewerbungen/neu'), { area: 'applications', applicationId: 'neu' });
});

test('unknown dashboard paths are rejected', () => {
  for (const path of ['/dashboardx', '/dashboard/unbekannt', '/dashboard/bewerbungen/123', `/dashboard/bewerbungen/${id}/mehr`, `/dashboard/einstellungen/${id}`, '/self']) {
    assert.equal(routes().parseDashboardPath(path), null, path);
  }
});

test('paths round-trip and legacy hashes resolve to areas', () => {
  for (const area of ['cv', 'motivation', 'salary', 'applications', 'settings']) {
    assert.equal(routes().parseDashboardPath(routes().dashboardPath(area)).area, area);
  }
  assert.equal(routes().dashboardPath('applications', id), `/dashboard/bewerbungen/${id}`);
  assert.equal(routes().dashboardPath('settings', id), '/dashboard/einstellungen');
  assert.equal(routes().legacyDashboardHashArea('#applications'), 'applications');
  assert.equal(routes().legacyDashboardHashArea('#motivation'), 'motivation');
  assert.equal(routes().legacyDashboardHashArea('#unbekannt'), null);
  assert.equal(routes().legacyDashboardHashArea(''), null);
});
