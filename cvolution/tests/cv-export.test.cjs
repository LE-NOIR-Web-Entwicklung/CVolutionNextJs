// Node 22+: node --test tests/cv-export.test.cjs
// Include LibreOffice rendering: CV_EXPORT_RENDER_WORD=1 node --test tests/cv-export.test.cjs
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS loader isolates Supabase and compiles TS/TSX without adding a test framework. */
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const Module = require("node:module");
const ts = require("typescript");
const JSZip = require("jszip");
const mammoth = require("mammoth");
const React = require("react");
const { pdf } = require("@react-pdf/renderer");
const sharp = require("sharp");

const sourceRoot = path.resolve(__dirname, "..");
const outputDirectory = process.env.CV_EXPORT_ARTIFACTS
  ? path.resolve(process.env.CV_EXPORT_ARTIFACTS)
  : fs.mkdtempSync(path.join(os.tmpdir(), "cvolution-cv-export-"));
fs.mkdirSync(outputDirectory, { recursive: true });

const originalExtensions = {};
for (const extension of [".ts", ".tsx"]) {
  originalExtensions[extension] = Module._extensions[extension];
  Module._extensions[extension] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        inlineSourceMap: true,
        inlineSources: true,
      },
      fileName: filename,
    });
    module._compile(output.outputText, filename);
  };
}

const bullets = [
  "Strategische, operative und personelle Leitung eines Unternehmensbereichs mit klaren Wachstumszielen.",
  "Führung und Betreuung der unterstellten Mitarbeitenden inklusive jährlicher Mitarbeitergespräche sowie Förderungs- und fachlicher Weiterbildung.",
  "Erstellen von Monats- und Jahresbudgets sowie Überprüfung der Zielerreichung und Ableitung konkreter Massnahmen.",
  "Durchführung von Monats- und Jahresabschlüssen in Zusammenarbeit mit Finance und externen Partnern.",
  "Erarbeitung und Umsetzung kundenorientierter, innovativer Strategien und Konzepte zur nachhaltigen Sicherung des Erfolgs.",
  "Akquisition und Betreuung von Key Accounts sowie Ausbau langfristiger Kundenbeziehungen.",
];
const fixture = {
  user: { id: "user-1", email: "testperson@example.test" },
  profile: {
    user_id: "user-1",
    paid: true,
    subscription_status: "active",
    subscription_current_period_end: "2099-01-01",
    full_name: "Testperson Muster",
    headline: "Leitung Betrieb",
    location: "Beispielstrasse 1, 8000 Musterstadt",
    phone: "079 000 00 00",
    birthdate: "1990-01-01",
    civil_status: "verheiratet, 2 Kinder",
    place_of_origin: "Musterstadt, Schweiz",
    profile_picture_url: "https://example.test/cv-photo.png",
  },
  experiences: [
    {
      id: "exp-1",
      job_title: "Bereichsleitung",
      company: "Beispiel AG",
      location: "Musterstadt",
      start_date: "2022-01-01",
      is_current: true,
      description: bullets.join("\n"),
    },
    {
      id: "exp-2",
      job_title: "Betriebsleitung",
      company: "Musterbetrieb AG",
      location: "Beispielort",
      start_date: "2019-07-01",
      end_date: "2021-12-31",
      description: bullets.slice(0, 4).join("\n"),
    },
    {
      id: "exp-3",
      job_title: "Beratung",
      company: "Testberatung AG",
      location: "Musterort",
      start_date: "2018-01-01",
      end_date: "2019-07-01",
      description: "",
    },
    {
      id: "exp-4",
      job_title: "Junior Beratung",
      company: "Beispielteam AG",
      location: "Teststadt",
      start_date: "2017-03-01",
      end_date: "2017-12-31",
      description: "",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Eidg. Dipl. HR-Leiter",
      institution: "eFachausweis",
      place: "Luzern",
      start_date: "2023-01-01",
      end_date: "2023-10-31",
    },
    {
      id: "edu-2",
      degree: "Eidg. Dipl. HR-Fachmann",
      institution: "HKV",
      place: "Aarau",
      start_date: "2020-05-01",
      end_date: "2021-10-31",
    },
    {
      id: "edu-3",
      degree: "Sachbearbeiter Personal",
      institution: "HKV",
      place: "Aarau",
      start_date: "2018-01-01",
      end_date: "2018-12-31",
    },
    {
      id: "edu-4",
      degree: "Kaufmännische Ausbildung EFZ",
      institution: "Beispiel Logistik AG",
      place: "Musterort",
      start_date: "2013-08-01",
      end_date: "2016-08-31",
    },
  ],
  skills: [],
  languages: [
    { id: "lang-1", language_name: "Deutsch", proficiency: "Muttersprache" },
    { id: "lang-2", language_name: "Englisch", proficiency: "C1" },
    { id: "lang-3", language_name: "Albanisch", proficiency: "Muttersprache" },
    { id: "lang-4", language_name: "Mazedonisch", proficiency: "C1" },
  ],
};

function result(data) {
  return Promise.resolve({ data, error: null });
}
function table(data, profile = false) {
  const query = {
    eq() {
      return profile ? { single: () => result(data) } : query;
    },
    order() {
      return result(data);
    },
    then: result(data).then.bind(result(data)),
  };
  return { select: () => query };
}
let activeFixture = fixture;
const supabaseStub = {
  supabaseAdmin: {
    auth: {
      getUser: async () => ({
        data: { user: activeFixture.user },
        error: null,
      }),
    },
    from(name) {
      const data = {
        profiles: activeFixture.profile,
        experiences: activeFixture.experiences,
        education: activeFixture.education,
        skills: activeFixture.skills,
        languages: activeFixture.languages,
      }[name];
      return table(data, name === "profiles");
    },
  },
};
const originalLoad = Module._load;
Module._load = function load(request, parent, isMain) {
  if (request.endsWith("supabase-server")) return supabaseStub;
  return originalLoad.call(this, request, parent, isMain);
};
const originalFetch = global.fetch;
global.fetch = async (input, init) => {
  if (String(input).startsWith("https://example.test/cv-photo.png")) {
    const image = await sharp({
      create: { width: 1, height: 1, channels: 3, background: "#204878" },
    })
      .png()
      .toBuffer();
    return new Response(image, {
      status: 200,
      headers: { "content-type": "image/png" },
    });
  }
  throw new Error(`Unexpected network request: ${String(input)}`);
};

const { POST } = require(path.join(sourceRoot, "src/app/api/cv/docx/route.ts"));
const { CVPdfDocument } = require(
  path.join(sourceRoot, "src/components/CVExport/pdf/CVPdfDocument.tsx"),
);

async function createWord(design, data = fixture, suffix = "") {
  activeFixture = data;
  const request = new Request("https://example.test/api/cv/docx", {
    method: "POST",
    headers: {
      authorization: "Bearer test-token",
      "content-type": "application/json",
    },
    body: JSON.stringify({ design }),
  });
  const response = await POST(request);
  assert.equal(response.status, 200);
  const buffer = Buffer.from(await response.arrayBuffer());
  const docxPath = path.join(outputDirectory, `${design}${suffix}.docx`);
  fs.writeFileSync(docxPath, buffer);
  return { buffer, docxPath };
}
async function documentXml(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  return zip.file("word/document.xml").async("string");
}
function pageCount(docxPath) {
  const pdfDirectory = path.join(outputDirectory, "pdf");
  fs.mkdirSync(pdfDirectory, { recursive: true });
  execFileSync(
    "soffice",
    ["--headless", "--convert-to", "pdf", "--outdir", pdfDirectory, docxPath],
    { stdio: "pipe" },
  );
  const info = execFileSync(
    "pdfinfo",
    [path.join(pdfDirectory, `${path.basename(docxPath, ".docx")}.pdf`)],
    { encoding: "utf8" },
  );
  return Number(
    info
      .split("\n")
      .find((line) => line.startsWith("Pages:"))
      .split(":")[1]
      .trim(),
  );
}

async function renderPdf(design, data = fixture, suffix = "") {
  const blob = await pdf(
    React.createElement(CVPdfDocument, { ...data, design }),
  ).toBlob();
  assert.ok(blob.size > 500);
  const buffer = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(
    path.join(outputDirectory, `${design}${suffix}-native.pdf`),
    buffer,
  );
  return (buffer.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
}

async function assertWordContent(buffer, data) {
  const { value } = await mammoth.extractRawText({ buffer });
  const expected = [
    data.profile.full_name,
    data.profile.location,
    data.profile.phone,
    data.user.email,
    data.profile.civil_status,
    data.profile.place_of_origin,
    ...data.experiences.flatMap((item) => [
      item.job_title,
      item.company,
      item.location,
      ...(item.description || "").split("\n"),
    ]),
    ...data.education.flatMap((item) => [
      item.degree,
      item.institution,
      item.place,
    ]),
    ...data.languages.flatMap((item) => [item.language_name, item.proficiency]),
    ...data.skills.map((item) => item.skill_name.replace("Führerschein ", "")),
  ];
  for (const text of expected.filter(Boolean))
    assert.ok(value.includes(text), `Missing content: ${text}`);
}
for (const design of ["design1", "design2", "design3"]) {
  test(`${design}: Word preserves the compact fixture`, async () => {
    const { buffer } = await createWord(design);
    await assertWordContent(buffer, fixture);
    assert.match(
      await documentXml(buffer),
      /<w:pgSz\b[^>]*w:w="11906"[^>]*w:h="16838"/,
    );
  });
  test(`${design}: PDF fits the compact fixture on one page`, async () => {
    assert.equal(await renderPdf(design), 1);
  });
  test(
    `${design}: Word is one A4 page for the compact fixture`,
    { skip: !process.env.CV_EXPORT_RENDER_WORD },
    async () => {
      const { docxPath } = await createWord(design);
      assert.equal(pageCount(docxPath), 1, `artifact: ${docxPath}`);
    },
  );
  test(`${design}: exports without a photo retain skills and driving licence`, async () => {
    const data = {
      ...fixture,
      profile: { ...fixture.profile, profile_picture_url: null },
      skills: [
        { skill_name: "Personalführung" },
        { skill_name: "Projektmanagement" },
        { skill_name: "Führerschein Kategorie B", category: "führerschein" },
      ],
    };
    const { buffer, docxPath } = await createWord(design, data, "-no-photo");
    await assertWordContent(buffer, data);
    assert.equal(await renderPdf(design, data, "-no-photo"), 1);
    if (process.env.CV_EXPORT_RENDER_WORD) assert.equal(pageCount(docxPath), 1);
  });
  test(`${design}: long CVs continue on further pages without dropping entries`, async () => {
    const data = {
      ...fixture,
      experiences: Array.from({ length: 16 }, (_, index) => ({
        ...fixture.experiences[0],
        id: `long-${index}`,
        job_title: `Weitere Station ${index}`,
        description: bullets.slice(0, 2).join("\n"),
      })),
    };
    const { buffer, docxPath } = await createWord(design, data, "-long");
    await assertWordContent(buffer, data);
    assert.ok((await renderPdf(design, data, "-long")) > 1);
    if (process.env.CV_EXPORT_RENDER_WORD) assert.ok(pageCount(docxPath) > 1);
  });
}
test.after(() => {
  Module._load = originalLoad;
  global.fetch = originalFetch;
  for (const extension of [".ts", ".tsx"]) {
    if (originalExtensions[extension])
      Module._extensions[extension] = originalExtensions[extension];
    else delete Module._extensions[extension];
  }
});
