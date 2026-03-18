import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lebenslauf Format Schweiz 2026 | Layout, Länge und Gestaltung",
  description:
    "Das richtige Lebenslauf-Format für die Schweiz: Welche Länge, welches Layout und welche Gestaltung Schweizer Arbeitgeber erwarten – mit konkreten Empfehlungen.",
  alternates: { canonical: "https://cvolution.ch/lebenslauf-format-schweiz" },
};

const faqData = [
  {
    question: "Wie lang sollte ein Lebenslauf in der Schweiz sein?",
    answer:
      "1–2 Seiten sind Standard. Eine Seite für Berufseinsteiger, zwei Seiten für erfahrene Fachkräfte. Führungskräfte mit langer Karriere können auf drei Seiten gehen, wenn der Inhalt wirklich relevant ist. Niemals künstlich strecken.",
  },
  {
    question: "Welches Dateiformat ist für einen Lebenslauf in der Schweiz am besten?",
    answer:
      "PDF ist der Standard. Es stellt sicher, dass das Layout auf jedem Gerät und Betriebssystem gleich aussieht. Vermeiden Sie Word-Dokumente, ausser der Arbeitgeber verlangt es explizit.",
  },
  {
    question: "Welche Schriftgrösse und Schriftart ist für einen Lebenslauf empfehlenswert?",
    answer:
      "Schriftgrösse 10–12 pt für Fliesstext, 14–16 pt für den Namen, 12–13 pt für Überschriften. Klare, professionelle Schriften: Arial, Calibri, Garamond oder Georgia. Keine dekorativen oder schwer lesbaren Schriften.",
  },
  {
    question: "Muss der Lebenslauf chronologisch aufgebaut sein?",
    answer:
      "In der Schweiz ist das antichronologische Format (neueste Stelle zuerst) Standard und wird von den meisten Arbeitgebern bevorzugt. Für Quereinsteiger kann ein kombiniertes Format sinnvoller sein.",
  },
  {
    question: "Kann ich farbige Elemente in den Lebenslauf einfügen?",
    answer:
      "Dezente Farben zur Strukturierung (z. B. ein dunkles Blau oder Grau für Überschriften oder Balken) sind akzeptabel und können das Layout professioneller wirken lassen. Grelle Farben oder bunte Designs wirken unprofessionell – ausser in kreativen Berufen.",
  },
];

export default function LebenslaufFormatSchweiz() {
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
              Lebenslauf Format Schweiz – Layout, Länge und Gestaltung richtig wählen
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Das Format Ihres Lebenslaufs hat direkten Einfluss darauf, ob er gelesen wird. In der Schweiz gibt es klare
              Erwartungen: Ein professionelles, übersichtliches Layout mit korrekten Angaben schafft Vertrauen, bevor
              auch nur ein Satz des Inhalts gelesen wurde.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Länge des Lebenslaufs</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Die Länge hängt von Ihrer Erfahrung ab:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>1 Seite:</strong> Berufseinsteiger, Studierende, weniger als 3 Jahre Berufserfahrung</>,
                <><strong>2 Seiten:</strong> Fachkräfte mit 3–15 Jahren Erfahrung – Schweizer Standard</>,
                <><strong>3 Seiten:</strong> Nur für Führungskräfte oder Spezialisten mit sehr breiter, relevanter Karriere</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[#374151] leading-relaxed mb-4">
              Wichtig: Strecken Sie Ihren Lebenslauf nie künstlich. Eine gut gefüllte Seite ist überzeugender als zwei
              halbvolle.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Seitenränder und Weissraum</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Ausreichend Weissraum macht Ihren Lebenslauf lesbar und wirkt aufgeräumt:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Seitenränder: 1,5–2,5 cm oben/unten, 1,5–2 cm links/rechts",
                "Zeilenabstand: 1,15–1,5 – genug Luft für gute Lesbarkeit",
                "Abstand zwischen Sektionen: mindestens 8–10 pt Leerraum",
                "Nie Text an den Rand pressen, um Platz zu sparen",
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

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Typographie und Schriftarten</h2>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Empfohlene Schriften</h3>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Serifenlos (modern):</strong> Calibri, Arial, Helvetica, Lato, Open Sans</>,
                <><strong>Mit Serife (klassisch):</strong> Georgia, Garamond, Times New Roman</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Schriftgrössen</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Name: 16–18 pt, fett",
                "Kontaktdaten: 10–11 pt",
                "Sektionsüberschriften: 12–13 pt, fett",
                "Fliesstext: 10–11 pt",
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

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Einspaltig vs. zweispaltig</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Beide Formate sind in der Schweiz verbreitet:
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Einspaltig</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Klassisch und bewährt. Einfacher zu scannen, ATS-freundlich (Applicant Tracking System). Empfohlen für
              konservative Branchen: Finanzwesen, Recht, Verwaltung, Industrie.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Zweispaltig</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Moderner Look. Kontaktdaten, Skills und Sprachen in der linken Spalte, Erfahrung und Ausbildung rechts.
              Gut für kreative Berufe, Marketing, Design, IT. Achtung: ATS-Systeme können zweispaltige PDFs manchmal
              falsch auslesen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Foto im Lebenslauf</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              In der Schweiz ist ein professionelles Foto Standard und wird von Arbeitgebern erwartet. Anforderungen:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Professionelles Porträt, kein Urlaubsfoto oder Selfie",
                "Neutraler, heller Hintergrund",
                "Formelle Kleidung, die zur angestrebten Stelle passt",
                "Aktuell – nicht älter als 2–3 Jahre",
                "Platzierung: oben rechts oder oben links",
                "Grösse: ca. 3 × 4 cm",
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

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">ATS-Kompatibilität sicherstellen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Viele Unternehmen setzen Bewerber-Managementsysteme (ATS) ein, die Lebensläufe automatisch auslesen.
              Damit Ihr Lebenslauf korrekt erfasst wird:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Standard-Überschriften verwenden: «Berufserfahrung», «Ausbildung», «Kenntnisse»",
                "Keine Tabellen für wichtige Inhalte",
                "Keine Grafiken, Icons oder Sterne für Skills – ATS kann diese nicht lesen",
                "Standardschriften wählen",
                "Als PDF exportieren – nicht als gescanntes Bild",
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
