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
const dates = () => require('../src/lib/application-dates.ts');

test('stored ISO dates are displayed as DD.MM.YYYY and unfinished input is preserved', () => {
  assert.equal(dates().formatApplicationDate('2026-11-17'), '17.11.2026');
  assert.equal(dates().formatApplicationDate(null), '');
  assert.equal(dates().formatApplicationDate('17.1'), '17.1');
});

test('typed Swiss dates and eight digits become ISO dates', () => {
  assert.equal(dates().parseApplicationDateInput('17.11.2026'), '2026-11-17');
  assert.equal(dates().parseApplicationDateInput('17112026'), '2026-11-17');
  assert.equal(dates().parseApplicationDateInput(' 03.01.2027 '), '2027-01-03');
  assert.equal(dates().parseApplicationDateInput('29.02.2028'), '2028-02-29');
});

test('impossible and ambiguous dates are rejected without silently swapping month and day', () => {
  for (const value of ['', '17.11', '11/17/2026', '2026-11-17', '31.11.2026', '29.02.2027', '00.11.2026', '17.13.2026', '17.11.0000']) assert.equal(dates().parseApplicationDateInput(value), null, value);
  assert.equal(dates().applicationDateFromIso('2026-02-30'), undefined);
  assert.equal(dates().applicationDateFromIso(null), undefined);
});

test('calendar dates keep the same day across browser time zones', () => {
  const originalTimezone = process.env.TZ;
  try {
    for (const timezone of ['Europe/Zurich', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
      process.env.TZ = timezone;
      const selected = dates().applicationDateFromIso('2026-11-17');
      assert.equal(selected.getDate(), 17);
      assert.equal(selected.getMonth(), 10);
      assert.equal(dates().applicationDateToIso(selected), '2026-11-17');
    }
  } finally { if (originalTimezone === undefined) delete process.env.TZ; else process.env.TZ = originalTimezone; }
});
