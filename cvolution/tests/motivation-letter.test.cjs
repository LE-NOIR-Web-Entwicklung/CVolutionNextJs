// Node 22+: node --test tests/motivation-letter.test.cjs
/* eslint-disable @typescript-eslint/no-require-imports -- Test-local CommonJS loader mocks network and Supabase without live AI requests. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");
const Module = require("node:module");
const { EventEmitter } = require("node:events");
const { PassThrough } = require("node:stream");
const { gzipSync, deflateSync, brotliCompressSync } = require("node:zlib");
const { test, beforeEach, after } = require("node:test");
const ts = require("typescript");

const originalLoad = Module._load;
const originalTs = Module._extensions[".ts"];
const originalFetch = global.fetch;
const originalKey = process.env.ANTHROPIC_API_KEY;
const profile = {
  full_name: "Testperson Muster",
  paid: true,
  subscription_current_period_end: "2099-01-01",
};
const jobUrl = "https://careers.example.com/jobs/teamleitung";
const description =
  "Sie führen ein regionales Beratungsteam und betreuen Kunden. Erfahrung in Personalführung, Rekrutierung und Budgetplanung ist erforderlich. Sie entwickeln bestehende Kundenbeziehungen weiter und begleiten die Mitarbeitenden im Tagesgeschäft.";
let pages, requests, payloads, dnsAddress, paid, modelLetter, savedApplications;

function responseFor(url) {
  requests.push(url);
  if (new URL(url).hostname === "api.anthropic.com") {
    return {
      status: 200,
      body: JSON.stringify({
        content: [
          {
            type: "text",
            text: modelLetter,
          },
        ],
      }),
    };
  }
  return pages.get(url) || { status: 404, body: "" };
}

function mockRequest(url, options, onResponse) {
  const req = new EventEmitter();
  let body = "";
  req.write = (chunk) => {
    body += chunk;
  };
  req.destroy = (error) => {
    if (error) queueMicrotask(() => req.emit("error", error));
    return req;
  };
  req.end = () => {
    queueMicrotask(() => {
      const send = () => {
        if (new URL(url).hostname === "api.anthropic.com")
          payloads.push(JSON.parse(body));
        const page = responseFor(String(url));
        const res = new PassThrough();
        res.statusCode = page.status;
        res.headers = {
          "content-type": "text/html; charset=utf-8",
          ...page.headers,
        };
        onResponse(res);
        queueMicrotask(() => {
          if (page.error) res.destroy(new Error("Connection closed"));
          else res.end(Buffer.from(page.body || ""));
        });
      };
      if (options.lookup)
        options.lookup(new URL(url).hostname, {}, (error) =>
          error ? req.emit("error", error) : send(),
        );
      else send();
    });
  };
  return req;
}

const supabaseStub = {
  supabaseAdmin: {
    auth: {
      getUser: async (token) => ({
        data: {
          user:
            token === "valid"
              ? { id: "user-1", email: "test@example.test" }
              : null,
        },
        error: null,
      }),
    },
    from(name) {
      if (name === "applications") {
        const filters = [];
        const query = {
          select() { return query; },
          eq(key, value) { filters.push([key, value]); return query; },
          async maybeSingle() {
            return { data: savedApplications.find((row) => filters.every(([key, value]) => row[key] === value)) || null, error: null };
          },
        };
        return query;
      }
      const data =
        name === "profiles"
          ? {
              ...profile,
              paid,
              subscription_current_period_end: paid
                ? "2099-01-01"
                : "2000-01-01",
            }
          : name === "experiences"
            ? [
                {
                  job_title: "Teamleitung",
                  company: "Musterbetrieb",
                  description:
                    "Personalführung, Rekrutierung und Budgetplanung",
                },
              ]
            : [];
      const result = { data, error: null };
      const query = {
        select() {
          return query;
        },
        eq() {
          return query;
        },
        order() {
          return Promise.resolve(result);
        },
        single() {
          return Promise.resolve(result);
        },
      };
      return query;
    },
  },
};
Module._extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  module._compile(
    ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
        inlineSourceMap: true,
        inlineSources: true,
      },
    }).outputText,
    filename,
  );
};
Module._load = function (request, parent, isMain) {
  if (request.endsWith("supabase-server")) return supabaseStub;
  if (request === "node:https" || request === "node:http")
    return { request: mockRequest };
  if (request === "node:dns")
    return {
      lookup: (_host, _options, callback) => callback(null, dnsAddress, 4),
    };
  return originalLoad.call(this, request, parent, isMain);
};
global.fetch = async (url, options = {}, redirects = 0) => {
  const page = responseFor(String(url));
  if (
    page.headers?.location &&
    options.redirect === "follow" &&
    redirects < 5
  ) {
    return global.fetch(
      new URL(page.headers.location, url).toString(),
      options,
      redirects + 1,
    );
  }
  return new Response(page.body, {
    status: page.status,
    headers: { "content-type": "text/html", ...page.headers },
  });
};
process.env.ANTHROPIC_API_KEY = "test-key-no-live-requests";
const { POST } = require(
  path.resolve(__dirname, "../src/app/api/motivation-letter/generate/route.ts"),
);
const { POST: exportWord } = require(
  path.resolve(__dirname, "../src/app/api/motivation-letter/docx/route.ts"),
);

beforeEach(() => {
  savedApplications = [];
  pages = new Map();
  requests = [];
  payloads = [];
  dnsAddress = "93.184.216.34";
  paid = true;
  modelLetter =
    "Bewerbung als Teamleitung\n\nSehr geehrte Frau Muster\n\nEin individueller Entwurf.\n\nFreundliche Grüsse\nTestperson Muster";
});

test("saved application letters export after subscription expiry using only the owner's saved text", async () => {
  paid = false;
  const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  savedApplications = [{ id, user_id: "user-1", company: "Gespeichert AG", job_title: "Beratung", motivation_letter: "Betreff\n\nGespeicherter Brief." }];
  const response = await exportWord(new Request("https://example.test/api/motivation-letter/docx", {
    method: "POST", headers: { authorization: "Bearer valid", "content-type": "application/json" },
    body: JSON.stringify({ applicationId: id, letter: "Client text must not override the saved letter" }),
  }));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("Content-Disposition"), /gespeichert-ag/);
  const zip = await require("jszip").loadAsync(Buffer.from(await response.arrayBuffer()));
  const xml = await zip.file("word/document.xml").async("string");
  assert.match(xml, /Gespeicherter Brief/);
  assert.doesNotMatch(xml, /Client text must not override/);
  assert.equal(requests.length, 0);
});

test("saved application exports reject other owners, missing letters and invalid ids", async () => {
  paid = false;
  const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const download = (applicationId) => exportWord(new Request("https://example.test/api/motivation-letter/docx", {
    method: "POST", headers: { authorization: "Bearer valid", "content-type": "application/json" }, body: JSON.stringify({ applicationId, letter: "Untrusted" }),
  }));
  savedApplications = [{ id, user_id: "other", motivation_letter: "Private" }];
  assert.equal((await download(id)).status, 404);
  savedApplications[0].user_id = "user-1";
  savedApplications[0].motivation_letter = "";
  assert.equal((await download(id)).status, 400);
  assert.equal((await download("invalid")).status, 400);
  assert.equal((await download(null)).status, 400);
});
after(() => {
  Module._load = originalLoad;
  if (originalTs) Module._extensions[".ts"] = originalTs;
  else delete Module._extensions[".ts"];
  global.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = originalKey;
});

async function generate(body, token = "valid") {
  return POST(
    new Request("https://example.test/api/motivation-letter/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    }),
  );
}
function userPrompt() {
  return payloads[0].messages[0].content[0].text;
}

test("reactive applications use the supplied four-paragraph structure", async () => {
  assert.equal((await generate({ jobAd: description })).status, 200);
  assert.match(payloads[0].system, /vier (?:Textabsätze|Absaetze)/i);
  assert.match(payloads[0].system, /Hardskills/);
  assert.match(payloads[0].system, /Softskills/);
  assert.doesNotMatch(
    payloads[0].system,
    /Rucksack|Indem ich:|5 bis 8 Bulletpoints/,
  );
  assert.match(userPrompt(), /Bewerbung als/);
});

test("spontaneous applications work with company and desired role without an advert", async () => {
  assert.equal(
    (
      await generate({
        applicationType: "spontaneous",
        company: "Beispiel AG",
        jobTitle: "Teamleitung",
      })
    ).status,
    200,
  );
  assert.match(userPrompt(), /Initiativbewerbung als/);
  assert.match(userPrompt(), /keine ausgeschriebene Stelle/i);
  assert.match(payloads[0].system, /telefonisch.*nur|nur.*telefonisch/i);
  assert.equal(
    requests.filter((url) => !url.includes("api.anthropic.com")).length,
    0,
  );
});

test("a spontaneous application still requires a desired role and target company", async () => {
  assert.equal(
    (await generate({ applicationType: "spontaneous", company: "Beispiel AG" }))
      .status,
    400,
  );
  assert.equal(payloads.length, 0);
});

test("unknown application types are rejected", async () => {
  assert.equal(
    (await generate({ applicationType: "other", jobAd: description })).status,
    400,
  );
});

test("structured JobPosting data survives script removal", async () => {
  pages.set(jobUrl, {
    status: 200,
    body: `<html><script type="application/ld+json">${JSON.stringify({ "@graph": [{ "@type": "JobPosting", title: "Teamleitung Beratung", description: `<p>${description}</p>`, hiringOrganization: { name: "Beispiel AG" }, jobLocation: { address: { streetAddress: "Musterweg 1", postalCode: "8000", addressLocality: "Zürich" } } }] })}</script><body>Loading</body></html>`,
  });
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 200);
  assert.match(userPrompt(), /Teamleitung Beratung/);
  assert.ok(userPrompt().includes(description));
  assert.match(userPrompt(), /Musterweg 1/);
});

test("main content is used before a long navigation menu", async () => {
  pages.set(jobUrl, {
    status: 200,
    body: `<nav>${"Navigation ".repeat(1000)}</nav><main><h1>Teamleitung</h1><p>${description}</p></main>`,
  });
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 200);
  assert.ok(userPrompt().includes(description));
});

test("public redirects are followed", async () => {
  const target = "https://jobs.example.com/position";
  pages.set(jobUrl, { status: 302, headers: { location: target }, body: "" });
  pages.set(target, { status: 200, body: `<main>${description}</main>` });
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 200);
  assert.ok(userPrompt().includes(description));
});

test("redirects to private addresses are never requested", async () => {
  pages.set(jobUrl, {
    status: 302,
    headers: { location: "http://169.254.169.254/latest/meta-data" },
    body: "",
  });
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 400);
  assert.ok(requests.every((url) => !url.includes("169.254")));
  assert.equal(payloads.length, 0);
});

test("public hostnames resolving to a private address are blocked", async () => {
  dnsAddress = "127.0.0.1";
  pages.set(jobUrl, { status: 200, body: `<main>${description}</main>` });
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 400);
  assert.equal(payloads.length, 0);
});

test("credential-bearing and IPv6 URLs are rejected before fetching", async () => {
  for (const url of [
    "https://user:password@careers.example.com/job",
    "http://[::1]/job",
    "http://100.64.0.1/job",
  ]) {
    assert.equal(
      (await generate({ jobAdUrl: url, jobAd: description })).status,
      400,
    );
  }
  assert.equal(requests.length, 0);
});

test("an inaccessible link can use a pasted advert, but is never invented", async () => {
  pages.set(jobUrl, { status: 403, body: "Access denied" });
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 400);
  assert.equal(payloads.length, 0);
  assert.equal(
    (await generate({ jobAdUrl: jobUrl, jobAd: description })).status,
    200,
  );
  assert.ok(userPrompt().includes(description));
});

test("a challenge page is not mistaken for a job advert", async () => {
  pages.set(jobUrl, {
    status: 200,
    body: `<title>Just a moment...</title><body>${"Enable JavaScript and cookies to continue. ".repeat(10)}</body>`,
  });
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 400);
  assert.equal(payloads.length, 0);
});

test("manual recipient details and untrusted source boundaries are in the prompt", async () => {
  assert.equal(
    (
      await generate({
        jobAd: description,
        company: "Beispiel AG",
        companyStreet: "Wunschweg 8",
        recipient: "Frau Muster",
      })
    ).status,
    200,
  );
  assert.match(userPrompt(), /Wunschweg 8/);
  assert.match(userPrompt(), /Manuelle Nutzereingaben.*Vorrang/);
  assert.match(
    payloads[0].system,
    /Anweisungen.*(?:Inhalt|Daten).*nicht.*Systemanweisungen/,
  );
});

test("authentication and subscription checks precede any external requests", async () => {
  assert.equal((await generate({ jobAdUrl: jobUrl }, "")).status, 401);
  assert.equal((await generate({ jobAdUrl: jobUrl }, "invalid")).status, 401);
  paid = false;
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 402);
  assert.equal(requests.length, 0);
});

test("compressed job pages are decoded before extraction", async () => {
  for (const [encoding, compress] of [
    ["gzip", gzipSync],
    ["deflate", deflateSync],
    ["br", brotliCompressSync],
  ]) {
    pages.set(jobUrl, {
      status: 200,
      headers: { "content-encoding": encoding },
      body: compress(Buffer.from(`<main>${description}</main>`)),
    });
    assert.equal((await generate({ jobAdUrl: jobUrl })).status, 200);
    assert.ok(userPrompt().includes(description));
  }
});

test("malformed structured data falls back to readable HTML with decoded entities", async () => {
  pages.set(jobUrl, {
    status: 200,
    body: `<script type="application/ld+json">invalid</script><article><p>M&#xFC;ller &amp; S&#246;hne</p><p>${description}</p></article>`,
  });
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 200);
  assert.match(userPrompt(), /Müller & Söhne/);
});

test("relative redirects work and redirect loops are bounded", async () => {
  pages.set(jobUrl, { status: 301, headers: { location: "/current" } });
  pages.set("https://careers.example.com/current", {
    status: 200,
    body: `<main>${description}</main>`,
  });
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 200);
  pages.set(jobUrl, { status: 302, headers: { location: jobUrl } });
  requests = [];
  payloads = [];
  assert.equal((await generate({ jobAdUrl: jobUrl })).status, 400);
  assert.equal(requests.filter((url) => url === jobUrl).length, 4);
  assert.equal(payloads.length, 0);
});

test("unsupported content, oversized pages and broken streams fail safely", async () => {
  for (const page of [
    {
      status: 200,
      headers: { "content-type": "application/pdf" },
      body: description,
    },
    { status: 200, body: "x".repeat(2_000_001) },
    { status: 200, error: true },
    { status: 200, headers: { "content-encoding": "gzip" }, body: "not-gzip" },
  ]) {
    pages.set(jobUrl, page);
    assert.equal((await generate({ jobAdUrl: jobUrl })).status, 400);
    assert.equal(payloads.length, 0);
  }
});

test("spontaneous applications with manual company data do not depend on website availability", async () => {
  pages.set(jobUrl, { status: 403, body: "Access denied" });
  assert.equal(
    (
      await generate({
        applicationType: "spontaneous",
        jobTitle: "Teamleitung",
        company: "Beispiel AG",
        jobAdUrl: jobUrl,
      })
    ).status,
    200,
  );
  assert.match(userPrompt(), /Kein Website-Inhalt vorhanden/);
  assert.match(payloads[0].system, /fehlen Fakten/);
});

test("an employer's imprint can supplement recipient details", async () => {
  pages.set("https://careers.example.com/impressum", {
    status: 200,
    body: `<main>Beispiel AG, Empfängerweg 2, 8000 Zürich. ${description}</main>`,
  });
  assert.equal(
    (await generate({ jobAdUrl: jobUrl, jobAd: description })).status,
    200,
  );
  assert.match(userPrompt(), /Empfängerweg 2/);
  assert.match(
    userPrompt(),
    /Adresse eines Stellenportals ist keine Arbeitgeberadresse/,
  );
});

test("the Word export recognises the spontaneous application subject", async () => {
  const subject = "Initiativbewerbung als Teamleitung";
  const response = await exportWord(
    new Request("https://example.test/api/motivation-letter/docx", {
      method: "POST",
      headers: {
        authorization: "Bearer valid",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        letter: `${subject}\n\nSehr geehrte Frau Muster\n\nEin individueller Entwurf.\n\nFreundliche Grüsse\nTestperson Muster`,
      }),
    }),
  );
  assert.equal(response.status, 200);
  const zip = await require("jszip").loadAsync(
    Buffer.from(await response.arrayBuffer()),
  );
  const xml = await zip.file("word/document.xml").async("string");
  const paragraph = xml.match(/<w:p>[^]*?<\/w:p>/)[0];
  assert.ok(paragraph.includes(subject));
  assert.match(paragraph, /<w:b\/>/);
});

test("career changes and missing direct qualifications do not instruct the model to refuse", async () => {
  for (const applicationType of ["reactive", "spontaneous"]) {
    payloads = [];
    assert.equal(
      (
        await generate({
          applicationType,
          jobTitle: "Softwareentwicklung",
          company: "Beispiel AG",
          jobAd:
            "Gesucht ist Erfahrung in Softwareentwicklung sowie ein abgeschlossenes Informatikstudium.",
        })
      ).status,
      200,
    );
    assert.match(payloads[0].system, /auch bei (?:einem )?Quereinstieg/i);
    assert.doesNotMatch(payloads[0].system, /NO_MATCH|erstelle KEIN Schreiben/);
    assert.match(payloads[0].system, /(?:fehlende|Fehlende).*Qualifikationen/);
    assert.match(payloads[0].system, /Erfinde keine.*Abschluesse/);
  }
});

test("an obsolete model refusal is handled as an invalid draft, not a CV rejection", async () => {
  modelLetter = "NO_MATCH: Der Abschluss fehlt.";
  const response = await generate({
    jobTitle: "Softwareentwicklung",
    jobAd: description,
  });
  assert.equal(response.status, 502);
  const result = await response.json();
  assert.equal(result.noMatch, undefined);
  assert.doesNotMatch(result.error, /Ihr CV passt/);
});

const letterParagraphs = [
  "Ihre ausgeschriebene Funktion verbindet die Arbeit mit Menschen mit klaren organisatorischen Aufgaben. Genau diese Verbindung prägt meinen bisherigen Berufsweg. Ich möchte meine Erfahrung in Personalführung und Kundenbetreuung in Ihr Team einbringen und die fachlichen Anforderungen der neuen Funktion gezielt kennenlernen. An Ihrem Unternehmen interessieren mich die beschriebenen Aufgaben und die Möglichkeit, gemeinsam mit erfahrenen Kolleginnen und Kollegen zu tragfähigen Lösungen beizutragen. Dabei ist mir wichtig, dass die Zusammenarbeit auf nachvollziehbaren Zielen beruht und die Bedürfnisse der Kundschaft im täglichen Handeln berücksichtigt werden.",
  "In meiner bisherigen Tätigkeit habe ich ein Beratungsteam begleitet, neue Mitarbeitende eingearbeitet und die Betreuung von Kunden organisiert. Dazu gehörten die Vorbereitung von Gesprächen, die Abstimmung von Terminen sowie die sorgfältige Nachverfolgung vereinbarter Aufgaben. Ich habe gelernt, unterschiedliche Anliegen zu ordnen und auch bei gleichzeitig eintreffenden Anfragen den Überblick zu behalten. Diese Erfahrungen möchte ich für einen verantwortungsvollen Einstieg in das neue Tätigkeitsfeld nutzen. Die fachlichen Kenntnisse, die mir für einzelne Aufgaben noch fehlen, werde ich im Rahmen der Einarbeitung gezielt aufbauen.",
  "Im Arbeitsalltag lege ich Wert auf eine klare Abstimmung und einen respektvollen Umgang. Wenn unterschiedliche Erwartungen zusammentreffen, suche ich zuerst das Gespräch und halte die nächsten Schritte verständlich fest. Aus der Arbeit mit meinem bisherigen Team bringe ich Erfahrung darin mit, Rückmeldungen aufzunehmen und gemeinsam nach praktikablen Verbesserungen zu suchen. Bei einem Quereinstieg kann ich damit an vertraute Aufgaben anknüpfen und zugleich von den Erfahrungen des neuen Teams lernen. Ich möchte mich Schritt für Schritt mit den Abläufen vertraut machen und Verantwortung übernehmen.",
  "Sie gewinnen mit mir eine Person, die ihre bisherigen Erfahrungen bewusst in ein neues Umfeld einbringen möchte. Ich kann Ihr Team insbesondere bei der strukturierten Bearbeitung von Anliegen und in der Zusammenarbeit mit unterschiedlichen Beteiligten unterstützen. Welche fachlichen Schwerpunkte beim Einstieg besonders wichtig sind und wie meine Erfahrungen zu Ihren Anforderungen passen, bespreche ich gerne persönlich mit Ihnen. Ich freue mich darauf, mehr über die Aufgaben und Ihre Erwartungen an die Zusammenarbeit zu erfahren.",
];
const compactLetter = [
  "Testperson Muster\nBeispielstrasse 123\n8000 Musterstadt\nTelefon 079 000 00 00\ntestperson@example.test",
  "Beispielunternehmen AG\nAbteilung Personal und Entwicklung\nFrau Test Empfängerin\nEmpfängerstrasse 45\n8001 Musterstadt",
  "Musterstadt, 3. November 2026",
  "Bewerbung als Mitarbeiterin oder Mitarbeiter in der fachlichen Beratung und Kundenbetreuung",
  "Sehr geehrte Frau Empfängerin",
  ...letterParagraphs,
  "Freundliche Grüsse\nTestperson Muster",
].join("\n\n");

async function exportLetter(letter) {
  const response = await exportWord(
    new Request("https://example.test/api/motivation-letter/docx", {
      method: "POST",
      headers: {
        authorization: "Bearer valid",
        "content-type": "application/json",
      },
      body: JSON.stringify({ letter }),
    }),
  );
  assert.equal(response.status, 200);
  return Buffer.from(await response.arrayBuffer());
}

test("Word text uses single line spacing and no added paragraph spacing", async () => {
  const buffer = await exportLetter(compactLetter);
  const zip = await require("jszip").loadAsync(buffer);
  const xml = await zip.file("word/document.xml").async("string");
  for (const paragraph of xml.match(/<w:p\b[^]*?<\/w:p>/g)) {
    assert.match(paragraph, /w:before="0"/);
    assert.match(paragraph, /w:after="0"/);
    if (paragraph.includes("<w:t"))
      assert.match(paragraph, /w:line="240"[^>]*w:lineRule="auto"/);
  }
  const text = (await require("mammoth").extractRawText({ buffer })).value;
  for (const paragraph of letterParagraphs) assert.ok(text.includes(paragraph));
});

test("existing bullet and mixed text blocks keep their complete content in Word", async () => {
  for (const block of [
    "- Personalführung\n- Kundenbetreuung",
    "Mein Angebot:\n- Personalführung\n- Kundenbetreuung",
  ]) {
    const buffer = await exportLetter(
      `Bewerbung als Teamleitung\n\n${block}\n\nFreundliche Grüsse\nTestperson Muster`,
    );
    const zip = await require("jszip").loadAsync(buffer);
    const xml = await zip.file("word/document.xml").async("string");
    assert.equal((xml.match(/<w:numPr>/g) || []).length, 2);
    const text = (await require("mammoth").extractRawText({ buffer })).value;
    assert.match(text, /Personalführung/);
    assert.match(text, /Kundenbetreuung/);
  }
});

test(
  "the complete Word letter stays on one A4 page",
  { skip: !process.env.CV_EXPORT_RENDER_WORD },
  async () => {
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "cvolution-letter-export-"),
    );
    const docxPath = path.join(directory, "motivationsschreiben.docx");
    fs.writeFileSync(docxPath, await exportLetter(compactLetter));
    execFileSync(
      "soffice",
      ["--headless", "--convert-to", "pdf", "--outdir", directory, docxPath],
      { stdio: "pipe" },
    );
    const info = execFileSync(
      "pdfinfo",
      [path.join(directory, "motivationsschreiben.pdf")],
      { encoding: "utf8" },
    );
    assert.match(info, /Pages:\s+1\b/, `artifact: ${docxPath}`);
    assert.match(info, /A4/);
  },
);
