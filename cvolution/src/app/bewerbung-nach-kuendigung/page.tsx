import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bewerbung nach Kündigung Schweiz 2025 | Tipps & Strategien",
  description:
    "Bewerbung nach einer Kündigung in der Schweiz: Wie Sie Lücken im Lebenslauf erklären, den richtigen Zeitpunkt für die Jobsuche wählen und trotz Entlassung überzeugend auftreten.",
  alternates: { canonical: "https://cvolution.ch/bewerbung-nach-kuendigung" },
};

const faqData = [
  {
    question: "Muss ich im Motivationsschreiben angeben, warum ich gekündigt wurde?",
    answer:
      "Nein. Sie sind nicht verpflichtet, die Gründe im Motivationsschreiben zu nennen. Im Vorstellungsgespräch wird die Frage meist kommen – bereiten Sie eine kurze, sachliche Antwort vor, die keine Schuldzuweisungen enthält.",
  },
  {
    question: "Wie erkläre ich eine Entlassung im Gespräch?",
    answer:
      "Kurz, sachlich und ohne Bitterkeit. Z. B.: «Das Unternehmen hat eine Restrukturierung durchgeführt, dabei wurde meine Stelle gestrichen.» Oder: «Ich und das Unternehmen haben sich auseinandergelebt – ich suche eine neue Herausforderung, die besser zu meinen Stärken passt.» Kein Schlechtreden des Ex-Arbeitgebers.",
  },
  {
    question: "Wie lange sollte ich mit der Jobsuche nach einer Kündigung warten?",
    answer:
      "Nicht zu lange. Melden Sie sich umgehend beim RAV an (innert 5 Werktagen nach Ende des Arbeitsverhältnisses), um keine Taggeldansprüche zu verlieren. Die aktive Jobsuche können Sie parallel zur Verarbeitung beginnen – je nach Situation mit gezielter oder breiter Suche.",
  },
  {
    question: "Wie gehe ich mit einer Lücke im Lebenslauf um?",
    answer:
      "Benennen Sie die Lücke kurz und ehrlich: «Berufliche Neuorientierung», «Familienzeit» oder «Weiterbildung». Wenn Sie in der Zwischenzeit Kurse besucht, Freiwilligenarbeit geleistet oder eigene Projekte vorangetrieben haben, erwähnen Sie das.",
  },
  {
    question: "Kann ich ein schlechtes Arbeitszeugnis durch eine gute Bewerbung ausgleichen?",
    answer:
      "Teilweise. Ein überzeugendes Motivationsschreiben, ein professioneller Lebenslauf und eine starke Performance im Interview können ein mittelmässiges Zeugnis relativieren. Klären Sie aber vorab, ob das Zeugnis tatsächlich schlecht ist – fragen Sie jemanden mit HR-Erfahrung um eine Einschätzung.",
  },
  {
    question: "Darf ich meinen aktuellen Arbeitgeber als Referenz angeben, wenn ich gekündigt wurde?",
    answer:
      "Das hängt vom Verhältnis ab. Wenn die Trennung einvernehmlich war, können Sie direkte Vorgesetzte anfragen. Sind die Verhältnisse angespannt, ist es besser, frühere Arbeitgeber oder externe Referenzpersonen zu nennen.",
  },
];

export default function BewerbungNachKuendigung() {
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
              Bewerbung nach einer Kündigung – Strategien für die Jobsuche in der Schweiz
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Eine Kündigung – ob selbst eingereicht oder vom Arbeitgeber ausgesprochen – ist kein Makel. In der Schweiz
              ist ein Stellenwechsel normal, und Arbeitgeber wissen, dass Restrukturierungen, Unternehmensaufgaben oder
              persönliche Neuorientierungen zur beruflichen Realität gehören. Entscheidend ist, wie Sie damit umgehen.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Erste Schritte nach der Kündigung</h2>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>RAV-Anmeldung:</strong> Melden Sie sich innerhalb von 5 Werktagen nach Beendigung des Arbeitsverhältnisses beim RAV an. Warten Sie nicht auf den letzten Arbeitstag.</>,
                <><strong>Arbeitszeugnis anfordern:</strong> Sie haben Anspruch auf ein Zwischenzeugnis oder endgültiges Zeugnis. Fordern Sie es aktiv an und prüfen Sie es sorgfältig.</>,
                <><strong>Unterlagen aktualisieren:</strong> Aktualisieren Sie Lebenslauf, LinkedIn-Profil und Zertifikatsliste, solange Sie noch im Unternehmen sind oder unmittelbar danach.</>,
                <><strong>Netzwerk aktivieren:</strong> In der Schweiz werden viele Stellen über persönliche Kontakte besetzt – informieren Sie Ihr Netzwerk diskret über Ihre Suche.</>,
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Lebenslauf nach einer Kündigung anpassen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Der Lebenslauf nach einer Kündigung muss keine negative Geschichte erzählen. Strukturieren Sie ihn so,
              dass Ihre Leistungen im Vordergrund stehen.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Umgang mit Lücken</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Eine Lücke von 1–3 Monaten ist in der Schweiz nicht ungewöhnlich und erklärungsbedürftig. Wenn die Lücke
              länger dauert, benennen Sie sie kurz im Lebenslauf:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "«Berufliche Neuorientierung und Weiterbildung | 2024–2025»",
                "«Selbststudium: CAS Digital Leadership (FHNW) | 2024»",
                "«Freiwilligenarbeit und Gesundheitsphase | 2024»",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Letzte Stelle richtig beschreiben</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Auch wenn das Arbeitsverhältnis unschön endete, beschreiben Sie Ihre Leistungen sachlich und positiv. Was
              haben Sie dort erreicht? Welche Projekte haben Sie vorangetrieben?
            </p>
          </section>

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Motivationsschreiben nach einer Kündigung</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Erwähnen Sie die Kündigung im Motivationsschreiben nicht explizit – ausser es ist unvermeidbar (z. B.
              weil Sie aktuell ohne Stelle sind und der Arbeitgeber dies aus dem Lebenslauf sieht).
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Fokussieren Sie stattdessen auf die Zukunft: Was suchen Sie? Was bringen Sie mit? Warum dieses
              Unternehmen?
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-[#111827] mb-2">Formulierungsbeispiel</h3>
              <p className="text-[#374151] italic">
                «Nach zehn Jahren in der Finanzbranche suche ich eine neue Herausforderung, bei der ich meine Erfahrung
                in der Prozessoptimierung gezielt einsetzen kann. Ihr Unternehmen spricht mich an, weil...»
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Im Vorstellungsgespräch auf die Frage vorbereitet sein</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Die Frage «Warum haben Sie Ihre letzte Stelle verlassen?» kommt in fast jedem Interview. Bereiten Sie
              eine ehrliche, aber konstruktive Antwort vor.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Was funktioniert</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Sachliche Nennung des Grundes (Restrukturierung, Stellenabbau, Strategiewechsel)",
                "Kurze Erklärung ohne emotionale Wertung",
                "Überleitung zur Zukunft: «Ich nutze diese Phase, um gezielt nach einer Stelle zu suchen, die...»",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Was Sie unbedingt vermeiden sollten</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Ex-Arbeitgeber schlechtreden oder kritisieren",
                "Lange Erklärungen oder Rechtfertigungen",
                "Widersprüche zwischen Ihren Angaben und dem Arbeitszeugnis",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Das Arbeitszeugnis prüfen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              In der Schweiz hat das Arbeitszeugnis eine kodierte Sprache. Achten Sie auf folgende Signalwörter:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm mb-6">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left text-[#374151]">Formulierung</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-[#374151]">Bedeutung</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«... hat sich stets bemüht»</td>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">Leistungen blieben hinter Erwartungen zurück</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«... war fleissig und willig»</td>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">Mittelmässige Leistung</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«... erledigte die Aufgaben zu unserer Zufriedenheit»</td>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">Durchschnittliche, ausreichende Leistung</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«... zu unserer vollen Zufriedenheit»</td>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">Gute Leistung</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">«... zu unserer vollsten Zufriedenheit»</td>
                    <td className="border border-gray-200 px-4 py-2 text-[#374151]">Sehr gute Leistung</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Bei Unklarheiten lassen Sie das Zeugnis von einer HR-Fachperson oder einem Karriereberater prüfen.
            </p>
          </section>

          {/* Internal links - card grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/rav-bewerbung-tipps", label: "RAV Bewerbung Tipps – Anforderungen erfüllen und gezielt suchen" },
                { href: "/bewerbungsgespraech-tipps", label: "Bewerbungsgespräch Tipps – Vorbereitung und häufige Fragen" },
                { href: "/bewerbung-schreiben", label: "Bewerbung schreiben – Vollständige Anleitung für die Schweiz" },
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
