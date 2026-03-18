import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lohnanalyse Schweiz 2026 | Ihren Marktwert kennen und nutzen",
  description:
    "Lohnanalyse Schweiz: Erfahren Sie, wie Sie Ihren fairen Lohn ermitteln, welche Faktoren den Lohn beeinflussen und wie Sie Lohnungleichheiten erkennen und ansprechen.",
  alternates: { canonical: "https://cvolution.ch/lohnanalyse-schweiz" },
};

const faqData = [
  {
    question: "Wie ermittle ich meinen fairen Lohn in der Schweiz?",
    answer:
      "Nutzen Sie offizielle Quellen wie den Lohnrechner Salarium des Bundesamts für Statistik (BFS), der nach Branche, Kanton, Ausbildung und Erfahrung filtert. Ergänzend helfen Lohncheck.ch, der JobCloud-Lohnindex sowie Gespräche in Ihrem Berufsumfeld.",
  },
  {
    question: "Welche Faktoren beeinflussen den Lohn in der Schweiz am stärksten?",
    answer:
      "Die wichtigsten Faktoren sind: Kanton (Zürich, Zug und Genf zahlen am meisten), Branche (Finanz, Pharma, IT führen), Ausbildungsniveau, Berufserfahrung, Unternehmensgrösse und Führungsverantwortung.",
  },
  {
    question: "Was ist der Medianlohn in der Schweiz?",
    answer:
      "Gemäss der Lohnstrukturerhebung des BFS lag der monatliche Bruttomedianlohn 2022 bei rund CHF 6'788. Das heisst, die Hälfte der Arbeitnehmenden verdient mehr, die andere Hälfte weniger. Für aussagekräftige Vergleiche sollten Sie branchenspezifische Zahlen verwenden.",
  },
  {
    question: "Wie erkenne ich eine unfaire Entlöhnung?",
    answer:
      "Vergleichen Sie Ihren Lohn mit Marktdaten für gleichwertige Stellen. Grosse Abweichungen von mehr als 15–20 % nach unten ohne sachliche Begründung können auf eine unterdurchschnittliche Entlöhnung hinweisen. Der Equal Pay Quick-Check des Bundes hilft, geschlechtsbezogene Lohnungleichheiten zu identifizieren.",
  },
  {
    question: "Muss mein Arbeitgeber mir Lohnanalysen offenlegen?",
    answer:
      "Unternehmen mit 100 oder mehr Mitarbeitenden sind gemäss dem revidierten Gleichstellungsgesetz verpflichtet, alle vier Jahre eine interne Lohnanalyse durchzuführen und die Mitarbeitenden über die Ergebnisse zu informieren.",
  },
  {
    question: "Was ist der Unterschied zwischen Brutto- und Nettolohn?",
    answer:
      "Der Bruttolohn ist der vereinbarte Lohn vor Abzügen. Vom Bruttolohn werden AHV/IV/EO, ALV, Pensionskassenbeitrag (BVG) und die Quellensteuer (bei C-Ausweis-Inhabern) abgezogen. In der Schweiz trägt der Arbeitnehmer je nach Kanton zwischen 15–25 % Sozialabgaben.",
  },
];

export default function LohnanalyseSchweiz() {
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
              Lohnanalyse Schweiz – Ihren Marktwert kennen und einsetzen
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Wer seinen Marktwert kennt, verhandelt selbstbewusster und erzielt bessere Ergebnisse. Eine systematische
              Lohnanalyse hilft Ihnen zu verstehen, wo Sie im Vergleich zu ähnlichen Stellen stehen – und gibt Ihnen eine
              solide Basis für Gespräche mit Ihrem Arbeitgeber.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Warum eine Lohnanalyse wichtig ist</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Viele Arbeitnehmende in der Schweiz wissen nicht, ob ihr Gehalt marktgerecht ist. Ohne Vergleichsdaten
              fehlt die Grundlage für Verhandlungen – und man riskiert, über Jahre unterbezahlt zu bleiben.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Gleichzeitig ist Lohntransparenz in der Schweiz begrenzt: Im Gegensatz zu einigen anderen Ländern ist es
              nicht üblich, offen über Gehälter zu sprechen. Dennoch gibt es zuverlässige Quellen, mit denen Sie Ihren
              fairen Lohn ermitteln können.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Die wichtigsten Lohnquellen in der Schweiz</h2>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">1. Salarium – Lohnrechner des BFS</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Der Lohnrechner Salarium des Bundesamts für Statistik basiert auf der Lohnstrukturerhebung und ist die
              zuverlässigste öffentliche Quelle. Sie können filtern nach:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Berufsgruppe (nach ISCO-Klassifikation)",
                "Kanton und Grossregion",
                "Ausbildungsniveau (obligatorisch bis Universität)",
                "Berufserfahrung in Jahren",
                "Unternehmensgrösse",
                "Sektor (privat / öffentlich)",
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
              Das Ergebnis zeigt Ihnen den Medianlohn sowie das 1. und 3. Quartil – also den Bereich, in dem 50 % der
              Arbeitnehmenden mit ähnlichem Profil liegen.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">2. Lohncheck.ch</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Crowdsourced Daten von Arbeitnehmenden. Hilfreich für einen schnellen Überblick, aber mit Vorsicht zu
              geniessen: Die Qualität der Daten hängt von den eingetragenen Profilen ab.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">3. JobCloud Lohnindex</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Basiert auf ausgeschriebenen Stellen auf jobs.ch und jobup.ch. Zeigt, was Arbeitgeber bereit sind zu
              zahlen – nützlich als Ergänzung zu den BFS-Daten.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">4. Branchenverbände und Gewerkschaften</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Viele Branchenverbände (z. B. Swiss Engineering, ICT-Berufsbildung, Kaufmännischer Verband) publizieren
              jährliche Lohnstudien. Diese sind oft detaillierter als allgemeine Rechner.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Lohnunterschiede in der Schweiz – die wichtigsten Faktoren</h2>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Kanton</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Der Wohnort bzw. Arbeitsort beeinflusst den Lohn erheblich. Die Kantone mit den höchsten Löhnen sind:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Kanton Zug:</strong> Tiefe Steuern ziehen Firmen an – hohe Löhne, besonders in Finanz und Pharma</>,
                <><strong>Kanton Zürich:</strong> Grösster Wirtschaftsraum, hohe Löhne über alle Branchen</>,
                <><strong>Kanton Basel-Stadt:</strong> Pharmaindustrie prägt das Lohnniveau</>,
                <><strong>Kanton Genf:</strong> Internationales Umfeld, hohe Löhne in NGOs und Finanzbranche</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Branche</h3>
            <p className="text-[#374151] leading-relaxed mb-4">Die Branche ist einer der stärksten Lohntreiber. Überdurchschnittlich zahlen:</p>
            <ul className="space-y-2 mb-4">
              {[
                "Finanzdienstleistungen und Versicherungen",
                "Pharmaindustrie und Life Sciences",
                "IT und Software-Entwicklung",
                "Unternehmensberatung",
                "Ingenieurwesen und Maschinenindustrie",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Ausbildung und Erfahrung</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Ein Hochschulabschluss erhöht den Lohn im Median um 20–40 % gegenüber einer Berufslehre. Mit jedem Jahr
              relevanter Berufserfahrung steigt der Lohn – dieser Effekt flacht ab ca. 15 Jahren ab.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">So führen Sie Ihre persönliche Lohnanalyse durch</h2>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Definieren Sie Ihre Vergleichsgruppe:</strong> Gleiche Funktion, ähnliche Erfahrung, gleiche Region und Branche.</>,
                <><strong>Nutzen Sie mindestens zwei Quellen:</strong> Salarium als Basis, Lohncheck.ch zur Ergänzung.</>,
                <><strong>Berücksichtigen Sie Nebenleistungen:</strong> Bonus, BVG-Beitrag, Homeoffice, Ferientage und Weiterbildungsbudget sind Teil der Gesamtvergütung.</>,
                <><strong>Notieren Sie den Brutto-Jahreslohn:</strong> In der Schweiz wird der Lohn meist auf 12 Monate berechnet. Ein 13. Monatslohn ist verbreitet und sollte separat ausgewiesen sein.</>,
                <><strong>Vergleichen Sie:</strong> Liegt Ihr Lohn mehr als 15 % unter dem Median für Ihr Profil, ist eine Verhandlung angebracht.</>,
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Lohngleichheit in der Schweiz</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Das Gleichstellungsgesetz (GlG) verpflichtet Unternehmen mit 100 oder mehr Mitarbeitenden, alle vier
              Jahre eine Lohnanalyse durchzuführen. Ziel ist es, ungerechtfertigte Lohnunterschiede zwischen Frauen und
              Männern zu identifizieren und zu korrigieren.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Der Bund stellt das Analyse-Tool Logib zur Verfügung, mit dem Unternehmen die Lohngleichheit intern
              prüfen können. Arbeitnehmende können den Equal Pay Quick-Check nutzen, um eine erste Einschätzung zu
              erhalten.
            </p>
          </section>

          {/* Internal links - card grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/lohn-verhandeln-schweiz", label: "Lohn verhandeln Schweiz – Strategien und Formulierungen" },
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
