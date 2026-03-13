import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bewerbung Schweiz 2025 | Alles über den Schweizer Bewerbungsprozess",
  description:
    "Der Schweizer Arbeitsmarkt hat eigene Regeln. Erfahren Sie alles über Bewerbungsunterlagen, Arbeitszeugnisse, Bewerbungsgespräche und die wichtigsten Unterschiede zur deutschen Bewerbung.",
  alternates: { canonical: "https://cvolution.ch/bewerbung-schweiz" },
};

const faqData = [
  {
    question: "Welche Unterschiede gibt es zwischen einer Schweizer und einer deutschen Bewerbung?",
    answer:
      "In der Schweiz ist das Bewerbungsdossier vollständiger: Arbeitszeugnisse und Diplome gehören standardmässig dazu. Das Anschreiben heisst Motivationsschreiben und ist persönlicher. Ausserdem wird in der Schweiz das Du weniger schnell angeboten – das formale Sie ist in Bewerbungen Standard.",
  },
  {
    question: "Muss ich als Ausländer oder Ausländerin meine Arbeitsbewilligung erwähnen?",
    answer:
      "Ja. Arbeitgeber müssen wissen, ob und in welcher Form Sie in der Schweiz arbeiten dürfen. Geben Sie im Lebenslauf Ihre Nationalität und die Art Ihrer Aufenthaltsbewilligung an (z. B. B-Ausweis, C-Ausweis, EU/EFTA-Staatsangehörige).",
  },
  {
    question: "Wie läuft ein typischer Bewerbungsprozess in der Schweiz ab?",
    answer:
      "Typischerweise: Ausschreibung, Bewerbungseingang und -prüfung, Telefoninterview, ein oder zwei persönliche Vorstellungsgespräche, Referenzcheck, Entscheid. Der gesamte Prozess dauert häufig vier bis acht Wochen.",
  },
  {
    question: "Ist es üblich, sich unaufgefordert zu bewerben?",
    answer:
      "Ja, die Spontanbewerbung (auch Initiative- oder Blindbewerbung genannt) ist in der Schweiz durchaus üblich und kann sehr erfolgreich sein – besonders für erfahrene Fachkräfte. Dabei ist ein direkter Bezug zur Person oder zum Unternehmen besonders wichtig.",
  },
  {
    question: "Was passiert, wenn ich das Vorstellungsgespräch im ersten Anlauf nicht bestehe?",
    answer:
      "Eine Absage nach dem Vorstellungsgespräch ist wertvoll: Fragen Sie nach konstruktivem Feedback. Oft können Sie damit Ihre Vorbereitung für das nächste Gespräch deutlich verbessern. Manchmal kommt auch eine zweite Chance: Stellen werden neu ausgeschrieben oder Kandidaten aus früheren Prozessen reaktiviert.",
  },
  {
    question: "Wie viele Bewerbungen sollte ich gleichzeitig laufend haben?",
    answer:
      "Das hängt vom Stellenmarkt und Ihrem Profil ab. Als Faustregel: Qualität vor Quantität. Zehn sorgfältige, individualisierte Bewerbungen sind effektiver als fünfzig generische. Behalten Sie den Überblick mit einer einfachen Tabelle oder einem Tracking-Tool.",
  },
];

export default function BewerbungSchweizPage() {
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
              Bewerbung in der Schweiz: Was Sie über den Schweizer Arbeitsmarkt wissen müssen
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Wer in der Schweiz eine Stelle sucht, muss die lokalen Gepflogenheiten kennen. Erfahren Sie, wie
              Bewerbungsprozesse in der Schweiz ablaufen, was Arbeitgeber erwarten und wie Sie sich gegenüber
              Mitbewerbenden durchsetzen.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Der Schweizer Arbeitsmarkt im Überblick</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Die Schweiz hat einen der wettbewerbsfähigsten Arbeitsmärkte Europas. Die Arbeitslosenquote ist im
              internationalen Vergleich niedrig, die Löhne sind hoch und die Qualitätsanforderungen der Arbeitgeber
              entsprechend ebenfalls. Gleichzeitig ist der Arbeitsmarkt stark von Fachkräftemangel geprägt – in
              vielen Branchen werden händeringend qualifizierte Mitarbeitende gesucht.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Besonders gefragt sind Fachkräfte in den Bereichen IT, Gesundheitswesen, Ingenieurwesen, Finanzen
              und Bildung. Trotz Fachkräftemangel sind die Anforderungen an Bewerbungsunterlagen hoch: Ein
              gepflegtes, vollständiges Dossier ist die Eintrittskarte zu jedem Vorstellungsgespräch.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Das vollständige Schweizer Bewerbungsdossier</h2>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Pflichtbestandteile</h3>
            <ul className="space-y-2 mb-6">
              {[
                { title: "Motivationsschreiben", desc: "Individuell auf Stelle und Unternehmen zugeschnitten, max. eine A4-Seite" },
                { title: "Lebenslauf mit Foto", desc: "Antichronologisch, max. 2 Seiten, mit professionellem Bewerbungsfoto" },
                { title: "Arbeitszeugnisse", desc: "Von den letzten zwei bis drei Arbeitgebern, neuestes zuerst" },
                { title: "Ausbildungsdiplome", desc: "Alle relevanten Abschlüsse, Zertifikate und Weiterbildungen" },
              ].map((item, i) => (
                <li key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <p className="font-semibold text-[#111827] text-sm">{item.title}</p>
                  <p className="text-[#64748B] text-sm">{item.desc}</p>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Optionale Ergänzungen</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Referenzadressen (wenn nicht bereits im Lebenslauf)",
                "Portfolio oder Arbeitsproben (in kreativen Berufen)",
                "LinkedIn-Profil-Link",
                "Motivationsbrief als separate Seite",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <span className="text-[#204878] font-bold mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Arbeitszeugnisse: Das Schweizer Besonderheit</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Das Schweizer Arbeitszeugnis ist ein rechtlich geregeltes Dokument. Es muss vollständig sein
              (alle ausgeübten Tätigkeiten nennen), wohlwollend formuliert sein und darf keine Informationen
              enthalten, die dem Mitarbeitenden bei zukünftigen Bewerbungen schaden.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Trotz dieser Wohlwollenspflicht gibt es eine ausgeprägte Zeugnissprache: Bestimmte Formulierungen
              haben eine spezifische Bedeutung, die erfahrene Personalverantwortliche sofort erkennen. Wenn Sie
              ein Zeugnis erhalten, das Sie für ungenügend halten, haben Sie das Recht, eine Berichtigung zu verlangen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Stellensuche in der Schweiz: Wo man findet</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "jobs.ch", typ: "Generalist-Plattform, grösste Schweizer Jobbörse" },
                { name: "jobup.ch", typ: "Stark in der Romandie und bei internationalen Firmen" },
                { name: "LinkedIn", typ: "International, gut für Führungspositionen und IT" },
                { name: "RAV (rav.ch)", typ: "Öffentliche Arbeitsvermittlung, auch für ALV-Beziehende" },
                { name: "Direktbewerbung", typ: "Unternehmenswebsites direkt – oft beste Qualität" },
                { name: "Netzwerk", typ: "Über 50% der Stellen werden nicht ausgeschrieben" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <p className="font-semibold text-[#111827] text-sm">{item.name}</p>
                  <p className="text-[#64748B] text-sm">{item.typ}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/bewerbung-schreiben", label: "Bewerbung schreiben" },
                { href: "/bewerbungsgespraech-tipps", label: "Bewerbungsgespräch Tipps" },
                { href: "/lebenslauf-vorlage-schweiz", label: "Lebenslauf Vorlage Schweiz" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[#204878] font-medium">
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Häufige Fragen zur Bewerbung in der Schweiz</h2>
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
              Wir kennen den Schweizer Arbeitsmarkt aus erster Hand – mit über 10 Jahren Recruiting-Erfahrung unterstützen wir Sie gezielt.
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
