import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lebenslauf Beispiel Schweiz 2025 | Vollständige Muster für alle Berufe",
  description:
    "Lebenslauf Beispiele für die Schweiz: Muster für Fachkräfte, Führungspersonen, Berufseinsteiger und Quereinsteiger – mit Erklärungen und Tipps für jeden Abschnitt.",
  alternates: { canonical: "https://cvolution.ch/lebenslauf-beispiel" },
};

const faqData = [
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

export default function LebenslaufBeispiel() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
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

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Lebenslauf Beispiel: Erfahrene Fachkraft</h2>
            <p className="text-[#64748B] text-sm mb-4">
              Dieses Beispiel zeigt einen typischen Lebenslauf für eine Fachkraft mit 8–10 Jahren Berufserfahrung.
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100 font-mono text-sm text-[#374151] leading-relaxed">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xl font-bold text-[#111827]">Sandra Meier</p>
                  <p>Rosenweg 14 | 8004 Zürich</p>
                  <p>sandra.meier@email.ch | 079 456 78 90</p>
                  <p>linkedin.com/in/sandrameier</p>
                </div>
                <div className="w-20 h-24 bg-gray-200 flex items-center justify-center text-[#64748B] text-xs rounded">
                  Foto
                </div>
              </div>

              <div className="mb-5">
                <p className="font-bold text-[#111827] border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide text-xs">Berufserfahrung</p>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <p className="font-semibold">Senior Marketing Manager</p>
                    <p className="text-[#64748B]">März 2020 – heute</p>
                  </div>
                  <p className="text-[#64748B]">Musterfirma AG, Zürich</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Verantwortung für digitale Marketingstrategie (Budget: CHF 2 Mio.)</li>
                    <li>Teamleitung von 5 Personen im Bereich Content und Performance</li>
                    <li>Steigerung der organischen Reichweite um 45 % in 2 Jahren</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <p className="font-semibold">Marketing Manager</p>
                    <p className="text-[#64748B]">Jan. 2017 – Feb. 2020</p>
                  </div>
                  <p className="text-[#64748B]">Zweite Firma GmbH, Basel</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Aufbau des Content-Marketing-Bereichs von Grund auf</li>
                    <li>Einführung eines Marketing-Automation-Tools (HubSpot)</li>
                  </ul>
                </div>
              </div>

              <div className="mb-5">
                <p className="font-bold text-[#111827] border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide text-xs">Ausbildung</p>
                <div className="mb-3">
                  <div className="flex justify-between">
                    <p className="font-semibold">MSc Marketing, Universität St. Gallen (HSG)</p>
                    <p className="text-[#64748B]">2014 – 2016</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <p className="font-semibold">BSc Betriebswirtschaft, ZHAW</p>
                    <p className="text-[#64748B]">2011 – 2014</p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="font-bold text-[#111827] border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide text-xs">Kenntnisse</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-semibold text-xs">Sprachen</p>
                    <p>Deutsch – Muttersprache</p>
                    <p>Englisch – C1</p>
                    <p>Französisch – B2</p>
                  </div>
                  <div>
                    <p className="font-semibold text-xs">IT & Tools</p>
                    <p>Google Analytics, HubSpot</p>
                    <p>Adobe Creative Suite</p>
                    <p>Salesforce, MS Office</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Was macht dieses Beispiel stark?</h2>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Konkrete Zahlen:</strong> Budgetverantwortung, Teamgrösse, Prozentangaben – das schafft Glaubwürdigkeit</>,
                <><strong>Aktivverben:</strong> «Leitete», «baute auf», «steigerte» – keine passive Sprache</>,
                <><strong>Relevante Stationen:</strong> Nur Stellen, die für die Zielposition relevant sind</>,
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

          {/* CTA */}
          <section className="bg-[#204878] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-semibold mb-3">Professionelle Unterstützung bei Ihrer Bewerbung</h2>
            <p className="text-blue-100/80 mb-6 max-w-xl mx-auto">
              Unsere Experten mit über 10 Jahren Recruiting-Erfahrung begleiten Sie auf dem Weg zu Ihrer neuen Stelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/service-cv"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200">
                Lebenslauf erstellen lassen
              </Link>
              <Link href="/service"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors duration-200">
                Komplette Bewerbung
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
