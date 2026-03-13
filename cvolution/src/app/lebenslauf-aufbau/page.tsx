import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lebenslauf Aufbau Schweiz 2025 | Struktur & Gliederung erklärt",
  description:
    "So bauen Sie Ihren Schweizer Lebenslauf richtig auf: Schritt-für-Schritt-Anleitung mit allen Pflichtabschnitten, Tipps zur Gliederung und Beispielen.",
  alternates: { canonical: "https://cvolution.ch/lebenslauf-aufbau" },
};

const faqData = [
  {
    question: "In welcher Reihenfolge soll ich meine Berufserfahrung angeben?",
    answer:
      "Im Schweizer Lebenslauf gilt das antichronologische Prinzip: Die aktuellste oder zuletzt ausgeübte Stelle steht an erster Stelle. So sehen Personalverantwortliche sofort Ihre neueste Erfahrung.",
  },
  {
    question: "Muss ich alle Arbeitgeber angeben, auch Kurzanstellungen?",
    answer:
      "Grundsätzlich sollten Sie alle Beschäftigungsverhältnisse angeben, da Arbeitszeugnisse und Referenzen bei Backgroundchecks verglichen werden. Sehr kurze Anstellungen unter zwei Monaten können Sie unter Umständen in einer Sammeleinteilung zusammenfassen.",
  },
  {
    question: "Wie detailliert soll ich meine Aufgaben beschreiben?",
    answer:
      "Drei bis fünf Aufgaben pro Stelle reichen. Fokussieren Sie sich auf Leistungen, Verantwortlichkeiten und messbare Resultate. Jede Aufgabenbeschreibung sollte mit einem starken Verb beginnen: leitete, entwickelte, optimierte, verantwortete.",
  },
  {
    question: "Welche Angaben gehören unter Ausbildung?",
    answer:
      "Nennen Sie die Ausbildungsinstitution, den Abschluss (z. B. Bachelor of Science in Betriebswirtschaft), den Ort und die Jahreszahl des Abschlusses. Schwerpunkte oder besondere Leistungen können Sie kurz erwähnen.",
  },
  {
    question: "Soll ich auch ehrenamtliche Tätigkeiten angeben?",
    answer:
      "Ja, Freiwilligenarbeit und Vereinsengagement werden in der Schweiz sehr positiv bewertet. Sie zeigen soziale Verantwortung und persönliche Interessen. Fügen Sie diese Tätigkeiten im Abschnitt 'Weitere Aktivitäten' oder 'Hobbys & Interessen' ein.",
  },
  {
    question: "Wie gehe ich mit älteren Ausbildungen oder Abschlüssen um?",
    answer:
      "Ausbildungen, die mehr als 15–20 Jahre zurückliegen, können Sie kürzer halten. Die Matura oder Berufslehre bleibt immer Teil des Lebenslaufs. Ältere Weiterbildungen, die nicht mehr relevant sind, können Sie weglassen.",
  },
];

export default function LebenslaufAufbauPage() {
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
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
      <main className="bg-[#F8FAFC] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">

          <div className="mb-10">
            <p className="text-sm font-medium text-[#204878] uppercase tracking-wide mb-2">Bewerbungsratgeber</p>
            <h1 className="text-4xl font-bold text-[#111827] leading-tight mb-4">
              Lebenslauf Aufbau: Die richtige Gliederung für den Schweizer Arbeitsmarkt
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Der Aufbau Ihres Lebenslaufs entscheidet darüber, ob Sie zum Vorstellungsgespräch eingeladen werden.
              Erfahren Sie, welche Abschnitte zwingend sind, wie Sie diese korrekt gliedern und wie Sie sich von
              Mitbewerbern abheben.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Die Grundstruktur eines Schweizer Lebenslaufs</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Im Schweizer Arbeitsmarkt hat sich eine klar definierte Struktur etabliert. Abweichungen von dieser
              Norm fallen auf – manchmal positiv, oft negativ. Halten Sie sich an die bewährte Gliederung und
              optimieren Sie Ihren Lebenslauf innerhalb dieses Rahmens.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              HR-Fachkräfte verbringen im Schnitt weniger als eine Minute mit dem ersten Screening eines Lebenslaufs.
              Eine klare, logisch aufgebaute Struktur ist daher kein Nice-to-have, sondern eine Grundvoraussetzung
              für eine erfolgreiche Bewerbung.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Abschnitt für Abschnitt: So bauen Sie Ihren Lebenslauf auf</h2>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">1. Persönliche Angaben & Foto</h3>
            <p className="text-[#374151] leading-relaxed mb-3">
              Der Kopf Ihres Lebenslaufs enthält Ihre vollständigen Kontaktdaten. Fügen Sie ein professionelles Foto
              ein – in der Schweiz ist dies nach wie vor Standard und wird von den meisten Arbeitgebern erwartet.
            </p>
            <ul className="space-y-1 mb-6 text-[#374151]">
              {["Vollständiger Name", "Adresse mit PLZ und Ort", "Telefonnummer (Mobiltelefon)", "E-Mail-Adresse (professionell)", "Geburtsdatum", "Nationalität / Arbeitserlaubnis"].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#204878] font-bold mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">2. Profil oder Zusammenfassung (optional)</h3>
            <p className="text-[#374151] leading-relaxed mb-6">
              Ein zwei- bis dreizeiliges Profil am Anfang des Lebenslaufs gewinnt in der Schweiz zunehmend an
              Bedeutung. Fassen Sie Ihre wichtigsten Kompetenzen und Ihr Karriereziel prägnant zusammen. Dieser
              Abschnitt ist besonders für Führungskräfte und Quereinsteiger wertvoll.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">3. Berufserfahrung</h3>
            <p className="text-[#374151] leading-relaxed mb-3">
              Dies ist das Herzstück Ihres Lebenslaufs. Listen Sie alle relevanten Anstellungen antichronologisch auf.
              Pro Stelle gehören folgende Informationen hinein:
            </p>
            <ul className="space-y-1 mb-6 text-[#374151]">
              {[
                "Berufsbezeichnung / Position",
                "Arbeitgeber und Ort",
                "Beschäftigungsdauer (Monat und Jahr)",
                "3–5 Hauptaufgaben und Verantwortlichkeiten"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#204878] font-bold mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">4. Ausbildung und Weiterbildungen</h3>
            <p className="text-[#374151] leading-relaxed mb-6">
              Führen Sie Ihre Ausbildungen ebenfalls antichronologisch auf. Für Berufseinsteiger steht dieser
              Abschnitt oft vor der Berufserfahrung. Nennen Sie auch relevante Kurse, Zertifikate und
              Weiterbildungen – diese zeigen Lernbereitschaft und aktuelle Fachkenntnisse.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">5. Sprach- und IT-Kenntnisse</h3>
            <p className="text-[#374151] leading-relaxed mb-6">
              Sprachkenntnisse sind in der mehrsprachigen Schweiz besonders relevant. Geben Sie für jede Sprache
              das Kompetenzniveau an. Bei IT-Kenntnissen reicht eine übersichtliche Liste der wichtigsten Programme
              und Tools mit kurzer Niveauangabe (Grundkenntnisse, fortgeschritten, Experte).
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">6. Interessen und weitere Aktivitäten</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Dieser Abschnitt ist optional, aber in der Schweiz wird er von Personalverantwortlichen oft gelesen.
              Er vermittelt ein Bild Ihrer Persönlichkeit. Wählen Sie Hobbys, die etwas über Ihre Charaktereigenschaften
              aussagen – Teamarbeit, Ausdauer, Kreativität oder Führungsqualitäten.
            </p>
          </section>

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Beispiel: Vollständiger Lebenslauf-Kopf</h2>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[#111827] text-lg">Maria Müller</p>
                  <p className="text-[#64748B] text-sm">Musterstrasse 12, 8001 Zürich</p>
                  <p className="text-[#64748B] text-sm">+41 79 123 45 67</p>
                  <p className="text-[#64748B] text-sm">maria.mueller@email.ch</p>
                  <p className="text-[#64748B] text-sm">Schweizer Staatsangehörige</p>
                  <p className="text-[#64748B] text-sm">linkedin.com/in/mariamueller</p>
                </div>
                <div className="w-20 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">Foto</div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Häufige Strukturfehler und wie Sie sie vermeiden</h2>
            <div className="space-y-4">
              {[
                {
                  fehler: "Chronologische statt antichronologische Auflistung",
                  loesung: "Stellen Sie immer die aktuellste Erfahrung an den Anfang.",
                },
                {
                  fehler: "Fehlende Monat-Angaben bei Beschäftigungsdauern",
                  loesung: "Schreiben Sie immer Monat und Jahr, z. B. «März 2021 – August 2023».",
                },
                {
                  fehler: "Aufgaben statt Leistungen beschreiben",
                  loesung: "Beschreiben Sie nicht nur, was Sie taten, sondern was Sie erreichten.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <p className="font-semibold text-red-600 mb-1">Fehler: {item.fehler}</p>
                  <p className="text-[#374151] text-sm">Besser: {item.loesung}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/lebenslauf-vorlage-schweiz", label: "Lebenslauf Vorlage Schweiz" },
                { href: "/lebenslauf-fehler", label: "Lebenslauf-Fehler vermeiden" },
                { href: "/lebenslauf-beispiel", label: "Lebenslauf Beispiel" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[#204878] font-medium">
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Häufige Fragen zum Lebenslauf-Aufbau</h2>
            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-semibold text-[#111827] mb-2">{faq.question}</h3>
                  <p className="text-[#374151] leading-relaxed text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#204878] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-semibold mb-3">Professionelle Unterstützung bei Ihrer Bewerbung</h2>
            <p className="text-blue-100/80 mb-6 max-w-xl mx-auto">
              Wir analysieren Ihren bestehenden Lebenslauf und erstellen für Sie eine optimierte Version –
              strukturiert, überzeugend und auf Ihre Zielposition zugeschnitten.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/service-cv" className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200">
                Lebenslauf erstellen lassen
              </Link>
              <Link href="/service" className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors duration-200">
                Komplette Bewerbung
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
