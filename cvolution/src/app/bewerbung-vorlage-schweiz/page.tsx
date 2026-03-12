import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bewerbung Vorlage Schweiz 2025 | Kostenlose Muster & Tipps",
  description:
    "Kostenlose Bewerbungsvorlagen für die Schweiz: vollständige Bewerbungsdossiers mit Lebenslauf, Motivationsschreiben und Deckblatt – mit konkreten Beispielen und Anleitungen.",
  alternates: { canonical: "https://cvolution.ch/bewerbung-vorlage-schweiz" },
};

const faqData = [
  {
    question: "Was gehört zu einem vollständigen Bewerbungsdossier in der Schweiz?",
    answer:
      "Ein vollständiges Bewerbungsdossier enthält: Motivationsschreiben (1 Seite), Lebenslauf (1–2 Seiten mit Foto), Arbeits- und Praktikumszeugnisse sowie Diplome und Zertifikate. Ein Deckblatt ist optional, aber bei umfangreicheren Dossiers sinnvoll.",
  },
  {
    question: "Ist eine Bewerbungsvorlage aus dem Internet problematisch?",
    answer:
      "Nur wenn Sie sie unverändert verwenden. Vorlagen sind ein Startpunkt – der Inhalt muss individuell auf jede Stelle angepasst werden. Identische Vorlagen werden von HR-Fachleuten schnell erkannt und hinterlassen einen schlechten Eindruck.",
  },
  {
    question: "Soll ich mich online oder per Post bewerben?",
    answer:
      "Die meisten Schweizer Unternehmen bevorzugen Online-Bewerbungen per E-Mail oder über ein Bewerbungsportal. Postalische Bewerbungen sind noch in einigen traditionellen Branchen üblich. Folgen Sie immer den Angaben in der Stellenausschreibung.",
  },
  {
    question: "Wie gross sollte das PDF einer Bewerbung sein?",
    answer:
      "Maximal 5–8 MB. Grössere Dateien können E-Mail-Filter blockieren. Komprimieren Sie Scans von Zeugnissen auf 150–200 dpi. Alle Dokumente in einem PDF zusammenfassen – nicht als mehrere separate Dateien.",
  },
  {
    question: "Muss das Motivationsschreiben unterschrieben werden?",
    answer:
      "Bei einer digitalen Bewerbung reicht eine eingescannte oder digitale Unterschrift. Bei einer Papierbewerbung unterschreiben Sie handschriftlich. Eine Unterschrift signalisiert Sorgfalt und Verbindlichkeit.",
  },
];

export default function BewerbungVorlageSchweiz() {
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
              Bewerbung Vorlage Schweiz – Vollständige Muster und Anleitungen
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Eine professionelle Bewerbung in der Schweiz besteht aus mehreren Dokumenten, die als zusammenhängendes
              Dossier eingereicht werden. Diese Seite bietet Ihnen eine vollständige Übersicht über den Aufbau, konkrete
              Vorlagen und praktische Tipps für jede Komponente Ihrer Bewerbung.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Das vollständige Bewerbungsdossier</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              In der Schweiz wird ein vollständiges Bewerbungsdossier erwartet. Anders als in manchen anderen Ländern
              ist es hier üblich, alle Unterlagen von Anfang an mitzuschicken.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Pflichtbestandteile</h3>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Motivationsschreiben:</strong> Persönlich, individuell, max. 1 Seite</>,
                <><strong>Lebenslauf:</strong> Antichronologisch, mit Foto, 1–2 Seiten</>,
                <><strong>Arbeitszeugnisse:</strong> Alle relevanten Stellen, als Kopie/Scan</>,
                <><strong>Diplome und Zertifikate:</strong> Hochschulabschluss, Berufsabschluss, relevante Weiterbildungen</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Optionale Bestandteile</h3>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Deckblatt:</strong> Bei umfangreichem Dossier (5+ Seiten) als Übersicht</>,
                <><strong>Portfolio:</strong> Bei kreativen Berufen oder Projektarbeiten</>,
                <><strong>Referenzliste:</strong> Namen und Kontakt von 2–3 Referenzpersonen</>,
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Motivationsschreiben – Vorlage und Struktur</h2>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100 font-mono text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">
{`[Vorname Nachname]
[Strasse Nr.] | [PLZ Ort]
[E-Mail] | [Telefon]

[Ort, Datum]

[Firmenname]
z. Hd. [Ansprechperson]
[Strasse Nr.]
[PLZ Ort]

Bewerbung als [Funktionsbezeichnung] – Ref. [Nr. falls vorhanden]

Sehr geehrte Frau / geehrter Herr [Nachname]

[Einstieg: konkreter Bezug zum Unternehmen oder zur Stelle – 2–3 Sätze]

[Hauptteil 1: Ihre relevante Erfahrung und Kompetenzen – 3–4 Sätze]

[Hauptteil 2: Warum dieses Unternehmen, was können Sie beitragen – 2–3 Sätze]

[Abschluss: Verfügbarkeit, Gesprächswunsch – 1–2 Sätze]

Freundliche Grüsse

[Handschriftliche Unterschrift]

[Vorname Nachname]

Beilagen: Lebenslauf, Arbeitszeugnisse, Diplome`}
            </div>
          </section>

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Lebenslauf – Vorlage und Struktur</h2>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100 mb-4">
              <h3 className="font-semibold text-[#111827] mb-3">Empfohlene Abschnitte</h3>
              <ul className="space-y-2">
                {[
                  "Persönliche Angaben (Name, Adresse, Kontakt, Nationalität, Geburtsdatum)",
                  "Berufserfahrung (umgekehrt chronologisch, mit Funktionsbeschreibung)",
                  "Ausbildung (umgekehrt chronologisch)",
                  "Weiterbildungen und Zertifikate",
                  "Kenntnisse (Sprachen, IT, weitere Fähigkeiten)",
                  "Interessen (optional, nur wenn relevant)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#374151]">
                    <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Für jeden Abschnitt der Berufserfahrung empfehlen wir folgende Struktur:
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
              <p className="text-[#374151] font-mono text-sm">
                <strong>Funktionsbezeichnung</strong>, Unternehmensname AG, Ort | Monat Jahr – Monat Jahr
                <br />
                – [Aufgabe/Ergebnis 1]
                <br />
                – [Aufgabe/Ergebnis 2]
                <br />
                – [Aufgabe/Ergebnis 3]
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Online-Bewerbung vs. postalische Bewerbung</h2>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Online-Bewerbung (Standard)</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Alle Dokumente in einem PDF zusammenfassen",
                "Dateiname: «Bewerbung_Vorname-Nachname_Funktionsbezeichnung.pdf»",
                "Kurze E-Mail als Begleittext – kein zweites Motivationsschreiben",
                "Betreffzeile: «Bewerbung als [Funktion] – [Referenznummer falls vorhanden]»",
                "Dateigrösse: max. 5–8 MB",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Postalische Bewerbung</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Alle Dokumente in einem Bewerbungsmappe oder Klarsichthülle",
                "Reihenfolge: Motivationsschreiben oben, dann Lebenslauf, dann Beilagen",
                "Originale bei sich behalten – nur beglaubigte Kopien oder Scans einsenden",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Internal links - card grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/bewerbung-schreiben", label: "Bewerbung schreiben – Schritt-für-Schritt-Anleitung" },
                { href: "/lebenslauf-vorlage-schweiz", label: "Lebenslauf Vorlage Schweiz – Kostenlose Muster" },
                { href: "/bewerbungsunterlagen-check", label: "Bewerbungsunterlagen Check – Vor dem Absenden prüfen" },
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
