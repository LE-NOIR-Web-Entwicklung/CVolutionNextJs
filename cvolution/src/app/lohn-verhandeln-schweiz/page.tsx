import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lohn verhandeln Schweiz 2025 | Tipps für mehr Gehalt",
  description:
    "Lohn verhandeln in der Schweiz: Wie Sie Ihr Gehalt erfolgreich verhandeln, den richtigen Zeitpunkt wählen und typische Fehler vermeiden. Mit konkreten Beispielen und Formulierungen.",
  alternates: { canonical: "https://cvolution.ch/lohn-verhandeln-schweiz" },
};

const faqData = [
  {
    question: "Wann ist der beste Zeitpunkt für eine Lohnverhandlung?",
    answer:
      "Der beste Zeitpunkt ist nach einem positiven Leistungsgespräch, nach dem Abschluss eines erfolgreichen Projekts oder im Rahmen der jährlichen Mitarbeiterbeurteilung. Auch bei einer Beförderung oder einer Erweiterung Ihrer Aufgaben ist eine Lohnverhandlung angebracht.",
  },
  {
    question: "Wie viel mehr Lohn kann ich in der Schweiz verlangen?",
    answer:
      "In der Schweiz sind Lohnerhöhungen von 3–10 % realistisch, abhängig von Branche, Leistung und Marktlage. Wer den Job wechselt, kann oft 10–20 % mehr erzielen. Recherchieren Sie vorab Marktlöhne mit dem Lohnrechner des Bundesamts für Statistik oder auf Lohnplattformen wie Salarium.",
  },
  {
    question: "Wie nenne ich meine Lohnvorstellung in einer Bewerbung?",
    answer:
      "Nennen Sie einen konkreten Betrag oder eine enge Bandbreite – z. B. «CHF 95'000–105'000 brutto pro Jahr». Vermeiden Sie vage Formulierungen wie «verhandelbar» oder «marktüblich», da diese einen schwachen Eindruck hinterlassen.",
  },
  {
    question: "Was tun, wenn der Arbeitgeber das Angebot ablehnt?",
    answer:
      "Fragen Sie nach den Gründen und erkundigen Sie sich, wann eine Lohnerhöhung möglich wäre. Vereinbaren Sie konkrete Ziele, bei deren Erreichen das Gehalt angepasst wird. So schaffen Sie eine klare Perspektive.",
  },
  {
    question: "Darf man in der Schweiz über den Lohn sprechen?",
    answer:
      "Ja. Es gibt in der Schweiz keine gesetzliche Schweigepflicht über den eigenen Lohn. Arbeitgeber können zwar um Diskretion bitten, ein Verbot ist jedoch nicht durchsetzbar. Transparenz über Löhne fördert die Lohngleichheit.",
  },
  {
    question: "Welche Argumente überzeugen beim Lohngespräch?",
    answer:
      "Konkrete Leistungsnachweise, Marktdaten, übernommene Zusatzverantwortung und nachgewiesener Mehrwert für das Unternehmen. Persönliche Bedürfnisse wie Miete oder Lebenshaltungskosten sind kein überzeugendes Argument.",
  },
];

export default function LohnVerhandelnSchweiz() {
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
              Lohn verhandeln in der Schweiz – Strategien, Tipps und Formulierungen
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Die Lohnverhandlung gehört zu den unangenehmsten, aber wichtigsten Momenten im Berufsleben. In der Schweiz
              gilt: Wer gut vorbereitet ins Gespräch geht, gut begründet und den richtigen Zeitpunkt wählt, erzielt
              spürbar bessere Ergebnisse. Dieser Leitfaden zeigt Ihnen, wie Sie Ihren Marktwert kennen, souverän
              kommunizieren und häufige Fehler vermeiden.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Ihren Marktwert kennen – die Basis jeder Verhandlung</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Bevor Sie ins Gespräch gehen, müssen Sie wissen, was Ihr Profil auf dem Schweizer Arbeitsmarkt wert ist.
              Lohnverhandlungen ohne Datenbasis wirken unsicher und unvorbereitet.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Geeignete Lohnquellen in der Schweiz</h3>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Salarium (BFS):</strong> Der offizielle Lohnrechner des Bundesamts für Statistik – kostenlos und nach Branche, Region und Qualifikation filterbar.</>,
                <><strong>Lohncheck.ch:</strong> Crowdsourced Lohndaten von Arbeitnehmenden in der Schweiz.</>,
                <><strong>JobCloud Lohnindex:</strong> Basiert auf tatsächlichen Stelleninseraten von jobs.ch und jobup.ch.</>,
                <><strong>Branchenverbände:</strong> Viele Verbände publizieren jährliche Lohnstudien für ihre Branche.</>,
                <><strong>Netzwerk:</strong> Gespräche mit Kolleginnen und Kollegen in ähnlichen Positionen liefern realistische Einblicke.</>,
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
              Berechnen Sie eine Zielspanne: Ihr Wunschgehalt oben, Ihre Untergrenze unten. Kommunizieren Sie die obere
              Grenze – so haben Sie Verhandlungsspielraum nach unten.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Wann verhandeln? Den richtigen Zeitpunkt wählen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Timing ist in der Lohnverhandlung entscheidend. Wer im falschen Moment fragt, riskiert eine Absage – nicht
              weil das Anliegen unberechtigt ist, sondern weil der Kontext fehlt.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Günstige Zeitpunkte</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Nach einem abgeschlossenen, erfolgreichen Projekt",
                "Im jährlichen Mitarbeitergespräch",
                "Bei Übernahme neuer Verantwortlichkeiten oder einer Beförderung",
                "Nach dem Ablauf einer Probezeit mit positiver Rückmeldung",
                "Beim Jobwechsel – vor Unterzeichnung des neuen Arbeitsvertrags",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Ungünstige Zeitpunkte</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Unmittelbar nach einem Fehler oder einer Krise im Team",
                "Während einer wirtschaftlichen Schwächephase des Unternehmens",
                "In den ersten drei Monaten einer neuen Stelle",
                "Kurz vor dem Ende des Geschäftsjahres, wenn Budgets bereits fixiert sind",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Überzeugende Argumente – was wirklich zählt</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              In der Schweiz sind sachliche, leistungsbezogene Argumente am wirkungsvollsten. Emotionale oder
              persönliche Begründungen überzeugen selten.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Starke Argumente</h3>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Konkrete Leistungsnachweise:</strong> «Ich habe im letzten Jahr den Umsatz in meinem Bereich um 15 % gesteigert.»</>,
                <><strong>Marktdaten:</strong> «Laut Salarium liegt der Medianlohn für meine Funktion in dieser Region bei CHF 95&apos;000.»</>,
                <><strong>Erweiterte Verantwortung:</strong> «Seit Januar leite ich zusätzlich das Projektteam mit fünf Personen.»</>,
                <><strong>Weiterbildung:</strong> «Ich habe im letzten Jahr den MAS in Projektmanagement abgeschlossen.»</>,
                <><strong>Externe Angebote:</strong> Nur als letztes Mittel – und nur wenn Sie das Angebot auch annehmen würden.</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Schwache Argumente – diese sollten Sie vermeiden</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Gestiegene Lebenshaltungskosten oder Miete",
                "«Ich brauche mehr Geld»",
                "Langjährige Betriebszugehörigkeit ohne Leistungsbezug",
                "Vergleich mit Kollegen ohne konkrete Grundlage",
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

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Konkrete Formulierungen für das Gespräch</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Vorbereitung bedeutet auch, die richtigen Worte parat zu haben. Die folgenden Beispiele zeigen, wie Sie
              sachlich und selbstbewusst kommunizieren:
            </p>
            <div className="space-y-4">
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-[#111827] mb-3">Einstieg ins Gespräch</h3>
                <p className="text-[#374151] italic">
                  «Ich schätze die Zusammenarbeit und möchte gerne über meine Vergütung sprechen. Ich habe mich intensiv
                  mit dem Markt beschäftigt und glaube, dass eine Anpassung angebracht wäre.»
                </p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-[#111827] mb-3">Konkreter Wunsch</h3>
                <p className="text-[#374151] italic">
                  «Basierend auf meinen Leistungen und dem Marktvergleich möchte ich eine Anpassung auf CHF 105&apos;000 brutto
                  pro Jahr vorschlagen.»
                </p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-[#111827] mb-3">Reaktion auf ein tieferes Angebot</h3>
                <p className="text-[#374151] italic">
                  «Ich verstehe die Rahmenbedingungen. Wäre es möglich, in sechs Monaten erneut darüber zu sprechen, wenn
                  die Budgetplanung für nächstes Jahr läuft?»
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Lohn beim Jobwechsel verhandeln</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Ein Stellenwechsel bietet die beste Möglichkeit für eine substanzielle Lohnsteigerung. Wer wechselt, kann
              realistischerweise 10–20 % mehr erzielen – sofern das Profil zum Unternehmen passt.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Schritt für Schritt beim Jobwechsel</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Recherchieren Sie den Marktlohn für die neue Position.",
                "Definieren Sie Ihre Untergrenze – unter der Sie den Job nicht annehmen würden.",
                "Warten Sie, bis das Unternehmen eine Zahl nennt oder danach fragt.",
                "Nennen Sie eine konkrete Zahl oder eine enge Bandbreite.",
                "Verhandeln Sie auch Nebenleistungen: Homeoffice, Weiterbildungsbudget, Bonusregelungen.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[#374151] leading-relaxed mb-4">
              Denken Sie daran: Mit der Unterzeichnung des Arbeitsvertrags ist die Verhandlung abgeschlossen. Danach
              gelten andere Spielregeln.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Nebenleistungen als Teil der Gesamtvergütung</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              In der Schweiz ist der Grundlohn nur ein Teil der Gesamtvergütung. Prüfen Sie auch:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Bonus und variable Vergütung:</strong> Ziele, Berechnungsgrundlage, historische Ausschüttung</>,
                <><strong>Pensionskasse (BVG):</strong> Arbeitgeberanteil, überobligatorische Leistungen</>,
                <><strong>Homeoffice-Regelung:</strong> Tage pro Woche, Infrastrukturunterstützung</>,
                <><strong>Weiterbildungsbudget:</strong> Betrag pro Jahr, Freistellungsregelungen</>,
                <><strong>Ferien:</strong> Gesetzliches Minimum sind 4 Wochen – viele Unternehmen bieten 5 Wochen</>,
                <><strong>Fahrkostenentschädigung / Geschäftsauto</strong></>,
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

          {/* Internal links - card grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/lohnanalyse-schweiz", label: "Lohnanalyse Schweiz – Was ist Ihr Marktwert?" },
                { href: "/bewerbungsgespraech-tipps", label: "Bewerbungsgespräch Tipps – So überzeugen Sie im Interview" },
                { href: "/bewerbung-schweiz", label: "Bewerbung Schweiz – Alles zum Schweizer Bewerbungsprozess" },
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
              <Link href="/service-salary"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200">
                Lohn analysieren lassen
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
