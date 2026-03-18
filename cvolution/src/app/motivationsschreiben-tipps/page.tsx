import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Motivationsschreiben Tipps Schweiz 2026 | So überzeugen Sie Arbeitgeber",
  description:
    "Die wichtigsten Tipps für ein überzeugendes Motivationsschreiben auf dem Schweizer Arbeitsmarkt. Konkrete Ratschläge von erfahrenen Recruiting-Experten.",
  alternates: { canonical: "https://cvolution.ch/motivationsschreiben-tipps" },
};

const faqData = [
  {
    question: "Wie passe ich mein Motivationsschreiben auf jede Stelle an?",
    answer:
      "Analysieren Sie die Stellenausschreibung genau und markieren Sie die wichtigsten Anforderungen. Zeigen Sie für jede Kernanforderung, wie Sie diese erfüllen – möglichst mit einem konkreten Beispiel. Nehmen Sie auch Bezug auf das Unternehmen selbst.",
  },
  {
    question: "Soll ich meine Lohnvorstellung im Motivationsschreiben angeben?",
    answer:
      "Nur wenn das Unternehmen explizit danach fragt. Wenn ja, nennen Sie eine konkrete Zahl oder eine Spanne, basierend auf Ihrer Lohnrecherche für den Schweizer Markt. Eine Lohnanalyse hilft Ihnen dabei, realistische Erwartungen zu setzen.",
  },
  {
    question: "Kann ich ein Motivationsschreiben auch per E-Mail einreichen?",
    answer:
      "Ja, bei einer E-Mail-Bewerbung gehört das Motivationsschreiben als Anhang (PDF) oder der Text kann direkt in die E-Mail integriert werden – je nach Vorgabe des Unternehmens. Die E-Mail selbst sollte eine kurze, professionelle Einleitung enthalten.",
  },
  {
    question: "Wie gehe ich mit einem Jobwechsel im Motivationsschreiben um?",
    answer:
      "Erklären Sie Ihren Wechselwunsch positiv und zukunftsorientiert. Vermeiden Sie negative Aussagen über Ihren aktuellen Arbeitgeber. Fokussieren Sie sich auf das, was Sie sich vom neuen Unternehmen und der neuen Stelle versprechen.",
  },
  {
    question: "Wie wichtig ist die Anrede im Motivationsschreiben?",
    answer:
      "Sehr wichtig. Finden Sie den Namen der zuständigen Person heraus und sprechen Sie sie direkt an. 'Sehr geehrte Damen und Herren' ist eine Notlösung – eine persönliche Anrede zeigt, dass Sie sich Mühe gegeben haben.",
  },
];

export default function MotivationsschreibenTippsPage() {
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
              Motivationsschreiben Tipps: So überzeugen Sie Schweizer Arbeitgeber
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Viele Bewerbende investieren viel Zeit in ihren Lebenslauf – und vernachlässigen das Motivationsschreiben.
              Dabei ist es oft das entscheidende Dokument. Erfahren Sie, worauf es wirklich ankommt.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Warum das Motivationsschreiben wichtiger ist als viele denken</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Der Lebenslauf zeigt, was Sie getan haben. Das Motivationsschreiben zeigt, wer Sie sind und warum Sie
              die richtige Wahl für diese spezifische Stelle sind. Bei gleichwertigen Kandidierenden gibt das
              Motivationsschreiben oft den Ausschlag.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Im Schweizer Kontext ist das besonders relevant: Die Unternehmenskultur, die Soft Skills und die
              persönliche Passung werden hierzulande sehr hoch gewichtet. Ein Motivationsschreiben, das diese
              Elemente adressiert, kann einen entscheidenden Vorteil verschaffen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Die 10 wichtigsten Tipps für Ihr Motivationsschreiben</h2>
            <div className="space-y-5">
              {[
                {
                  tip: "1. Individualisieren Sie jedes Schreiben",
                  text: "Ein generisches Motivationsschreiben ist leicht erkennbar und landet schnell im Ablage-Stapel. Nehmen Sie sich Zeit, jeden Brief auf das spezifische Unternehmen und die spezifische Stelle zuzuschneiden. Das ist Arbeit – aber sie lohnt sich.",
                },
                {
                  tip: "2. Beginnen Sie stark",
                  text: "Verzichten Sie auf Floskeln wie 'Hiermit bewerbe ich mich auf die Stelle...'. Starten Sie stattdessen mit einem Satz, der sofort Interesse weckt: einer Leistung, einem relevanten Bezug zum Unternehmen oder einer pointierten Aussage zu Ihrer Motivation.",
                },
                {
                  tip: "3. Zeigen Sie konkreten Mehrwert",
                  text: "Was können Sie dem Unternehmen konkret bringen? Vermeiden Sie allgemeine Aussagen und ersetzen Sie diese durch messbare Resultate aus Ihrer Vergangenheit. Zahlen überzeugen: Umsatz um X% gesteigert, Kosten um Y CHF gesenkt, Team von Z Personen geleitet.",
                },
                {
                  tip: "4. Zeigen Sie, dass Sie das Unternehmen kennen",
                  text: "Recherchieren Sie das Unternehmen gründlich: Website, Jahresbericht, LinkedIn, Pressemitteilungen. Ein echter Bezug auf das Unternehmen – ein Produkt, eine Initiative, ein Wert – zeigt echtes Interesse und hebt Sie von der Masse ab.",
                },
                {
                  tip: "5. Nutzen Sie die Sprache der Stellenausschreibung",
                  text: "Viele Unternehmen suchen nach bestimmten Keywords. Wenn in der Ausschreibung 'agile Methoden' oder 'Customer Centricity' erwähnt wird, sollten diese Begriffe auch in Ihrem Schreiben vorkommen – natürlich nur, wenn sie auf Sie zutreffen.",
                },
                {
                  tip: "6. Halten Sie sich an eine Seite",
                  text: "Mehr als eine A4-Seite ist zu lang. Wenn Sie Mühe haben, sich kurz zu fassen, ist das oft ein Zeichen, dass Sie noch nicht klar genug wissen, was Sie sagen wollen. Klare Gedanken führen zu klaren Texten.",
                },
                {
                  tip: "7. Formulieren Sie im Aktiv",
                  text: "Passive Konstruktionen wirken schwach: 'Es wurden von mir Projekte geleitet.' Schreiben Sie stattdessen: 'Ich leitete Projekte mit einem Budget von CHF 500'000.' Aktiv klingt entschieden und selbstsicher.",
                },
                {
                  tip: "8. Vermeiden Sie Wiederholungen aus dem Lebenslauf",
                  text: "Das Motivationsschreiben ergänzt den Lebenslauf – es wiederholt ihn nicht. Gehen Sie nicht Ihre ganze Karriere durch. Wählen Sie ein oder zwei besonders relevante Erfahrungen aus und gehen Sie darauf tiefer ein.",
                },
                {
                  tip: "9. Schliessen Sie professionell ab",
                  text: "Drücken Sie im Schlussteil Ihre Freude auf ein Gespräch aus und geben Sie an, wann Sie verfügbar wären. Zeigen Sie Eigeninitiative: 'Ich freue mich darauf, Ihnen meine Ideen in einem persönlichen Gespräch zu erläutern.'",
                },
                {
                  tip: "10. Lassen Sie es gegenlesen",
                  text: "Fehler im Motivationsschreiben wirken fahrlässig. Lassen Sie das Dokument von einer vertrauenswürdigen Person – oder einem Profi – gegenlesen, bevor Sie es einsenden.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-semibold text-[#204878] mb-2">{item.tip}</h3>
                  <p className="text-[#374151] text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Checkliste: Ist Ihr Motivationsschreiben bereit?</h2>
            <ul className="space-y-2">
              {[
                "Adresse, Datum und vollständige Kontaktdaten sind vorhanden",
                "Persönliche Anrede mit Namen der Ansprechperson",
                "Kein generischer Einstieg wie 'Hiermit bewerbe ich mich'",
                "Konkreter Bezug auf das Unternehmen und die Stelle",
                "Mindestens ein messbares Ergebnis aus meiner Karriere",
                "Keine Wiederholungen aus dem Lebenslauf",
                "Maximal eine A4-Seite",
                "Kein einziger Rechtschreibfehler",
                "Aktive Formulierungen durchgehend",
                "Professioneller Abschluss mit Einladung zum Gespräch",
                "Als PDF gespeichert mit professionellem Dateinamen",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/bewerbung-schreiben", label: "Bewerbung schreiben" },
                { href: "/bewerbungsgespraech-tipps", label: "Bewerbungsgespräch Tipps" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[#204878] font-medium">
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Häufige Fragen</h2>
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
              Gemeinsam erarbeiten wir Ihr individuelles Motivationsschreiben – überzeugend, klar und auf den Punkt.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/service-motivation" className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200">
                Jetzt Beratung buchen
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
