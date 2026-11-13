import Link from "next/link";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideSchema } from "@/components/seo/GuideSchema";
import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/lebenslauf-beispiel", { type: "article" });

const faqData = [
  {
    question: "Welches Lebenslauf-Beispiel passt zu mir?",
    answer:
      "Wenn Sie gerade die Lehre oder das Studium abgeschlossen haben, orientieren Sie sich am Beispiel Berufseinstieg: Ausbildung zuerst. Mit einigen Jahren Erfahrung passt das Beispiel Fachkraft. Als Kader oder Führungsperson ergänzen Sie ein kurzes Profil mit Führungsspanne und Ergebnissen, wie im dritten Beispiel.",
  },
  {
    question: "Wie unterscheidet sich ein Schweizer Lebenslauf von einem deutschen?",
    answer:
      "In der Schweiz ist ein professionelles Foto Standard. Das Dokument wird als Teil eines vollständigen Bewerbungsdossiers eingereicht (mit Zeugnissen und Diplomen). Der Begriff «Lebenslauf» ist üblich – nicht CV oder Resume. Die Sprache ist formell (Sie), und das Datum-Format ist TT.MM.JJJJ.",
  },
  {
    question: "Welche Angaben sind im Schweizer Lebenslauf Pflicht?",
    answer:
      "Pflichtangaben: Name, Adresse, Telefon, E-Mail, Berufserfahrung mit Daten und Arbeitgebern, Ausbildung. Empfohlen: Nationalität, Geburtsdatum, Sprachkenntnisse, IT-Kenntnisse. Optional: Interessen, LinkedIn-Profil.",
  },
  {
    question: "Soll ich mein Geburtsdatum im Lebenslauf angeben?",
    answer:
      "In der Schweiz ist das Geburtsdatum verbreitet und wird von vielen Arbeitgebern erwartet. Es ist keine Pflicht, aber üblich. Auch die Nationalität wird häufig angegeben – besonders relevant für Arbeitgebende, die wissen müssen, ob eine Arbeitsbewilligung benötigt wird.",
  },
  {
    question: "Was ist der Unterschied zwischen einem antichronologischen und einem funktionalen Lebenslauf?",
    answer:
      "Antichronologisch (Standard): Neueste Stelle zuerst – zeigt aktuellen Stand der Karriere. Funktional: Kompetenzen im Vordergrund, Berufserfahrung sekundär – geeignet für Quereinsteiger. Kombiniert: beides vereint – für komplexe Profile.",
  },
  {
    question: "Wie beschreibe ich meine Aufgaben im Lebenslauf am besten?",
    answer:
      "Mit Aktivverben und konkreten Ergebnissen: «Leitete ein Team von 8 Personen», «Steigerte den Umsatz um 20 %», «Implementierte ein neues CRM-System». Vermeiden Sie passive Formulierungen wie «War zuständig für...».",
  },
];

type CvStation = { dates: string; title: string; tasks?: string[] };

type CvExample = {
  id: string;
  label: string;
  heading: string;
  intro: string;
  person: [string, string][];
  profile?: string;
  firstSection: "experience" | "education";
  experience: CvStation[];
  education: CvStation[];
  languages: [string, string][];
  skills: [string, string][];
  tips: string[];
};

const cvExamples: CvExample[] = [
  {
    id: "berufseinstieg",
    label: "Berufseinstieg nach der Lehre",
    heading: "Lebenslauf Beispiel: Berufseinstieg nach der Lehre",
    intro:
      "Für Lehrabgängerinnen, Lehrabgänger und Personen mit wenig Berufserfahrung. Ausbildung, Lehrbetrieb und Nebenjobs tragen den Lebenslauf.",
    person: [
      ["Name", "Laura Muster"],
      ["Adresse", "Bahnhofstrasse 5\n5000 Aarau"],
      ["Tel.", "079 000 00 00"],
      ["E-Mail", "laura.muster@muster.ch"],
      ["Geburtsdatum", "14. März 2006"],
      ["Nationalität", "Schweiz"],
    ],
    firstSection: "education",
    education: [
      { dates: "08.2022 – 07.2025", title: "Kauffrau EFZ, Profil E, Musterversicherung AG, Aarau", tasks: ["Abschlussnote 5.2", "Berufsmaturität kaufmännisch, BMS Aarau"] },
      { dates: "08.2019 – 07.2022", title: "Bezirksschule, Aarau" },
    ],
    experience: [
      { dates: "08.2025 – heute", title: "Sachbearbeiterin Kundendienst (befristet), Musterversicherung AG, Aarau", tasks: ["Bearbeitung von rund 40 Kundenanfragen pro Tag per Telefon und E-Mail", "Erfassung von Policenänderungen im Kernsystem"] },
      { dates: "08.2022 – 07.2025", title: "Lehre als Kauffrau, Musterversicherung AG, Aarau", tasks: ["Einsätze in Schadenabteilung, Buchhaltung und Empfang", "Eigenständige Betreuung des Lernenden-Instagram-Kanals"] },
      { dates: "2021 – 2024", title: "Aushilfe Verkauf (Samstage), Musterbäckerei, Aarau" },
    ],
    languages: [["Deutsch", "Muttersprache"], ["Englisch", "B2 (First Certificate)"], ["Französisch", "B1"]],
    skills: [["Programme", "MS Office (Excel fortgeschritten), SAP Grundkenntnisse"], ["Interessen", "Handball (Juniorentrainerin), Fotografie"]],
    tips: [
      "Ausbildung steht vor der Berufserfahrung, weil sie aktuell das stärkste Argument ist.",
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
    person: [
      ["Name", "Max Mustermann"],
      ["Adresse", "Musterstrasse 12\n8000 Zürich"],
      ["Tel.", "076 000 00 00"],
      ["E-Mail", "max.mustermann@muster.ch"],
      ["Geburtsdatum", "10. Januar 1990"],
      ["Nationalität", "Schweiz"],
    ],
    firstSection: "experience",
    experience: [
      { dates: "02.2022 – heute", title: "Senior Marketing Manager, Musterfirma AG, Zürich", tasks: ["Leitung des digitalen Marketings (Budget CHF 2 Mio.)", "Führung eines 5-köpfigen Teams", "Steigerung der organischen Reichweite um 45 %", "Einführung von Marketing-Automation (HubSpot)"] },
      { dates: "05.2019 – 01.2022", title: "Marketing Manager, Zweite Firma GmbH, Basel", tasks: ["Aufbau des Content-Marketings von Grund auf", "Planung und Umsetzung von 12 Kampagnen pro Jahr", "Reporting und KPI-Analysen für die Geschäftsleitung"] },
      { dates: "08.2017 – 04.2019", title: "Marketing Assistant, Dritte AG, Bern", tasks: ["Organisation von Events und Messen", "Betreuung der Social-Media-Kanäle"] },
    ],
    education: [
      { dates: "09.2014 – 07.2017", title: "Bachelor of Science in Betriebsökonomie, Fachhochschule Nordwestschweiz" },
      { dates: "2023", title: "CAS Digital Marketing, Hochschule Luzern" },
      { dates: "08.2010 – 07.2013", title: "Kaufmann EFZ mit Berufsmaturität, Muster AG, Bern" },
    ],
    languages: [["Deutsch", "Muttersprache"], ["Englisch", "C1, verhandlungssicher"], ["Französisch", "B2"]],
    skills: [["Programme", "HubSpot, Google Analytics 4, Adobe Creative Suite, MS Office"], ["Führerausweis", "Kategorie B"]],
    tips: [
      "Jede Station nennt Verantwortung und mindestens ein messbares Ergebnis.",
      "Weiterbildungen (CAS) zeigen, dass das Profil aktuell bleibt.",
      "Ältere Stationen sind kürzer beschrieben als die aktuelle Stelle.",
    ],
  },
  {
    id: "fuehrungsperson",
    label: "Führungsperson",
    heading: "Lebenslauf Beispiel: Führungsperson",
    intro:
      "Für Kader und Führungspersonen mit langjähriger Erfahrung. Ein kurzes Profil oben fasst Führungsspanne, Budget und Erfolge zusammen.",
    person: [
      ["Name", "Andrea Beispiel"],
      ["Adresse", "Seeweg 3\n6300 Zug"],
      ["Tel.", "078 000 00 00"],
      ["E-Mail", "andrea.beispiel@muster.ch"],
      ["Geburtsdatum", "2. Juni 1978"],
      ["Nationalität", "Schweiz"],
    ],
    profile:
      "Finanzchefin mit über 20 Jahren Erfahrung in Industrie und Handel, davon 12 Jahre in Führungsfunktionen. Schwerpunkte: Transformation des Finanzbereichs, Controlling und Finanzierung im Wachstum.",
    firstSection: "experience",
    experience: [
      { dates: "04.2018 – heute", title: "CFO und Mitglied der Geschäftsleitung, Muster Industrie AG, Zug (Umsatz CHF 320 Mio., 900 Mitarbeitende)", tasks: ["Führung von Finanzen, Controlling, IT und HR mit 35 Mitarbeitenden", "Umstellung auf Swiss GAAP FER und Verkürzung des Monatsabschlusses von 12 auf 5 Tage", "Refinanzierung über CHF 80 Mio. zu besseren Konditionen"] },
      { dates: "01.2012 – 03.2018", title: "Leiterin Controlling, Handels AG, Luzern", tasks: ["Aufbau eines konzernweiten Reportings für 14 Gesellschaften", "Führung von 8 Mitarbeitenden"] },
      { dates: "2003 – 2011", title: "Verschiedene Funktionen in Revision und Controlling, Revisions AG, Zürich" },
    ],
    education: [
      { dates: "2015 – 2016", title: "Executive MBA, Universität St. Gallen (HSG)" },
      { dates: "2006 – 2009", title: "Eidg. dipl. Expertin in Rechnungslegung und Controlling" },
      { dates: "1998 – 2002", title: "lic. oec. publ., Universität Zürich" },
    ],
    languages: [["Deutsch", "Muttersprache"], ["Englisch", "C2"], ["Französisch", "C1"]],
    skills: [["Mandate", "Stiftungsrätin Pensionskasse Muster (seit 2020)"], ["Systeme", "SAP S/4HANA, Power BI"]],
    tips: [
      "Das Profil oben beantwortet in drei Zeilen: Wer, welche Ebene, welche Erfolge.",
      "Unternehmensgrösse und Führungsspanne geben Ergebnissen den Massstab.",
      "Frühe Stationen werden zusammengefasst – der Lebenslauf bleibt bei zwei Seiten.",
    ],
  },
];

function CvBlock({ title, stations }: { title: string; stations: CvStation[] }) {
  return (
    <>
      <div className="border-b border-[#111827] pb-1 mb-3">
        <p className="font-bold text-sm">{title}</p>
      </div>
      <div className="mb-5 space-y-3">
        {stations.map((station) => (
          <div key={station.dates + station.title} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
            <div className="w-36 flex-shrink-0 text-[#374151] font-medium text-xs pt-0.5">{station.dates}</div>
            <div>
              <p className="font-bold text-xs mb-1">{station.title}</p>
              {station.tasks ? (
                <ul className="list-disc list-inside space-y-0.5 text-xs text-[#374151]">
                  {station.tasks.map((task) => <li key={task}>{task}</li>)}
                </ul>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CvExampleSection({ example }: { example: CvExample }) {
  const experience = <CvBlock title="Berufliche Erfahrung" stations={example.experience} />;
  const education = <CvBlock title="Ausbildungen / Weiterbildungen" stations={example.education} />;

  return (
    <section id={example.id} className="mb-10 scroll-mt-24 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold text-[#111827] mb-3">{example.heading}</h2>
      <p className="text-[#64748B] text-sm mb-6">{example.intro}</p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 text-sm text-[#111827] font-sans shadow-inner sm:p-8">
        <div className="border-b-2 border-[#111827] pb-1 mb-4">
          <p className="font-bold text-base">Lebenslauf</p>
        </div>

        <div className="flex justify-between items-start gap-4 mb-6">
          <table className="text-sm w-full max-w-xs">
            <tbody className="align-top">
              {example.person.map(([label, value]) => (
                <tr key={label} className="leading-relaxed">
                  <td className="pr-6 text-[#374151] whitespace-nowrap align-top">{label}</td>
                  <td className="whitespace-pre-line">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-20 h-24 bg-gray-200 border border-gray-300 flex-shrink-0 rounded-sm overflow-hidden sm:w-24 sm:h-28">
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Foto</div>
          </div>
        </div>

        {example.profile ? (
          <>
            <div className="border-b border-[#111827] pb-1 mb-3">
              <p className="font-bold text-sm">Profil</p>
            </div>
            <p className="mb-5 text-xs leading-relaxed text-[#374151]">{example.profile}</p>
          </>
        ) : null}

        {example.firstSection === "education" ? (
          <>
            {education}
            {experience}
          </>
        ) : (
          <>
            {experience}
            {education}
          </>
        )}

        <div className="border-b border-[#111827] pb-1 mb-3">
          <p className="font-bold text-sm">Kenntnisse &amp; Fähigkeiten</p>
        </div>
        <div className="space-y-2 text-xs text-[#374151]">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
            <div className="w-36 flex-shrink-0">Sprachen</div>
            <div>
              {example.languages.map(([language, level]) => (
                <div key={language} className="flex gap-6"><span className="w-24">{language}</span><span>{level}</span></div>
              ))}
            </div>
          </div>
          {example.skills.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
              <div className="w-36 flex-shrink-0">{label}</div>
              <div>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="mt-6 mb-2 text-base font-semibold text-[#111827]">Darauf kommt es bei diesem Beispiel an</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-[#374151]">
        {example.tips.map((tip) => <li key={tip}>{tip}</li>)}
      </ul>
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
                <><strong>Gewichtung nach Karrierestufe:</strong> Beim Berufseinstieg stehen Ausbildung und Praktika oben, bei Führungspersonen ein kurzes Profil mit Verantwortung und Ergebnissen</>,
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

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Berufserfahrung: Vorher / Nachher Vergleich</h2>
            <div className="space-y-4">
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
                <h3 className="text-base font-semibold text-[#111827] mb-2">Schwach</h3>
                <p className="text-[#64748B] font-mono text-sm italic">
                  Projektmanager, Firma AG, 2019–2022
                  <br />
                  – Projektleitung
                  <br />
                  – Kommunikation mit Kunden
                  <br />
                  – Budgetverantwortung
                </p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
                <h3 className="text-base font-semibold text-[#111827] mb-2">Stark</h3>
                <p className="text-[#374151] font-mono text-sm italic">
                  Projektleiter (100 %), Firma AG, Zürich | Jan. 2019 – Dez. 2022
                  <br />
                  – Leitete 6 parallele IT-Projekte mit Gesamtbudget von CHF 1,8 Mio.
                  <br />
                  – Koordinierte 4 externe Lieferanten und 12 interne Stakeholder
                  <br />
                  – Reduzierte Projektdurchlaufzeiten durch agile Methoden um 30 %
                </p>
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
