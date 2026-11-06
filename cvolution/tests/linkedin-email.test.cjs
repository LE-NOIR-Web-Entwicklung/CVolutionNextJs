/* eslint-disable @typescript-eslint/no-require-imports -- Same local TypeScript loader as the existing feature tests. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const { test, after, beforeEach } = require('node:test');
const ts = require('typescript');

const originalTs = Module._extensions['.ts'];
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, filename);
const originalLoad = Module._load;
let sent;
Module._load = function load(request, parent, isMain) {
  if (request === 'resend') return { Resend: class { emails = { send: async (mail) => { sent.push(mail); return { data: {}, error: null }; } }; } };
  return originalLoad.call(this, request, parent, isMain);
};
const { sendCartConfirmationEmail, sendConfirmationEmail } = require('../lib/resend.ts');
const LINK = 'https://calendly.com/armend-cvolution/besprechung-lohnanalyse-klon';

beforeEach(() => { sent = []; });
after(() => { Module._load = originalLoad; Module._extensions['.ts'] = originalTs; });

test('LinkedIn order confirmations offer the appointment link', async () => {
  await sendConfirmationEmail('ava@example.ch', 'LinkedIn Profil Optimierung');
  await sendCartConfirmationEmail('ava@example.ch', [{ email: 'ava@example.ch', service_label: 'LinkedIn Profil Optimierung', final_price: 149 }]);
  assert.equal(sent.length, 2);
  for (const mail of sent) assert.ok(mail.html.includes(LINK));
});

test('other services do not get the LinkedIn appointment link', async () => {
  await sendCartConfirmationEmail('ava@example.ch', [{ email: 'ava@example.ch', service_label: 'Motivationsschreiben', final_price: 99 }]);
  assert.ok(!sent[0].html.includes(LINK));
});
