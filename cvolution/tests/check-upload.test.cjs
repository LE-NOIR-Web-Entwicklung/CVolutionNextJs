/* eslint-disable @typescript-eslint/no-require-imports -- Same local TypeScript loader as the existing feature tests. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const { test, after } = require('node:test');
const ts = require('typescript');

const originalTs = Module._extensions['.ts'];
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, filename);
const originalLoad = Module._load;
const root = path.join(__dirname, '..');
let insertedRows = null;

const orders = {
  insert: (rows) => {
    insertedRows = rows;
    return { select: async () => ({ data: rows.map((row, index) => ({ ...row, id: `order-${index}` })), error: null }) };
  },
};

Module._load = function load(request, parent, isMain) {
  if (request === '@/lib/worldline-checkout') return { initializeWorldlineCheckout: async () => ({ ok: true, paymentUrl: 'https://pay.test', saferpayToken: 'token' }) };
  if (request === '@/lib/order-processing') return { processPaidCart: async () => {} };
  if (request === '@/lib/coupons') return { calculateDiscountedPrice: (price) => price, getDiscountPercent: () => null };
  if (request.startsWith('@/')) return originalLoad.call(this, path.join(root, 'src', request.slice(2)), parent, isMain);
  if (request.endsWith('lib/supabase-server')) return { supabaseAdmin: { from: () => orders } };
  return originalLoad.call(this, request, parent, isMain);
};

const { POST } = require('../src/app/api/worldline/checkout/route.ts');
after(() => { Module._load = originalLoad; Module._extensions['.ts'] = originalTs; });

const checkout = (item) => POST({
  json: async () => ({ name: 'Ava Muster', email: 'ava@example.ch', phone: '0760000000', items: [item] }),
  nextUrl: { origin: 'https://cvolution.ch' },
});

test('the document check cannot be ordered without an uploaded file', async () => {
  const response = await checkout({ serviceType: 'check', checkSelections: ['lebenslauf'], checkFiles: [] });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /Unterlagen/);
  assert.equal(insertedRows, null);
});

test('the document check is accepted with an uploaded file', async () => {
  const response = await checkout({ serviceType: 'check', checkSelections: ['lebenslauf'], checkFiles: [{ fileName: 'cv.pdf', fileBase64: 'QQ==' }] });
  assert.equal(response.status, 201);
  assert.deepEqual(insertedRows[0].check_files, [{ fileName: 'cv.pdf', fileBase64: 'QQ==' }]);
});
