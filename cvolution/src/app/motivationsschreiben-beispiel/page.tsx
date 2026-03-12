import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Motivationsschreiben Beispiel Schweiz 2025 | Muster & Vorlagen",
  description:
    "Überzeugende Motivationsschreiben-Beispiele für den Schweizer Arbeitsmarkt. Mit konkreten Mustern, Struktur-Tipps und Formulierungshilfen für Ihre nächste Bewerbung.",
  alternates: { canonical: "https://cvolution.ch/motivationsschreiben-beispiel" },
};

const faqData = [
  {
    question: "Wie lang sollte ein Motivationsschreiben in der Schweiz sein?",
    answer:
      "Eine DIN-A4-Seite ist das Mass aller Dinge. Kürzer darf es gerne sein – länger sollte es nicht werden. Schweizer Personalverantwortliche schätzen Prägnanz und klare Botschaften.",
  },
  {
    question: "Soll ich das Motivationsschreiben oder das Bewerbungsschreiben schreiben?",
    answer:
      "In der Schweiz wird meist von Motivationsschreiben gesprochen. Es unterscheidet sich vom deutschen Anschreiben dadurch, dass es stärker auf Motivation und persönliche Passung fokussiert und weniger formalisiert ist.",
  },
  {
    question: "Darf ich dasselbe Motivationsschreiben für mehrere Stellen verwenden?",
    answer:
      "Nein. Ein gutes Motivationsschreiben ist individuell auf das Unternehmen und die Stelle zugeschnitten. Generische Schreiben werden von erfahrenen Personalverantwortlichen sofort erkannt und hinterlassen einen schlechten Eindruck.",
  },
  {
    question: "Wie beginne ich ein Motivationsschreiben ohne 'Hiermit bewerbe ich mich'?",
    answer:
      "Steigen Sie mit einem konkreten Bezug ein: einem Ergebnis, einer Aussage über das Unternehmen oder einer persönlichen Verbindung zur Stelle. Zum Beispiel: 'Die Transformation des Schweizer Gesundheitswesens durch digitale Lösungen – daran möchte ich aktiv mitwirken.'",
  },
  {
    question: "Was gehört nicht ins Motivationsschreiben?",
    answer:
      "Vermeiden Sie: Wiederholungen aus dem Lebenslauf, Floskeln wie 'teamfähig und belastbar', negative Aussagen über frühere Arbeitgeber, übertriebene Selbstloberei und irrelevante Persönliches.",
  },
  {
    question: "Wie weise ich nach, dass ich zum Unternehmen passe?",
    answer:
      "Recherchieren Sie das Unternehmen gründlich und zeigen Sie in Ihrem Schreiben, dass Sie die Unternehmenskultur, die Branchenherausforderungen und die spezifischen Anforderungen der Stelle verstehen. Konkrete Bezüge auf das Unternehmen zeigen echtes Interesse.",
  },
];

export default function MotivationsschreibenBeispielPage() {
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
              Motivationsschreiben Beispiel Schweiz: Muster für eine überzeugende Bewerbung
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Das Motivationsschreiben ist Ihre Chance, über den Lebenslauf hinauszugehen und zu zeigen, warum
              Sie die richtige Person für diese Stelle sind. Lernen Sie anhand konkreter Beispiele, wie Sie ein
              überzeugendes Schreiben verfassen.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Was ein gutes Motivationsschreiben auszeichnet</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Ein starkes Motivationsschreiben beantwortet drei Fragen, die sich jede Personalverantwortliche
              Person stellt: Warum diese Stelle? Warum dieses Unternehmen? Und warum genau Sie? Wer diese drei
              Fragen überzeugend beantwortet, hat gute Chancen auf eine Einladung zum Vorstellungsgespräch.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Im Schweizer Arbeitsmarkt wird Wert auf einen respektvollen, aber direkten Ton gelegt. Vermeiden Sie
              übertriebene Unterwerfungsgesten wie «ich würde mich sehr ehren» – zeigen Sie stattdessen Selbstsicherheit
              und konkreten Mehrwert.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Aufbau eines Motivationsschreibens</h2>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Einstieg: Einen starken ersten Eindruck setzen</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Beginnen Sie nicht mit der Floskel «Hiermit bewerbe ich mich». Starten Sie stattdessen mit einem
              überzeugenden Einstieg, der Ihr Interesse an der Stelle begründet oder eine relevante Leistung
              vorwegnimmt. Der erste Satz entscheidet oft darüber, ob der Rest gelesen wird.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Hauptteil: Mehrwert und Passung zeigen</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Im Hauptteil zeigen Sie, was Sie einbringen. Verknüpfen Sie Ihre konkreten Erfahrungen mit den
              Anforderungen aus der Stellenausschreibung. Verwenden Sie Zahlen und messbare Resultate, wo es möglich
              ist. Gehen Sie auf das Unternehmen ein: Was finden Sie daran interessant? Was hat das Unternehmen
              geleistet, das Ihnen imponiert?
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Schluss: Aktiv und selbstsicher abschliessen</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Schliessen Sie mit einem klaren Call-to-Action. Zeigen Sie Bereitschaft für ein Gespräch und drücken
              Sie Ihre Überzeugung aus, einen Beitrag leisten zu können. Vermeiden Sie passiv klingende Formulierungen.
            </p>
          </section>

          {/* Example letter */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Vollständiges Beispiel: Motivationsschreiben Projektleiter</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-sm text-[#64748B]">Maria Müller | Musterstrasse 12, 8001 Zürich | +41 79 123 45 67 | maria.mueller@email.ch</p>
                <p className="text-sm text-[#64748B] mt-1">Zürich, 10. März 2025</p>
              </div>
              <div className="mb-4">
                <p className="font-semibold text-[#111827]">Muster AG</p>
                <p className="text-sm text-[#64748B]">Frau Sandra Meier, HR-Leiterin</p>
                <p className="text-sm text-[#64748B]">Bahnhofstrasse 100, 8001 Zürich</p>
              </div>
              <div className="space-y-4 text-[#374151] text-sm leading-relaxed">
                <p className="font-semibold text-[#111827]">Bewerbung als Projektleiterin Digital Marketing | Ref. DM-2025-04</p>
                <p>
                  Sehr geehrte Frau Meier
                </p>
                <p>
                  Die Transformation der Kundenkommunikation durch datengetriebene Marketingstrategien – daran arbeite ich seit fünf Jahren mit Leidenschaft. Dass die Muster AG diesen Weg konsequent geht, hat mich schon lange begeistert. Ihr kürzlich lanciertes Kundenbindungsprogramm hat in der Branche neue Massstäbe gesetzt. Genau in diesem Umfeld möchte ich die nächste Etappe meiner Karriere bestreiten.
                </p>
                <p>
                  In meiner aktuellen Position bei der Beispiel GmbH verantworte ich ein Team von fünf Fachkräften und ein Jahresbudget von CHF 180'000. In den letzten zwei Jahren haben wir die organische Reichweite unserer Hauptkanäle um 65 % gesteigert und die Kundenbindungsrate um 12 Prozentpunkte verbessert. Diese Ergebnisse habe ich durch konsequente A/B-Tests, datenbasierte Entscheidungen und enge Zusammenarbeit mit dem Vertriebsteam erreicht.
                </p>
                <p>
                  Was mich besonders motiviert, ist die Möglichkeit, bei der Muster AG die internationale Expansion des Marketings zu gestalten. Meine Kenntnisse in den Märkten Deutschland und Österreich sowie mein Netzwerk in der DACH-Region sehe ich als konkreten Mehrwert für Ihr Team.
                </p>
                <p>
                  Ich freue mich auf ein persönliches Gespräch, in dem ich Ihnen zeigen kann, wie ich zum Erfolg der Muster AG beitragen werde.
                </p>
                <p>Freundliche Grüsse</p>
                <p className="font-medium">Maria Müller</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Häufige Formulierungsfehler und bessere Alternativen</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-[#111827] bg-white rounded-tl-xl">Schwache Formulierung</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#111827] bg-white rounded-tr-xl">Starke Alternative</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Ich bin teamfähig und belastbar", "In meinen Projekten koordiniere ich Teams von bis zu 8 Personen und halte Deadlines auch unter Druck zuverlässig ein"],
                    ["Ich würde mich über eine Einladung freuen", "Ich freue mich auf ein Gespräch und bringe konkrete Ideen für [Bereich] mit"],
                    ["Ich habe Erfahrung in diesem Bereich", "In drei Jahren habe ich [Anzahl] Projekte in diesem Bereich geleitet und dabei [konkretes Ergebnis] erreicht"],
                    ["Ihr Unternehmen ist sehr interessant", "Ihr Ansatz, [spezifisches Merkmal], hat mich überzeugt, weil ich genau daran in den letzten Jahren gearbeitet habe"],
                  ].map(([bad, good], i) => (
                    <tr key={i} className="border-b border-gray-100 bg-white">
                      <td className="py-3 px-4 text-red-600">{bad}</td>
                      <td className="py-3 px-4 text-green-700">{good}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/motivationsschreiben-tipps", label: "Motivationsschreiben Tipps" },
                { href: "/bewerbung-schreiben", label: "Bewerbung schreiben" },
                { href: "/motivationsschreiben-ohne-erfahrung", label: "Motivationsschreiben ohne Erfahrung" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[#204878] font-medium">
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Häufige Fragen zum Motivationsschreiben</h2>
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
              Wir erarbeiten gemeinsam mit Ihnen ein überzeugendes Motivationsschreiben – individuell zugeschnitten auf die Stelle und das Unternehmen.
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
