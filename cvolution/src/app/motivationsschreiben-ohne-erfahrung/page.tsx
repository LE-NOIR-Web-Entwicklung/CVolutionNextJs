import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Motivationsschreiben ohne Erfahrung 2025 | Tipps & Vorlage Schweiz",
  description:
    "Motivationsschreiben ohne Berufserfahrung schreiben: Wie Sie trotz fehlender Praxis überzeugen, welche Alternativen Sie einsetzen können und was Schweizer Arbeitgeber wirklich suchen.",
  alternates: { canonical: "https://cvolution.ch/motivationsschreiben-ohne-erfahrung" },
};

const faqData = [
  {
    question: "Kann ein Motivationsschreiben ohne Berufserfahrung wirklich überzeugen?",
    answer:
      "Ja. Arbeitgeber erwarten bei Berufseinsteigern keine jahrelange Praxiserfahrung. Sie suchen Motivation, Lernbereitschaft, relevante Kenntnisse aus Studium oder Engagement und einen glaubwürdigen Bezug zur Stelle. Ein ehrliches, spezifisches Schreiben überzeugt mehr als ein übertriebenes.",
  },
  {
    question: "Was kann ich statt Berufserfahrung angeben?",
    answer:
      "Studiumsprojekte, Seminar- und Bachelorarbeiten, Freiwilligenarbeit, Vereinsarbeit, Auslandssemester, Sprachaufenthalte, selbständige Projekte (z. B. eigene Website, App, Blog), Nebenjobs und informelle Tätigkeiten.",
  },
  {
    question: "Wie viele Absätze braucht ein Motivationsschreiben?",
    answer:
      "3–4 Absätze sind ideal. Mehr ist selten besser. Einstieg (Bezug zur Stelle), Hauptteil (was Sie mitbringen), Abschluss (Verfügbarkeit, Gesprächswunsch). Gesamtlänge: maximal eine A4-Seite.",
  },
  {
    question: "Darf ich im Motivationsschreiben erwähnen, dass ich Berufseinsteiger bin?",
    answer:
      "Das wissen die Arbeitgebenden bereits aus dem Lebenslauf. Wiederholen Sie es nicht und entschuldigen Sie sich nicht. Fokussieren Sie auf das, was Sie mitbringen – nicht auf das, was fehlt.",
  },
  {
    question: "Was ist der häufigste Fehler in Motivationsschreiben ohne Erfahrung?",
    answer:
      "Zu allgemeine Aussagen ohne Belege: «Ich bin teamfähig, kommunikationsstark und lernbereit» – das schreiben alle. Besser: konkrete Situation beschreiben, die diese Eigenschaft beweist.",
  },
];

export default function MotivationsschreibenOhneErfahrung() {
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
              Motivationsschreiben ohne Berufserfahrung – So überzeugen Sie trotzdem
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Keine Berufserfahrung zu haben bedeutet nicht, nichts zu bieten. Ein starkes Motivationsschreiben zeigt,
              was Sie mitbringen, warum Sie motiviert sind und was Sie in kurzer Zeit leisten können. Dieser Leitfaden
              zeigt, wie Sie auch als Berufseinsteiger ein überzeugendes Schreiben verfassen.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Was Arbeitgeber wirklich suchen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Wenn ein Unternehmen eine Einstiegsstelle ausschreibt, weiss es, dass Bewerberinnen und Bewerber
              eingeschränkte Praxiserfahrung haben. Was sie stattdessen suchen:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Echte Motivation für die Branche, das Unternehmen und die spezifische Stelle",
                "Relevante Kenntnisse aus Studium, Kursen oder eigenen Projekten",
                "Lernbereitschaft und Anpassungsfähigkeit",
                "Belastbare, konkrete Beispiele statt hohle Schlagwörter",
                "Einen klaren Bezug zu Unternehmenskultur oder Produkten",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Alternativen zur Berufserfahrung – was Sie nutzen können</h2>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Studiums- und Schulprojekte</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Beschreiben Sie konkrete Projekte, die zur ausgeschriebenen Stelle passen. Was war das Ziel, was haben
              Sie beigetragen, was war das Ergebnis?
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100 mb-4">
              <p className="text-[#374151] italic">
                «Im Rahmen meiner Bachelorarbeit analysierte ich die Digitalisierungsstrategie von 15 Schweizer KMU und
                entwickelte daraus ein praxisnahes Handlungsmodell. Die Arbeit wurde mit der Note 5,5 bewertet.»
              </p>
            </div>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Vereinsarbeit und Ehrenamt</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Freiwilliges Engagement zeigt Initiative, Teamfähigkeit und Verantwortungsbewusstsein – alles Qualitäten,
              die in jedem Beruf gefragt sind.
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100 mb-4">
              <p className="text-[#374151] italic">
                «Als Kassier im Tennisclub Wettingen verantworte ich seit drei Jahren die Budgetplanung und
                Mitgliederkommunikation für rund 200 Mitglieder.»
              </p>
            </div>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Eigene Projekte</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Eine eigene Website, ein Nebenprojekt, eine App oder ein YouTube-Kanal zeigen praktische Kompetenz – auch
              ohne formalen Arbeitgeber.
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100 mb-4">
              <p className="text-[#374151] italic">
                «In meiner Freizeit betreibe ich einen Reiseblog mit monatlich über 3&apos;000 Lesenden. Ich schreibe, bilde
                und vermarkte alle Inhalte eigenständig.»
              </p>
            </div>
          </section>

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Motivationsschreiben Vorlage – ohne Erfahrung</h2>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100 font-mono text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">
{`Max Keller
Bergstrasse 7 | 3005 Bern
max.keller@email.ch | 077 987 65 43

Bern, 12. März 2025

Techfirma AG
z. Hd. Hr. Thomas Brunner
Effingerstrasse 20
3011 Bern

Bewerbung als Junior Software Developer (80–100 %)

Sehr geehrter Herr Brunner

Die Techfirma AG hat mich durch Ihren Open-Source-Beitrag zu [Projektname] auf GitHub
auf sich aufmerksam gemacht – ich verfolge das Repository seit Monaten. Die Art, wie
Ihr Team sauberen, wartbaren Code priorisiert, entspricht genau dem Ansatz, den ich mir
für meinen Berufsstart vorstelle.

Ich schliesse im Mai 2025 meinen BSc Informatik an der Uni Bern ab. In meiner
Bachelorarbeit entwickelte ich eine webbasierte Planungsapplikation mit React und Node.js,
die heute von einem Studierendenverein mit 150 Nutzerinnen und Nutzern eingesetzt wird.
Neben dem Studium habe ich als Freelancer drei kleinere Websites umgesetzt und dabei
gelernt, mit Kundenwünschen, engen Deadlines und unvorhergesehenen Problemen
umzugehen.

Ich möchte in einem professionellen Umfeld wachsen, Code-Reviews erleben und von
erfahrenen Entwicklerinnen und Entwicklern lernen. Ich bin belastbar, lernbereit und ab
1. Juli 2025 vollständig verfügbar.

Ich freue mich auf ein persönliches Gespräch.

Freundliche Grüsse

Max Keller`}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Soft Skills konkret formulieren</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Vermeiden Sie leere Schlagwörter. Belegen Sie Soft Skills mit kurzen Beispielen:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm mb-6">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left text-[#374151]">Schlagwort (schwach)</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-[#374151]">Mit Beleg (stark)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«Ich bin teamfähig»</td>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«Im Gruppenproject koordinierte ich ein 5-köpfiges Team über drei Monate.»</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«Ich arbeite selbständig»</td>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«Ich habe meine Seminararbeit ohne externe Begleitung in vier Wochen abgeschlossen.»</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«Ich lerne schnell»</td>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«In einem zweitägigen Workshop eignte ich mir Python-Grundkenntnisse an und setzte daraufhin ein Mini-Projekt um.»</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Internal links - card grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/motivationsschreiben-beispiel", label: "Motivationsschreiben Beispiel – Vorlage und Muster" },
                { href: "/lebenslauf-student", label: "Lebenslauf Student – Tipps für Berufseinsteiger" },
                { href: "/motivationsschreiben-tipps", label: "Motivationsschreiben Tipps – Die häufigsten Fehler vermeiden" },
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
