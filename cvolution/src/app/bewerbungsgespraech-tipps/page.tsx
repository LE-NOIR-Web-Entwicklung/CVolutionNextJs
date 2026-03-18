import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bewerbungsgespräch Tipps Schweiz 2026 | Vorbereitung & häufige Fragen",
  description:
    "So bereiten Sie sich optimal auf das Bewerbungsgespräch in der Schweiz vor. Häufige Interviewfragen mit Antwortbeispielen, Do's und Don'ts und konkrete Gesprächstipps.",
  alternates: { canonical: "https://cvolution.ch/bewerbungsgespraech-tipps" },
};

const faqData = [
  {
    question: "Wie bereite ich mich auf typische Interviewfragen vor?",
    answer:
      "Üben Sie die STAR-Methode: Situation, Task (Aufgabe), Action (Handlung), Result (Ergebnis). Bereiten Sie für jede potenzielle Frage ein konkretes Beispiel aus Ihrer Karriere vor. Üben Sie laut, nicht nur in Gedanken.",
  },
  {
    question: "Was ziehe ich zu einem Vorstellungsgespräch in der Schweiz an?",
    answer:
      "In der Schweiz gilt: lieber eine Stufe formeller als die tatsächliche Unternehmenskultur. In traditionellen Branchen (Banken, Versicherungen, Recht) ist Business-Kleidung Pflicht. In Start-ups oder kreativen Unternehmen reicht Business-Casual. Im Zweifel: zu gepflegt ist besser als zu lässig.",
  },
  {
    question: "Wie verhalte ich mich am Anfang des Gesprächs?",
    answer:
      "Kommen Sie fünf bis zehn Minuten vor dem vereinbarten Termin an. Begrüssen Sie alle Anwesenden mit Handschlag und direktem Blickkontakt. Warten Sie, bis man Ihnen einen Platz anbietet. Schweizer Gesprächspartner schätzen Pünktlichkeit und ruhiges, selbstsicheres Auftreten.",
  },
  {
    question: "Welche Fragen darf mir der Arbeitgeber im Interview NICHT stellen?",
    answer:
      "In der Schweiz sind diskriminierende Fragen zwar nicht explizit verboten, können aber als Verletzung der Persönlichkeitsrechte gewertet werden. Fragen zu Schwangerschaft, Familienplanung, Religion oder politischen Ansichten müssen Sie nicht beantworten.",
  },
  {
    question: "Was tun, wenn ich eine Frage nicht beantworten kann?",
    answer:
      "Geben Sie es offen zu: 'Das habe ich so noch nicht erlebt, aber ich würde folgendermassen vorgehen...' Schweizer Arbeitgeber schätzen Ehrlichkeit und Selbstreflexion. Wer eine Wissenslücke zugibt und gleichzeitig Lösungskompetenz zeigt, macht oft einen besseren Eindruck als jemand, der drauflosredet.",
  },
  {
    question: "Soll ich nach dem Interview eine Dankes-E-Mail schicken?",
    answer:
      "Eine kurze, professionelle Nachricht innerhalb von 24 Stunden ist eine gute Geste. Bedanken Sie sich für die Zeit, wiederholen Sie kurz Ihr Interesse an der Stelle und erwähnen Sie einen Punkt aus dem Gespräch, der Sie besonders angesprochen hat. Übertreiben Sie nicht – die E-Mail sollte drei bis fünf Sätze umfassen.",
  },
];

export default function BewerbungsgespraechTippsPage() {
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
              Bewerbungsgespräch Tipps: Optimal vorbereitet für das Interview in der Schweiz
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Die Einladung zum Vorstellungsgespräch ist der erste grosse Erfolg. Jetzt gilt es, diesen Vorteil
              zu nutzen. Erfahren Sie, wie Sie sich optimal vorbereiten, typische Fragen meistern und einen
              bleibenden Eindruck hinterlassen.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Vorbereitung ist alles</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Wer sich gut vorbereitet, geht selbstbewusster ins Gespräch – und das merkt das Gegenüber. Schweizer
              Personalverantwortliche schätzen fundierte Vorbereitung sehr. Wer das Unternehmen gut kennt, die
              Stelle verstanden hat und mit konkreten Beispielen aufwarten kann, hinterlässt einen starken Eindruck.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Die 5-Punkte-Checkliste vor dem Gespräch</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Unternehmen recherchiert: Geschäftsmodell, Produkte/Dienstleistungen, Werte, aktuelle News",
                "Stelle nochmals gelesen und die Kernanforderungen verinnerlicht",
                "Eigene Stärken und konkrete Beispiele vorbereitet (STAR-Methode)",
                "Eigene Fragen an den Arbeitgeber formuliert",
                "Wegbeschreibung gecheckt, pünktliches Erscheinen sichergestellt",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Häufige Interviewfragen mit Antwortbeispielen</h2>
            <div className="space-y-5">
              {[
                {
                  frage: "«Erzählen Sie mir etwas über sich.»",
                  tipp: "Geben Sie eine strukturierte 2-Minuten-Zusammenfassung: Wer sind Sie beruflich, was haben Sie bisher gemacht, und was suchen Sie jetzt? Beginnen Sie mit Ihrer aktuellen Situation, gehen Sie kurz auf die Vergangenheit ein und schliessen Sie mit dem Bezug zur Stelle ab.",
                  beispiel: "«Ich bin seit fünf Jahren im digitalen Marketing tätig, zuletzt als Teamleiterin bei der XY AG in Zürich. Mein Schwerpunkt liegt auf datengetriebenen Kampagnen und der Teamführung. Ich suche nun eine Aufgabe, in der ich diese Erfahrungen in einem internationalen Umfeld einsetzen und ausbauen kann – genau das bietet diese Stelle.»",
                },
                {
                  frage: "«Was sind Ihre grössten Stärken?»",
                  tipp: "Nennen Sie drei konkrete Stärken und belegen Sie jede mit einem Beispiel. Wählen Sie Stärken, die für die ausgeschriebene Stelle relevant sind.",
                  beispiel: "«Meine grösste Stärke ist analytisches Denken. Ich habe bei der letzten Kampagne durch konsequente Datenanalyse festgestellt, dass wir 30 % des Budgets in ein Segment investierten, das kaum konvertiert hat. Durch Umschichtung haben wir den ROI um 45 % gesteigert.»",
                },
                {
                  frage: "«Warum möchten Sie unser Unternehmen verlassen / wechseln?»",
                  tipp: "Bleiben Sie positiv und zukunftsorientiert. Nennen Sie niemals negative Gründe wie Probleme mit dem Chef oder Kollegen. Sprechen Sie über das, was Sie sich wünschen – nicht über das, was Sie stört.",
                  beispiel: "«Ich schätze meine Zeit bei der aktuellen Firma sehr. Ich suche jetzt bewusst eine Aufgabe mit mehr internationaler Ausrichtung und grösserer Eigenverantwortung – beides bietet Ihr Unternehmen.»",
                },
                {
                  frage: "«Wo sehen Sie sich in fünf Jahren?»",
                  tipp: "Zeigen Sie Ambitionen, aber bleiben Sie realistisch und zum Unternehmen passend. Vermeiden Sie vage Antworten oder zu konkrete Karrierestufen, die das Unternehmen möglicherweise nicht bieten kann.",
                  beispiel: "«In fünf Jahren möchte ich Fachverantwortung für ein grösseres Segment übernehmen und mein Team mitentwickeln. Ich sehe das als natürliche Weiterentwicklung meiner aktuellen Kompetenzen.»",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-semibold text-[#204878] mb-2">{item.frage}</h3>
                  <p className="text-[#374151] text-sm mb-3 leading-relaxed"><span className="font-medium">Strategie:</span> {item.tipp}</p>
                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-gray-100">
                    <p className="text-xs font-semibold text-[#64748B] uppercase mb-1">Beispielantwort</p>
                    <p className="text-[#374151] text-sm italic leading-relaxed">{item.beispiel}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Do's und Don'ts im Bewerbungsgespräch</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl border border-green-100 p-5">
                <h3 className="font-semibold text-green-800 mb-3">Do's</h3>
                <ul className="space-y-2">
                  {[
                    "Pünktlich erscheinen (5–10 Min. früher)",
                    "Aktiv zuhören und nachfragen",
                    "Konkrete Beispiele verwenden",
                    "Eigene Fragen stellen",
                    "Ehrlich und direkt kommunizieren",
                    "Entschlossenheit und Interesse zeigen",
                  ].map((item, i) => (
                    <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                      <span className="font-bold">+</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl border border-red-100 p-5">
                <h3 className="font-semibold text-red-800 mb-3">Don'ts</h3>
                <ul className="space-y-2">
                  {[
                    "Über frühere Arbeitgeber negativ sprechen",
                    "Das Handy nicht ausschalten",
                    "Unvorbereitet erscheinen",
                    "Keine eigenen Fragen stellen",
                    "Lohnforderungen zu früh ansprechen",
                    "Unsicher oder defensiv wirken",
                  ].map((item, i) => (
                    <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="font-bold">−</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/lohn-verhandeln-schweiz", label: "Lohn verhandeln" },
                { href: "/bewerbung-schweiz", label: "Bewerbung in der Schweiz" },
                { href: "/bewerbung-schreiben", label: "Bewerbung schreiben" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[#204878] font-medium">
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Häufige Fragen zum Bewerbungsgespräch</h2>
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
              Neben Lebenslauf und Motivationsschreiben bereiten wir Sie auch gezielt auf Ihr Vorstellungsgespräch vor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/service-career" className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200">
                Bewerbungsberatung buchen
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
