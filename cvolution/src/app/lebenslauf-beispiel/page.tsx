import Link from "next/link";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideSchema } from "@/components/seo/GuideSchema";
import { metaFor } from "@/lib/seo-pages";
import { SERVICE_DOWNLOADS_PATH } from "@/lib/service-downloads";
import {
  CV_TEMPLATE_LABEL,
  CvTemplatePreview,
  KlassischSnippet,
  type CvData,
  type CvStation,
  type CvTemplate,
} from "@/components/content/CvTemplatePreview";

export const metadata = metaFor("/lebenslauf-beispiel", { type: "article" });

const faqData = [
  {
    question: "Welches Lebenslauf-Beispiel passt zu mir?",
    answer:
      "Wenn Sie gerade die Lehre oder das Studium abgeschlossen haben, orientieren Sie sich am Beispiel Berufseinstieg: Lehrbetrieb, Praktika und Nebenjobs füllen die Berufserfahrung, die Ausbildung folgt direkt danach. Mit einigen Jahren Erfahrung passt das Beispiel Fachkraft. Als Kader oder Führungsperson nennen Sie bei jeder Station Führungsspanne, Budget und Ergebnisse, wie im dritten Beispiel.",
  },
  {
    question: "Wie unterscheidet sich ein Schweizer Lebenslauf von einem deutschen?",
    answer:
      "In der Schweiz ist ein professionelles Foto Standard. Das Dokument wird als Teil eines vollständigen Bewerbungsdossiers eingereicht (mit Zeugnissen und Diplomen). Der Begriff «Lebenslauf» ist üblich – nicht CV oder Resume. Die Sprache ist formell (Sie), und das Datum-Format ist TT.MM.JJJJ.",
  },
  {
    question: "Welche Angaben sind im Schweizer Lebenslauf Pflicht?",
    answer:
      "Unsere Vorlagen enthalten genau diese Angaben: Name, Adresse, Telefon, E-Mail, Geburtsdatum, Zivilstand und Heimatort mit Foto, danach Berufliche Erfahrung, Aus- & Weiterbildungen sowie Kenntnisse & Fähigkeiten mit Fremdsprachen, Führerschein und Programmen. Weitere Abschnitte braucht es nicht.",
  },
  {
    question: "Soll ich mein Geburtsdatum im Lebenslauf angeben?",
    answer:
      "In der Schweiz ist das Geburtsdatum verbreitet und wird von vielen Arbeitgebern erwartet. Es ist keine Pflicht, aber üblich. Dazu gehören Zivilstand und Heimatort. Ohne Schweizer Bürgerrecht nennen Sie statt des Heimatorts Nationalität und Bewilligung, damit Arbeitgebende sehen, ob eine Arbeitsbewilligung nötig ist.",
  },
  {
    question: "Soll ich meinen Lebenslauf antichronologisch oder nach Kompetenzen aufbauen?",
    answer:
      "Antichronologisch: Die neueste Stelle steht zuoberst, die Berufliche Erfahrung kommt immer vor den Aus- & Weiterbildungen. So sind alle CVolution-Vorlagen aufgebaut. Kompetenzen zeigen Sie in den Tätigkeiten der einzelnen Stationen – auch als Quereinsteiger.",
  },
  {
    question: "Wie beschreibe ich meine Aufgaben im Lebenslauf am besten?",
    answer:
      "Mit Aktivverben und konkreten Ergebnissen: «Leitete ein Team von 8 Personen», «Steigerte den Umsatz um 20 %», «Implementierte ein neues CRM-System». Vermeiden Sie passive Formulierungen wie «War zuständig für...».",
  },
];

type CvExample = {
  id: string;
  label: string;
  heading: string;
  intro: string;
  template: CvTemplate;
  cv: CvData;
  tips: string[];
};

const cvExamples: CvExample[] = [
  {
    id: "berufseinstieg",
    label: "Berufseinstieg nach der Lehre",
    heading: "Lebenslauf Beispiel: Berufseinstieg nach der Lehre",
    intro:
      "Für Lehrabgängerinnen, Lehrabgänger und Personen mit wenig Berufserfahrung. Ausbildung, Lehrbetrieb und Nebenjobs tragen den Lebenslauf.",
    template: "modern",
    cv: {
      name: "Laura Muster",
      position: "Kauffrau EFZ mit Berufsmaturität",
      address: "Bahnhofstrasse 5\n5000 Aarau",
      phone: "079 000 00 00",
      email: "laura.muster@muster.ch",
      birthdate: "14. März 2006",
      civilStatus: "ledig",
      origin: "Aarau, Schweiz",
      education: [
        { dates: "08.2022 – 07.2025", role: "Kauffrau EFZ, Profil E", org: "Musterversicherung AG, Aarau", tasks: ["Abschlussnote 5.2", "Berufsmaturität kaufmännisch, BMS Aarau"] },
        { dates: "08.2019 – 07.2022", role: "Bezirksschule", org: "Aarau" },
      ],
      experience: [
        { dates: "08.2025 – heute", role: "Sachbearbeiterin Kundendienst (befristet)", org: "Musterversicherung AG, Aarau", tasks: ["Bearbeitung von rund 40 Kundenanfragen pro Tag per Telefon und E-Mail", "Erfassung von Policenänderungen im Kernsystem"] },
        { dates: "2022 – heute", role: "Juniorentrainerin Handball (ehrenamtlich)", org: "Handballclub Aarau", tasks: ["Training von 14 Juniorinnen U13, zweimal pro Woche"] },
        { dates: "08.2022 – 07.2025", role: "Lernende Kauffrau", org: "Musterversicherung AG, Aarau", tasks: ["Einsätze in Schadenabteilung, Buchhaltung und Empfang", "Eigenständige Betreuung des Lernenden-Instagram-Kanals"] },
        { dates: "2021 – 2024", role: "Aushilfe Verkauf (Samstage)", org: "Musterbäckerei, Aarau" },
      ],
      languages: [["Deutsch", "Muttersprache"], ["Englisch", "B2 (First Certificate)"], ["Französisch", "B1"]],
      programs: "MS Office (Excel fortgeschritten), SAP Grundkenntnisse",
    },
    tips: [
      "Auch die Lehre zählt als Berufserfahrung: Einsätze im Lehrbetrieb gehören mit Tätigkeiten in diesen Abschnitt.",
      "Noten und Berufsmaturität gehören hinein, wenn sie gut sind.",
      "Nebenjobs und Vereinstätigkeit zeigen Zuverlässigkeit und Verantwortung.",
    ],
  },
  {
    id: "fachkraft",
    label: "Erfahrene Fachkraft",
    heading: "Lebenslauf Beispiel: Erfahrene Fachkraft",
    intro:
      "Typischer Lebenslauf für eine Fachkraft mit rund 8 Jahren Berufserfahrung im Schweizer Format. Die Berufserfahrung steht oben, mit messbaren Ergebnissen.",
    template: "klassisch",
    cv: {
      name: "Max Mustermann",
      position: "Senior Marketing Manager",
      address: "Musterstrasse 12\n8000 Zürich",
      phone: "076 000 00 00",
      email: "max.mustermann@muster.ch",
      birthdate: "10. Januar 1990",
      civilStatus: "verheiratet, 2 Kinder",
      origin: "Zürich, Schweiz",
      experience: [
        { dates: "02.2022 – heute", role: "Senior Marketing Manager", org: "Musterfirma AG, Zürich", tasks: ["Leitung des digitalen Marketings (Budget CHF 2 Mio.)", "Führung eines 5-köpfigen Teams", "Steigerung der organischen Reichweite um 45 %", "Einführung von Marketing-Automation (HubSpot)"] },
        { dates: "05.2019 – 01.2022", role: "Marketing Manager", org: "Zweite Firma GmbH, Basel", tasks: ["Aufbau des Content-Marketings von Grund auf", "Planung und Umsetzung von 12 Kampagnen pro Jahr", "Reporting und KPI-Analysen für die Geschäftsleitung"] },
        { dates: "08.2017 – 04.2019", role: "Marketing Assistant", org: "Dritte AG, Bern", tasks: ["Organisation von Events und Messen", "Betreuung der Social-Media-Kanäle"] },
      ],
      education: [
        { dates: "2023", role: "CAS Digital Marketing", org: "Hochschule Luzern" },
        { dates: "09.2014 – 07.2017", role: "Bachelor of Science in Betriebsökonomie", org: "Fachhochschule Nordwestschweiz" },
        { dates: "08.2010 – 07.2013", role: "Kaufmann EFZ mit Berufsmaturität", org: "Muster AG, Bern" },
      ],
      languages: [["Deutsch", "Muttersprache"], ["Englisch", "C1"], ["Französisch", "B2"]],
      driverLicense: "Kategorie B",
      programs: "HubSpot, Google Analytics 4, Adobe Creative Suite, MS Office",
    },
    tips: [
      "Jede Station nennt Verantwortung und mindestens ein messbares Ergebnis.",
      "Weiterbildungen (CAS) zeigen, dass das Fachwissen aktuell bleibt.",
      "Ältere Stationen sind kürzer beschrieben als die aktuelle Stelle.",
    ],
  },
  {
    id: "fuehrungsperson",
    label: "Führungsperson",
    heading: "Lebenslauf Beispiel: Führungsperson",
    intro:
      "Für Kader und Führungspersonen mit langjähriger Erfahrung. Führungsspanne, Budget und Erfolge stehen direkt bei den einzelnen Stationen.",
    template: "zeitlos",
    cv: {
      name: "Andrea Beispiel",
      position: "CFO und Mitglied der Geschäftsleitung",
      address: "Seeweg 3\n6300 Zug",
      phone: "078 000 00 00",
      email: "andrea.beispiel@muster.ch",
      birthdate: "2. Juni 1978",
      civilStatus: "verheiratet",
      origin: "Zug, Schweiz",
      experience: [
        { dates: "04.2018 – heute", role: "CFO und Mitglied der Geschäftsleitung", org: "Muster Industrie AG, Zug (Umsatz CHF 320 Mio., 900 Mitarbeitende)", tasks: ["Führung von Finanzen, Controlling, IT und HR mit 35 Mitarbeitenden", "Umstellung auf Swiss GAAP FER und Verkürzung des Monatsabschlusses von 12 auf 5 Tage", "Refinanzierung über CHF 80 Mio. zu besseren Konditionen"] },
        { dates: "01.2012 – 03.2018", role: "Leiterin Controlling", org: "Handels AG, Luzern", tasks: ["Aufbau eines konzernweiten Reportings für 14 Gesellschaften", "Führung von 8 Mitarbeitenden"] },
        { dates: "2003 – 2011", role: "Verschiedene Funktionen in Revision und Controlling", org: "Revisions AG, Zürich" },
      ],
      education: [
        { dates: "2015 – 2016", role: "Executive MBA", org: "Universität St. Gallen (HSG)" },
        { dates: "2006 – 2009", role: "Eidg. dipl. Expertin in Rechnungslegung und Controlling" },
        { dates: "1998 – 2002", role: "lic. oec. publ.", org: "Universität Zürich" },
      ],
      languages: [["Deutsch", "Muttersprache"], ["Englisch", "C2"], ["Französisch", "C1"]],
      driverLicense: "Kategorie B",
      programs: "SAP S/4HANA, Power BI",
    },
    tips: [
      "Die Position in der Kopfzeile zeigt sofort, auf welcher Ebene sich die Person bewirbt.",
      "Unternehmensgrösse und Führungsspanne geben Ergebnissen den Massstab.",
      "Frühe Stationen werden zusammengefasst – der Lebenslauf bleibt bei zwei Seiten.",
    ],
  },
];

const beforeStation: CvStation = {
  dates: "2019 – 2022",
  role: "Projektmanager",
  org: "Firma AG",
  tasks: ["Projektleitung", "Kommunikation mit Kunden", "Budgetverantwortung"],
};

const afterStation: CvStation = {
  dates: "01.2019 – 12.2022",
  role: "Projektleiter (100 %)",
  org: "Firma AG, Zürich",
  tasks: [
    "Leitete 6 parallele IT-Projekte mit Gesamtbudget von CHF 1,8 Mio.",
    "Koordinierte 4 externe Lieferanten und 12 interne Stakeholder",
    "Reduzierte Projektdurchlaufzeiten durch agile Methoden um 30 %",
  ],
};

function CvExampleSection({ example }: { example: CvExample }) {
  const templateLabel = CV_TEMPLATE_LABEL[example.template];
  return (
    <section id={example.id} className="mb-10 scroll-mt-24 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold text-[#111827] mb-3">{example.heading}</h2>
      <p className="text-[#64748B] text-sm mb-4">{example.intro}</p>
      <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#204878]">
        Design «{templateLabel}» – als Word-Vorlage und im Self-Service erhältlich
      </p>

      <CvTemplatePreview data={example.cv} template={example.template} />

      <h3 className="mt-6 mb-2 text-base font-semibold text-[#111827]">Darauf kommt es bei diesem Beispiel an</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-[#374151]">
        {example.tips.map((tip) => <li key={tip}>{tip}</li>)}
      </ul>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          href={SERVICE_DOWNLOADS_PATH}
          className="inline-flex items-center justify-center rounded-xl bg-[#204878] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a63]"
        >
          Word-Vorlage «{templateLabel}» herunterladen
        </Link>
        <Link
          href="/self"
          className="inline-flex items-center justify-center rounded-xl border border-[#204878]/20 px-4 py-2.5 text-sm font-semibold text-[#204878] transition-colors hover:bg-blue-50"
        >
          Im Self-Service als PDF erstellen
        </Link>
      </div>
    </section>
  );
}

export default function LebenslaufBeispiel() {
  return (
    <>
      <GuideSchema path="/lebenslauf-beispiel" faqs={faqData} />
      <main className="bg-[#F8FAFC] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* Hero */}
          <div className="mb-10">
            <p className="text-sm font-medium text-[#204878] uppercase tracking-wide mb-2">Bewerbungsratgeber</p>
            <h1 className="text-4xl font-bold text-[#111827] leading-tight mb-4">
              Lebenslauf Beispiel Schweiz – Vollständige Muster für alle Karrierestufen
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Ein konkretes Beispiel sagt mehr als tausend Regeln. Auf dieser Seite finden Sie vollständige
              Lebenslauf-Muster für verschiedene Karrieresituationen: Berufseinsteiger, erfahrene Fachkräfte und
              Führungspersonen – jeweils mit Erklärungen zu jedem Abschnitt.
            </p>
          </div>

          <nav aria-label="Beispiele auf dieser Seite" className="mb-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#204878]">Drei Lebenslauf-Beispiele</p>
            <ol className="grid gap-3 sm:grid-cols-3">
              {cvExamples.map((example, index) => (
                <li key={example.id}>
                  <a href={`#${example.id}`} className="block rounded-xl bg-[#F8FAFC] p-4 text-[#204878] transition hover:bg-blue-50">
                    <span className="block text-xs font-semibold text-[#64748B]">Beispiel {index + 1}</span>
                    <span className="font-semibold">{example.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {cvExamples.map((example) => (
            <CvExampleSection key={example.id} example={example} />
          ))}

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Was macht diese Beispiele stark?</h2>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Konkrete Zahlen:</strong> Budgetverantwortung, Teamgrösse, Prozentangaben – das schafft Glaubwürdigkeit</>,
                <><strong>Aktivverben:</strong> «Leitete», «baute auf», «steigerte» – keine passive Sprache</>,
                <><strong>Relevante Stationen:</strong> Nur Stellen, die für die Zielposition relevant sind</>,
                <><strong>Gewichtung nach Karrierestufe:</strong> Berufserfahrung steht immer vor Aus- und Weiterbildungen; beim Berufseinstieg zählen Lehre, Praktika und Nebenjobs, bei Führungspersonen Führungsspanne, Budget und Ergebnisse</>,
                <><strong>Klare Struktur:</strong> Überschriften, einheitliche Formatierung, kein Informationsüberfluss</>,
                <><strong>Spezifische Tools:</strong> Software-Kenntnisse konkret benannt, nicht nur «MS Office»</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold text-[#111827] mb-3">Berufserfahrung: Vorher / Nachher Vergleich</h2>
            <p className="text-[#64748B] text-sm mb-5">
              Dieselbe Station zweimal im Design «Klassisch»: einmal mit reinen Stichworten, einmal mit Pensum, Ort,
              Monatsangaben und messbaren Ergebnissen.
            </p>
            <div className="space-y-5">
              <div>
                <p className="mb-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Schwach</p>
                <KlassischSnippet title="Berufliche Erfahrung" stations={[beforeStation]} />
              </div>
              <div>
                <p className="mb-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Stark</p>
                <KlassischSnippet title="Berufliche Erfahrung" stations={[afterStation]} />
              </div>
            </div>
          </section>

          {/* Internal links - card grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/lebenslauf-vorlage-schweiz", label: "Lebenslauf Vorlage Schweiz – Kostenlose Muster" },
                { href: "/lebenslauf-aufbau", label: "Lebenslauf Aufbau – Schritt für Schritt erklärt" },
                { href: "/lebenslauf-fehler", label: "Lebenslauf Fehler – Die häufigsten Fehler und wie Sie diese vermeiden" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="block p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[#204878] font-medium">
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Häufig gestellte Fragen</h2>
            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-semibold text-[#111827] mb-2">{faq.question}</h3>
                  <p className="text-[#374151] leading-relaxed text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <GuideCta path="/lebenslauf-beispiel" />

        </div>
      </main>
    </>
  );
}
