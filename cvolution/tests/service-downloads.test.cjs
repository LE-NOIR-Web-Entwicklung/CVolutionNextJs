/* eslint-disable @typescript-eslint/no-require-imports -- Same local TypeScript loader as the existing feature tests. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const { test, after, beforeEach } = require('node:test');
const ts = require('typescript');
const JSZip = require('jszip');
const { PDFDocument } = require('pdf-lib');

const originalTs = Module._extensions['.ts'];
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, filename);
const originalLoad = Module._load;
const root = path.join(__dirname, '..');
let tables;

function query(table) {
  const filters = [];
  let patch = null;
  const rows = () => tables[table].filter((row) => filters.every(([key, value]) => row[key] === value));
  const chain = {
    select: () => chain,
    order: () => chain,
    eq: (key, value) => { filters.push([key, value]); return chain; },
    update: (value) => { patch = value; return chain; },
    maybeSingle: async () => ({ data: rows()[0] ?? null, error: null }),
    insert: (value) => {
      const inserted = [value].flat().map((row, index) => ({ id: `${table}-${index}`, code_attempts: 0, download_count: 0, ...row }));
      tables[table].push(...inserted);
      return { select: () => ({ single: async () => ({ data: inserted[0], error: null }) }), error: null };
    },
    then: (resolve) => {
      const matched = rows();
      if (patch) matched.forEach((row) => Object.assign(row, patch));
      resolve({ data: matched, error: null });
    },
  };
  return chain;
}

Module._load = function load(request, parent, isMain) {
  if (request.startsWith('@/')) return originalLoad.call(this, path.join(root, 'src', request.slice(2)), parent, isMain);
  if (request.endsWith('lib/supabase-server')) return { supabaseAdmin: { from: query } };
  return originalLoad.call(this, request, parent, isMain);
};

const access = require('../src/lib/service-download-access.ts');
const files = require('../src/lib/service-download-files.ts');
const catalog = require('../src/lib/service-downloads.ts');
const { getServiceConfig } = require('../src/lib/services.ts');
const { SHOP_PRODUCTS } = require('../src/lib/shop.ts');

const license = { buyerName: 'Äva Şahin', email: 'aeva@example.ch', orderReference: 'ABCD1234' };
const order = { id: 'abcd1234-0000-4000-8000-000000000000', email: 'aeva@example.ch', name: 'Äva Şahin', service_type: 'download_cv_klar' };

beforeEach(() => { tables = { service_download_grants: [], service_download_items: [] }; });
after(() => { Module._load = originalLoad; Module._extensions['.ts'] = originalTs; });

async function createGrant() {
  const url = await access.createDownloadGrant([order], 'https://cvolution.ch/');
  const token = url.split('/').pop();
  return { url, token, grant: await access.loadGrant(token) };
}

test('every document is sold for CHF 19.90 and has its private file', () => {
  assert.equal(catalog.SERVICE_DOWNLOADS.length, 5);
  for (const download of catalog.SERVICE_DOWNLOADS) {
    assert.equal(getServiceConfig(download.key).basePrice, 19.9);
    assert.equal(SHOP_PRODUCTS[download.key].href, '/service-downloads');
    assert.ok(fs.existsSync(path.join(root, 'private-downloads', download.file)), download.file);
    assert.ok(!fs.existsSync(path.join(root, 'public', download.file)), download.file);
  }
});

test('coupons can apply to every document, also those that exist today', () => {
  for (const download of catalog.SERVICE_DOWNLOADS) assert.equal(getServiceConfig(download.key).couponServiceKey, 'service-downloads');
  const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20261106_create_service_downloads.sql'), 'utf8');
  assert.match(migration, /array_append\(applicable_services, 'service-downloads'\)/);
  assert.ok(migration.indexOf('ADD CONSTRAINT coupons_services_check') < migration.indexOf('UPDATE coupons'));
});

test('sold Word files contain no personal data of the original authors', async () => {
  const forbidden = /farete|ajdari|hotmail|flurstrasse|kloten|209 53|schulthess|cicek|armend|mustafa|agilitylogistics/i;
  for (const download of catalog.SERVICE_DOWNLOADS.filter((item) => item.format === 'Word')) {
    const zip = await JSZip.loadAsync(fs.readFileSync(path.join(root, 'private-downloads', download.file)));
    for (const name of ['word/document.xml', 'docProps/core.xml', 'docProps/app.xml']) {
      assert.doesNotMatch(await zip.file(name).async('string'), forbidden, `${download.file} ${name}`);
    }
  }
});

test('the stored link only works through its hash and expires', async () => {
  const { url, token, grant } = await createGrant();
  assert.match(url, /^https:\/\/cvolution\.ch\/downloads\/[A-Za-z0-9_-]{43}$/);
  assert.ok(!JSON.stringify(tables).includes(token));
  assert.equal(await access.loadGrant('not-a-token'), null);
  assert.equal(access.isGrantExpired(grant), false);
  assert.equal(access.isGrantExpired({ ...grant, expires_at: '2020-01-01T00:00:00Z' }), true);
});

test('access needs the code from the mailbox, and guessing is limited', async () => {
  const { token, grant } = await createGrant();
  const code = await access.issueAccessCode(grant, token);
  assert.match(code, /^\d{6}$/);
  assert.equal(await access.issueAccessCode(await access.loadGrant(token), token), null);
  assert.ok(!JSON.stringify(tables).includes(`"${code}"`));

  const wrong = code === '000000' ? '111111' : '000000';
  assert.equal(await access.verifyAccessCode(await access.loadGrant(token), token, wrong), null);
  const session = await access.verifyAccessCode(await access.loadGrant(token), token, code);
  assert.ok(session);
  assert.equal(access.hasValidSession(await access.loadGrant(token), session), true);
  assert.equal(access.hasValidSession(await access.loadGrant(token), 'forged'), false);
  assert.equal(access.hasValidSession(await access.loadGrant(token), undefined), false);
  assert.equal(await access.verifyAccessCode(await access.loadGrant(token), token, code), null, 'a code works once');

  const locked = await access.loadGrant(token);
  Object.assign(tables.service_download_grants[0], { code_hash: 'x'.repeat(64), code_expires_at: '2999-01-01T00:00:00Z', code_attempts: 5 });
  assert.equal(await access.verifyAccessCode(locked, token, code), null);
});

test('each document can only be downloaded three times', async () => {
  await createGrant();
  const item = tables.service_download_items[0];
  assert.equal(item.product_key, 'download_cv_klar');
  for (let count = 0; count < 3; count += 1) assert.equal(await access.claimDownload({ ...item }), true);
  assert.equal(await access.claimDownload({ ...item }), false);
  assert.equal(await access.claimDownload({ id: item.id, download_count: 1 }), false, 'a stale count loses');
});

test('PDFs and Word files are personalised for the buyer', async () => {
  const pdf = await PDFDocument.load(await files.personalizeDownload('a.pdf', fs.readFileSync(path.join(root, 'private-downloads/masterprompt-spontanbewerbung.pdf')), license));
  assert.equal(pdf.getPageCount(), 4);
  assert.match(pdf.getSubject(), /aeva@example\.ch.*ABCD1234/);

  const docx = await JSZip.loadAsync(await files.personalizeDownload('a.docx', fs.readFileSync(path.join(root, 'private-downloads/lebenslauf-klar.docx')), { ...license, buyerName: 'A & B <x>' }));
  const core = await docx.file('docProps/core.xml').async('string');
  assert.match(core, /A &amp; B &lt;x&gt;, aeva@example\.ch/);
  assert.ok(docx.file('word/document.xml'));
});
