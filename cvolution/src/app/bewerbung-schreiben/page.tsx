import Link from "next/link";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideSchema } from "@/components/seo/GuideSchema";
import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/bewerbung-schreiben", { type: "article" });

const faqData = [
  {
    question: "Was gehört in ein vollständiges Schweizer Bewerbungsdossier?",
    answer:
      "Ein vollständiges Schweizer Bewerbungsdossier enthält: Motivationsschreiben, Lebenslauf mit Foto, Arbeitszeugnisse der letzten Stellen, Ausbildungsdiplome und relevante Zertifikate. Bei offenen Stellen können zusätzlich Referenzadressen verlangt werden.",
  },
  {
    question: "Wie lange darf ich für das Schreiben einer Bewerbung brauchen?",
    answer:
      "Eine sorgfältige Bewerbung für eine spezifische Stelle sollte zwei bis vier Stunden in Anspruch nehmen. Dieser Aufwand lohnt sich: Eine massgeschneiderte Bewerbung hat deutlich höhere Erfolgschancen als eine schnell zusammengestellte.",
  },
  {
    question: "Soll ich mich für eine Stelle bewerben, wenn ich nicht alle Anforderungen erfülle?",
    answer:
      "Ja, wenn Sie mindestens 70–80 % der Anforderungen erfüllen. Stellenausschreibungen beschreiben oft das Wunschprofil – nicht das Minimalprofil. Zeigen Sie in der Bewerbung, wie Sie fehlende Bereiche kompensieren oder sich schnell einarbeiten können.",
  },
  {
    question: "Wie gehe ich vor, wenn keine Kontaktperson angegeben ist?",
    answer:
      "Recherchieren Sie: LinkedIn, die Website des Unternehmens oder ein Anruf in der Personalabteilung können helfen. Eine persönliche Anrede ist immer besser als 'Sehr geehrte Damen und Herren'. Notfalls nutzen Sie die Abteilungsbezeichnung: 'Sehr geehrtes HR-Team'.",
  },
  {
    question: "Wie wichtig ist der Zeitpunkt der Bewerbungseinreichung?",
    answer:
      "Bewerben Sie sich möglichst früh – am besten in den ersten Tagen nach der Ausschreibung. Viele Stellen werden bereits vergeben, bevor die Bewerbungsfrist abläuft, weil ein überzeugender Kandidat gefunden wurde. Warten Sie nicht bis zur letzten Minute.",
  },
  {
    question: "Wie gehe ich mit einer Absage um?",
    answer:
      "Nehmen Sie eine Absage professionell entgegen. Antworten Sie höflich und fragen Sie um Feedback, falls es nicht automatisch gegeben wird. Nutzen Sie das Feedback für die nächste Bewerbung. Manchmal kommt es vor, dass ein Unternehmen später erneut auf Sie zukommt.",
  },
];

export default function BewerbungSchreibenPage() {
  return (
    <>
      <GuideSchema path="/bewerbung-schreiben" faqs={faqData} />
      <main className="bg-[#F8FAFC] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">

          <div className="mb-10">
            <p className="text-sm font-medium text-[#204878] uppercase tracking-wide mb-2">Bewerbungsratgeber</p>
            <h1 className="text-4xl font-bold text-[#111827] leading-tight mb-4">
              Bewerbung schreiben in der Schweiz: Die vollständige Anleitung 2026
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Eine erfolgreiche Bewerbung in der Schweiz erfordert mehr als einen guten Lebenslauf. Erfahren Sie,
              wie Sie ein vollständiges, überzeugendes Bewerbungsdossier erstellen – von der Recherche bis zur
              Einreichung.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Der Schweizer Bewerbungsprozess verstehen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Der Schweizer Arbeitsmarkt hat seine eigenen Regeln und Erwartungen. Das Bewerbungsdossier ist in der
              Schweiz umfangreicher als in vielen anderen Ländern: Es umfasst nicht nur Lebenslauf und
              Motivationsschreiben, sondern auch Arbeitszeugnisse, Diplome und oft eine Auswahl an Referenzen.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Arbeitszeugnisse haben in der Schweiz einen besonders hohen Stellenwert. Sie sind die offizielle
              Bestätigung Ihrer Leistungen und werden von Arbeitgebern sehr genau gelesen. Achten Sie darauf, dass
              alle Ihre Zeugnisse dem «Wohlwollensprinzip» entsprechen und professionell formuliert sind.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Schritt für Schritt zur perfekten Bewerbung</h2>

            <div className="space-y-6">
              {[
                {
                  step: "Schritt 1: Gründliche Recherche",
                  content: "Bevor Sie zu schreiben beginnen, recherchieren Sie das Unternehmen umfassend. Website, LinkedIn, Pressemitteilungen, Jahresberichte – alles, was Ihnen ein vollständiges Bild gibt. Notieren Sie sich konkrete Punkte, auf die Sie in der Bewerbung eingehen möchten. Analysieren Sie auch die Stellenausschreibung genau: Welche Kompetenzen werden priorisiert? Welche Formulierungen werden verwendet?",
                },
                {
                  step: "Schritt 2: Lebenslauf anpassen",
                  content: "Ihr Lebenslauf sollte für jede Stelle leicht angepasst werden. Heben Sie die Erfahrungen und Kompetenzen hervor, die für diese spezifische Position am relevantesten sind. Passen Sie die Berufsbezeichnungen und Tätigkeitsbeschreibungen an die Sprache der Ausschreibung an – ohne dabei unehrlich zu sein.",
                },
                {
                  step: "Schritt 3: Motivationsschreiben verfassen",
                  content: "Das Motivationsschreiben ist Ihr persönlichstes Dokument im Dossier. Schreiben Sie es mit Fokus auf drei Fragen: Warum diese Stelle? Warum dieses Unternehmen? Warum Sie? Halten Sie es auf einer A4-Seite und beginnen Sie mit einem starken, individuellen Einstieg.",
                },
                {
                  step: "Schritt 4: Beilagen vorbereiten",
                  content: "Sammeln Sie alle relevanten Arbeitszeugnisse, Diplome und Zertifikate. Scannen Sie diese in guter Qualität. Ordnen Sie die Beilagen sinnvoll: Im Schweizer Standard steht das aktuellste Zeugnis zuoberst. Prüfen Sie, ob alle Dokumente lesbar und vollständig sind.",
                },
                {
                  step: "Schritt 5: Dossier zusammenstellen und prüfen",
                  content: "Fügen Sie alle Dokumente zu einem einzigen PDF-Dossier zusammen oder reichen Sie sie gemäss den Anweisungen des Unternehmens ein. Prüfen Sie das Dossier nochmals vollständig auf Fehler, fehlende Seiten und korrekten Dateinamen. Ein professioneller Dateiname: 'Bewerbung_Vorname_Nachname_Stellenbezeichnung.pdf'.",
                },
                {
                  step: "Schritt 6: Einreichen und nachfassen",
                  content: "Reichen Sie die Bewerbung fristgerecht ein. Falls Sie nach zwei Wochen keine Rückmeldung erhalten, können Sie kurz und professionell nachfragen – per E-Mail oder Telefon. Zeigen Sie weiterhin Interesse, ohne aufdringlich zu wirken.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-semibold text-[#204878] mb-2">{item.step}</h3>
                  <p className="text-[#374151] text-sm leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Besonderheiten des Schweizer Arbeitsmarkts</h2>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Arbeitszeugnisse</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              In der Schweiz hat jede Person das Recht auf ein Arbeitszeugnis. Dieses muss wohlwollend formuliert sein
              und darf keine versteckten negativen Aussagen enthalten. Dennoch gibt es eine ganze Codierungssprache:
              «Er erledigte die ihm übertragenen Aufgaben zu unserer Zufriedenheit» ist in der Schweizer
              Zeugnissprache eine unterdurchschnittliche Bewertung.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Referenzen</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Viele Schweizer Unternehmen holen vor der Einstellung Referenzen ein. Bereiten Sie zwei bis drei
              Referenzpersonen vor, die über Ihre Arbeit positiv sprechen können. Informieren Sie diese Personen
              im Voraus, damit sie nicht überrascht werden.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Mehrsprachigkeit</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              In der Deutschschweiz werden Bewerbungen in Deutsch erwartet. In der Romandie auf Französisch, im
              Tessin auf Italienisch. Bei internationalen Unternehmen kann auch eine englische Bewerbung verlangt
              werden. Reichen Sie Ihre Bewerbung immer in der Sprache der Stellenausschreibung ein.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/bewerbung-schweiz", label: "Bewerbung in der Schweiz" },
                { href: "/motivationsschreiben-tipps", label: "Motivationsschreiben Tipps" },
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

          <GuideCta path="/bewerbung-schreiben" />
        </div>
      </main>
    </>
  );
}
