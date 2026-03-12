import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Motivationsschreiben Praktikum Schweiz 2025 | Vorlage & Tipps",
  description:
    "Motivationsschreiben für ein Praktikum in der Schweiz schreiben: Aufbau, Formulierungen und ein komplettes Muster – auch ohne viel Berufserfahrung überzeugend.",
  alternates: { canonical: "https://cvolution.ch/motivationsschreiben-praktikum" },
};

const faqData = [
  {
    question: "Wie lang sollte ein Motivationsschreiben für ein Praktikum sein?",
    answer:
      "Eine Seite ist das Maximum. Für ein Praktikum sind 3–4 gut strukturierte Absätze auf einer halben bis dreiviertel Seite ideal. Arbeitgeber schätzen Prägnanz – lange Schreiben werden selten vollständig gelesen.",
  },
  {
    question: "Was wenn ich noch gar keine Berufserfahrung habe?",
    answer:
      "Das ist beim Praktikum normal. Betonen Sie stattdessen: Studienschwerpunkte, die zur Stelle passen, Engagement in Vereinen oder Projekten, persönliche Motivation für die Branche und Ihre Lernbereitschaft. Konkrete Beispiele aus dem Studium oder Privatleben sind überzeugender als allgemeine Aussagen.",
  },
  {
    question: "Soll ich ein Motivationsschreiben für jedes Praktikum neu schreiben?",
    answer:
      "Ja. Ein individuell angepasstes Schreiben ist erheblich wirkungsvoller als eine generische Vorlage. Mindestens der Einstieg, die Bezüge zum Unternehmen und die Begründung warum genau diese Stelle sollten angepasst werden.",
  },
  {
    question: "Wie fange ich ein Motivationsschreiben für ein Praktikum an?",
    answer:
      "Nicht mit «Hiermit bewerbe ich mich...». Steigen Sie mit einem konkreten Bezug zum Unternehmen oder einer persönlichen Motivation ein. Zeigen Sie, dass Sie sich informiert haben und warum Sie genau dieses Praktikum interessiert.",
  },
  {
    question: "Muss ich im Motivationsschreiben erklären, was ich vom Praktikum erwarte?",
    answer:
      "Ja, aber kurz und ehrlich. Schreiben Sie, was Sie lernen möchten – das zeigt Selbstreflexion. Wichtiger ist aber, was Sie dem Unternehmen bringen können. Die Balance: 60–70 % was Sie bieten, 30–40 % was Sie suchen.",
  },
];

export default function MotivationsschreibenPraktikum() {
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
              Motivationsschreiben für ein Praktikum – Anleitung, Beispiel und Vorlage
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Ein Praktikum zu finden bedeutet oft: viel Konkurrenz, begrenzte Erfahrung – und die Frage, wie man sich
              trotzdem abheben kann. Das Motivationsschreiben ist dabei Ihre wichtigste Chance. Es zeigt, wer Sie sind,
              was Sie motiviert und warum gerade Sie für dieses Praktikum geeignet sind.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Aufbau eines Motivationsschreibens für ein Praktikum</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Ein gutes Motivationsschreiben folgt einer klaren Struktur. Für Praktika gilt: Kürze und Präzision sind
              Stärken.
            </p>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Briefkopf:</strong> Ihre Kontaktdaten, Datum, Adresse des Unternehmens</>,
                <><strong>Betreffzeile:</strong> «Bewerbung als Marketingpraktikantin – Praktikum ab September 2025»</>,
                <><strong>Einstieg (1 Absatz):</strong> Konkreter Bezug zum Unternehmen, persönliche Motivation</>,
                <><strong>Kernabsatz (1–2 Absätze):</strong> Ihre Kenntnisse, Projekte, Engagement – was Sie mitbringen</>,
                <><strong>Abschluss (1 Absatz):</strong> Verfügbarkeit, Lernerwartung, Gesprächswunsch</>,
                <><strong>Grussformel und Unterschrift</strong></>,
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Vollständiges Muster-Motivationsschreiben</h2>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100 font-mono text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">
{`Anna Müller
Musterstrasse 12 | 8001 Zürich
anna.mueller@email.ch | 079 123 45 67

Zürich, 10. März 2025

Musterfirma AG
z. Hd. Frau Sandra Huber
Bahnhofstrasse 50
8001 Zürich

Bewerbung als Marketingpraktikantin (50–80 %) ab Juni 2025

Sehr geehrte Frau Huber

Ich verfolge die Kampagnen der Musterfirma AG seit Längerem mit grossem Interesse –
besonders die Instagram-Reihe zum Nachhaltigkeitsthema hat mich beeindruckt, weil sie
komplexe Inhalte klar und ansprechend kommuniziert. Genau diese Verbindung von Inhalt
und Wirkung interessiert mich im Marketing.

Ich studiere im 4. Semester Betriebswirtschaft an der ZHAW mit Vertiefung Marketing. Im
Rahmen einer Seminararbeit habe ich eine Social-Media-Analyse für ein lokales KMU
durchgeführt und daraus konkrete Massnahmen abgeleitet, die das Unternehmen
anschliessend umgesetzt hat. Zusätzlich betreue ich ehrenamtlich die Social-Media-Kanäle
eines gemeinnützigen Vereins – ich kenne den Unterschied zwischen Theorie und der
Praxis des täglichen Publishings.

Im Praktikum möchte ich mein Wissen in einer professionellen Umgebung anwenden,
konkrete Projekte mitverantworten und von Ihrem Team lernen. Ich bin flexibel bezüglich
Pensum und verfügbar ab 1. Juni 2025.

Über eine Einladung zu einem Gespräch freue ich mich sehr.

Freundliche Grüsse

Anna Müller`}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Häufige Fehler beim Praktikums-Motivationsschreiben</h2>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Generischer Einstieg:</strong> «Hiermit bewerbe ich mich auf Ihre ausgeschriebene Stelle...» – jedes HR-Team liest das hundertfach</>,
                <><strong>Lebenslauf wiederholen:</strong> Das Motivationsschreiben ergänzt den Lebenslauf, wiederholt ihn nicht</>,
                <><strong>Zu viele Erwartungen formulieren:</strong> Was Sie vom Praktikum «mitnehmen wollen» sollte nicht dominieren</>,
                <><strong>Keine Recherche:</strong> Kein konkreter Bezug auf das Unternehmen zeigt mangelndes Interesse</>,
                <><strong>Übermässige Bescheidenheit:</strong> «Obwohl ich noch wenig Erfahrung habe...» – vermeiden Sie Selbstzweifel im Schreiben</>,
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

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Starke Formulierungen für Praktizierende</h2>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Gute Einstiegsformulierungen</h3>
            <ul className="space-y-2 mb-4">
              {[
                "«Im Rahmen meines Studiums beschäftige ich mich intensiv mit [Thema] – Ihre Stelle bietet mir...»",
                "«Die Art, wie Ihr Unternehmen [konkretes Thema] angeht, hat mich auf Sie aufmerksam gemacht.»",
                "«[Konkretes Projekt/Produkt] des Unternehmens hat mich beeindruckt, weil...»",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Kenntnisse ohne Berufserfahrung belegen</h3>
            <ul className="space-y-2 mb-4">
              {[
                "«In einer Seminararbeit habe ich [Methode] angewandt und [Ergebnis] erzielt.»",
                "«Im Rahmen meines Vereinsengagements habe ich [Aufgabe] eigenverantwortlich übernommen.»",
                "«Während meines Auslandsaufenthalts in [Land] habe ich [Kompetenz] entwickelt.»",
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
                { href: "/motivationsschreiben-beispiel", label: "Motivationsschreiben Beispiel – Vorlage für die Schweiz" },
                { href: "/lebenslauf-student", label: "Lebenslauf Student – Tipps für Berufseinsteiger" },
                { href: "/motivationsschreiben-ohne-erfahrung", label: "Motivationsschreiben ohne Erfahrung – So gelingt es trotzdem" },
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
              <Link href="/service-motivation"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200">
                  Jetzt Beratung buchen
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
