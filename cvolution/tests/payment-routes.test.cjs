/* eslint-disable @typescript-eslint/no-require-imports -- Plain Node test without the TypeScript loader. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const apiRoot = path.join(__dirname, '../src/app/api');
const routeFiles = fs.readdirSync(apiRoot, { recursive: true })
  .filter((file) => file.endsWith('route.ts'))
  .map((file) => path.join(apiRoot, file));

test('the unverified afterpayment callback stays removed', () => {
  assert.equal(fs.existsSync(path.join(apiRoot, 'afterpayment')), false);
});

test('a route only marks orders as paid after asserting the payment with Worldline', () => {
  const marking = routeFiles.filter((file) => /payment_status:\s*["']paid["']/.test(fs.readFileSync(file, 'utf8')));
  assert.ok(marking.length > 0);
  for (const file of marking) {
    assert.match(fs.readFileSync(file, 'utf8'), /assertAndCaptureWorldlinePayment|saferpayRequest/, path.relative(apiRoot, file));
  }
});
