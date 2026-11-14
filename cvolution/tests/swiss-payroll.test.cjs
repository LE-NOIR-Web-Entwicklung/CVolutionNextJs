/* eslint-disable @typescript-eslint/no-require-imports -- Same local TypeScript loader as the existing feature tests. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const { test } = require('node:test');
const ts = require('typescript');
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const payroll = require('../src/lib/swiss-payroll.ts');

test('payroll year switches at midnight Swiss time on 1 January', () => {
  assert.equal(payroll.payrollYearFor(new Date('2026-11-14T12:00:00Z')), 2026);
  assert.equal(payroll.payrollYearFor(new Date('2026-12-31T22:59:00Z')), 2026); // 23:59 in Zurich
  assert.equal(payroll.payrollYearFor(new Date('2026-12-31T23:00:00Z')), 2027); // 00:00 in Zurich
  assert.equal(payroll.payrollYearFor(new Date('2031-06-01T00:00:00Z')), Math.max(...payroll.PAYROLL_YEARS));
  assert.equal(payroll.payrollYearFor(new Date('2020-06-01T00:00:00Z')), 2026);
});

test('2027 config: unchanged rates, new BVG amounts', () => {
  const c = payroll.payrollConfig(2027);
  assert.equal(c.ahvIvEo, 0.053);
  assert.equal(c.ahvIvEoParts.ahv + c.ahvIvEoParts.iv + c.ahvIvEoParts.eo, c.ahvIvEo);
  assert.equal(c.alv, 0.011);
  assert.equal(c.alvCeiling, 148_200);
  assert.deepEqual(
    [c.bvg.entryThreshold, c.bvg.coordinationDeduction, c.bvg.upperLimit, c.bvg.minCoordinated],
    [23_040, 26_880, 92_160, 3_840],
  );
});

test('every config keeps the BVG amounts consistent with the AHV max pension', () => {
  for (const year of payroll.PAYROLL_YEARS) {
    const { bvg } = payroll.payrollConfig(year);
    const maxPension = bvg.upperLimit / 3;
    assert.equal(bvg.entryThreshold, maxPension * 0.75, `${year} entry threshold`);
    assert.equal(bvg.coordinationDeduction, maxPension * 0.875, `${year} coordination deduction`);
    assert.equal(bvg.minCoordinated, maxPension / 8, `${year} min coordinated`);
  }
});

test('net pay uses the selected year', () => {
  const input = { gross: 7024, period: 'month', payments: 13, workload: 100, age: 35, otherPercent: 1.5 };
  const r26 = payroll.calculatePayroll({ ...input, year: 2026 });
  const r27 = payroll.calculatePayroll({ ...input, year: 2027 });
  const annual = 7024 * 13;
  assert.equal(r26.year, 2026);
  assert.equal(r27.year, 2027);
  const bvg = (result) => result.lines.find((line) => line.label.startsWith('Pensionskasse')).annual;
  assert.equal(bvg(r26), Math.round((Math.min(annual, 90_720) - 26_460) * 0.05));
  assert.equal(bvg(r27), Math.round((Math.min(annual, 92_160) - 26_880) * 0.05));
  assert.ok(r27.annualNet < r26.annualNet, 'higher upper limit means a higher BVG deduction above it');
  assert.equal(r27.lines[0].note, '5.3 %');
  assert.equal(r27.lines[1].note, `1.1 % bis CHF ${(148_200).toLocaleString('de-CH')}`);
});

test('entry threshold applies per year', () => {
  const input = { gross: 22_800, period: 'year', payments: 12, workload: 100, age: 30, otherPercent: 0 };
  const bvg = (year) => payroll.calculatePayroll({ ...input, year }).lines[2].annual;
  assert.ok(bvg(2026) > 0, 'above the 2026 threshold of 22’680');
  assert.equal(bvg(2027), 0, 'below the 2027 threshold of 23’040');
});

test('unknown years fall back to the year in force', () => {
  assert.equal(payroll.payrollConfig(2035).year, Math.max(...payroll.PAYROLL_YEARS));
  assert.deepEqual(payroll.selectablePayrollYears(2026), [2026, 2027]);
});
