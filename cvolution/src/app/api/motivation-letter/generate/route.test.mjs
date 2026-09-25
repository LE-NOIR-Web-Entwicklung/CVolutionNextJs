import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const routePath = new URL("./route.ts", import.meta.url);
const require = createRequire(import.meta.url);

function makeSupabase(profileOverrides = {}) {
  const profile = {
    full_name: "Alex Example",
    paid: true,
    subscription_current_period_end: "2099-01-01T00:00:00.000Z",
    ...profileOverrides,
  };
  const query = {
    select() { return this; },
    eq() { return this; },
    order() { return this; },
    single: async () => ({ data: profile, error: null }),
    then(resolve) { return Promise.resolve({ data: [], error: null }).then(resolve); },
  };
  return {
    auth: { getUser: async () => ({ data: { user: { id: "user-1", email: "alex@example.com" } }, error: null }) },
    from: () => query,
  };
}

async function loadRoute(anthropicText = "Ein überzeugendes Schreiben.", profileOverrides = {}) {
  let anthropicPayload;
  const source = await readFile(routePath, "utf8");
  const policySource = await readFile(new URL("../../../../lib/motivation-letter-policy.ts", import.meta.url), "utf8");
  const policyCompiled = ts.transpileModule(policySource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const policyExports = {};
  vm.runInNewContext(policyCompiled, { exports: policyExports, module: { exports: policyExports } });
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const fakeHttps = {
    request(_url, _options, callback) {
      let body = "";
      const request = {
        on() { return request; },
        write(chunk) { body += chunk; },
        end() {
          anthropicPayload = JSON.parse(body);
          const response = {
            statusCode: 200,
            headers: {},
            on(event, handler) {
              if (event === "data") handler(Buffer.from(JSON.stringify({
                content: [{ type: "text", text: anthropicText }],
                model: "test-model",
              })));
              if (event === "end") handler();
            },
          };
          callback(response);
        },
      };
      return request;
    },
  };
  const exports = {};
  const context = {
    exports,
    module: { exports },
    require(specifier) {
      if (specifier.endsWith("motivation-letter-policy")) return policyExports;
      if (specifier === "next/server") {
        return { NextResponse: { json: (data, init = {}) => new Response(JSON.stringify(data), {
          status: init.status || 200,
          headers: { "content-type": "application/json" },
        }) } };
      }
      if (specifier === "node:https") return fakeHttps;
      if (specifier.endsWith("supabase-server")) return { supabaseAdmin: makeSupabase(profileOverrides) };
      if (specifier.endsWith("safe-external-fetch")) return { fetchSafeExternal: async () => ({ ok: false, text: "" }) };
      return require(specifier);
    },
    process: { env: { ANTHROPIC_API_KEY: "test-key" } },
    Buffer,
    URL,
    Date,
    Intl,
    setTimeout,
    clearTimeout,
    console,
    Response,
  };
  vm.runInNewContext(compiled, context, { filename: resolve(dirname(new URL(routePath).pathname), "route.cjs") });
  return { POST: context.module.exports.POST, getAnthropicPayload: () => anthropicPayload };
}

async function post(route, body) {
  const response = await route.POST({
    headers: new Headers({ authorization: "Bearer test-token" }),
    json: async () => body,
  });
  return { status: response.status, body: await response.json() };
}

test("spontaneous application accepts company and target title without a job ad", async () => {
  const route = await loadRoute();
  const result = await post(route, { applicationType: "spontaneous", company: "Acme", jobTitle: "Designer" });

  assert.equal(result.status, 200);
  assert.equal(result.body.letter, "Ein überzeugendes Schreiben.");
  assert.match(route.getAnthropicPayload().messages[0].content[0].text, /Bewerbungsart: Spontanbewerbung/);
  assert.match(route.getAnthropicPayload().messages[0].content[0].text, /Nicht relevant für eine Spontanbewerbung\./);
});

test("job-ad and spontaneous requests produce distinct prompt contexts", async () => {
  const jobRoute = await loadRoute();
  const spontaneousRoute = await loadRoute();
  const jobAd = "Gesucht: Senior Engineer";
  await post(jobRoute, { applicationType: "job-ad", company: "Acme", jobTitle: "Engineer", jobAd });
  await post(spontaneousRoute, { applicationType: "spontaneous", company: "Acme", jobTitle: "Engineer" });

  const jobPrompt = jobRoute.getAnthropicPayload().messages[0].content[0].text;
  const spontaneousPrompt = spontaneousRoute.getAnthropicPayload().messages[0].content[0].text;
  assert.match(jobPrompt, /Bewerbung auf eine ausgeschriebene Stelle/);
  assert.match(jobPrompt, /Gesucht: Senior Engineer/);
  assert.match(spontaneousPrompt, /Bewerbungsart: Spontanbewerbung/);
  assert.doesNotMatch(spontaneousPrompt, /Gesucht: Senior Engineer/);
});

test("spontaneous requests require both company and target title", async () => {
  const route = await loadRoute();
  for (const body of [
    { applicationType: "spontaneous", company: "Acme" },
    { applicationType: "spontaneous", jobTitle: "Designer" },
    { applicationType: "spontaneous", company: "  ", jobTitle: "Designer" },
  ]) {
    assert.equal((await post(route, body)).status, 400);
  }
  assert.equal(route.getAnthropicPayload(), undefined);
});

test("job-ad requests still require pasted ad text or an ad URL", async () => {
  const route = await loadRoute();
  assert.equal((await post(route, { applicationType: "job-ad", company: "Acme", jobTitle: "Engineer" })).status, 400);
  assert.equal((await post(route, { company: "Acme", jobTitle: "Engineer" })).status, 400);
  assert.equal(route.getAnthropicPayload(), undefined);
});

test("unknown application types are rejected", async () => {
  const route = await loadRoute();
  const result = await post(route, { applicationType: "internship", jobAd: "Some ad" });
  assert.equal(result.status, 400);
  assert.equal(result.body.error, "Ungültige Bewerbungsart.");
  assert.equal(route.getAnthropicPayload(), undefined);
});

test("NO_MATCH is a job-ad mismatch and never becomes spontaneous letter content", async () => {
  const noMatch = 'NO_MATCH: {"requirement":"Fahrerlaubnis Kategorie B ist zwingend erforderlich.","cvContradiction":"Keine Fahrerlaubnis Kategorie B"}';
  const jobRoute = await loadRoute(noMatch, { summary: "Keine Fahrerlaubnis Kategorie B" });
  const spontaneousRoute = await loadRoute(noMatch);

  const jobResult = await post(jobRoute, { applicationType: "job-ad", jobAd: "Fahrerlaubnis Kategorie B ist zwingend erforderlich." });
  const spontaneousResult = await post(spontaneousRoute, {
    applicationType: "spontaneous", company: "Acme", jobTitle: "Ingenieur",
  });

  assert.equal(jobResult.status, 422);
  assert.equal(jobResult.body.noMatch, true);
  assert.equal(spontaneousResult.status, 502);
  assert.equal(spontaneousResult.body.noMatch, undefined);
  assert.equal(spontaneousResult.body.letter, undefined);
  assert.doesNotMatch(JSON.stringify(spontaneousResult.body), /NO_MATCH/);
});


test("rejects generated output over the letter limits without returning a letter", async () => {
  const route = await loadRoute(Array(301).fill("Wort").join(" "));
  const result = await post(route, { applicationType: "job-ad", jobAd: "Gesucht: Ingenieur" });

  assert.equal(result.status, 502);
  assert.equal(result.body.letter, undefined);
  assert.equal(typeof result.body.error, "string");
});

test("career change alone is never a job-ad mismatch", async () => {
  const route = await loadRoute("Ein passendes Motivationsschreiben.");
  const result = await post(route, { applicationType: "job-ad", jobAd: "Gesucht: Ingenieur" });
  const prompt = route.getAnthropicPayload().messages[0].content[0].text;
  const system = route.getAnthropicPayload().system;

  assert.equal(result.status, 200);
  assert.equal(result.body.letter, "Ein passendes Motivationsschreiben.");
  assert.match(system, /Quereinstieg oder ein Karrierewechsel.*nie ein Grund/u);
  assert.match(prompt, /Bewerbung auf eine ausgeschriebene Stelle/);
});


test("does not classify an unsupported arbitrary NO_MATCH reason as a proven mismatch", async () => {
  const route = await loadRoute("NO_MATCH: Die Person passt kulturell nicht zum Unternehmen.");
  const result = await post(route, { applicationType: "job-ad", jobAd: "Gesucht: Ingenieur" });

  assert.equal(result.status, 502);
  assert.equal(result.body.noMatch, undefined);
  assert.equal(result.body.letter, undefined);
});

test("does not classify positive CV evidence as a contradiction", async () => {
  const route = await loadRoute(
    'NO_MATCH: {"requirement":"Fahrerlaubnis Kategorie B ist zwingend erforderlich.","cvContradiction":"Fahrerlaubnis Kategorie B vorhanden"}',
    { summary: "Fahrerlaubnis Kategorie B vorhanden" }
  );
  const result = await post(route, {
    applicationType: "job-ad",
    jobAd: "Fahrerlaubnis Kategorie B ist zwingend erforderlich.",
  });

  assert.equal(result.status, 502);
  assert.equal(result.body.noMatch, undefined);
  assert.equal(result.body.letter, undefined);
});
