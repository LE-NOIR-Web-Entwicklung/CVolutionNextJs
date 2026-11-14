import Link from "next/link";
import { KlassischSnippet, type CvStation } from "@/components/content/CvTemplatePreview";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideSchema } from "@/components/seo/GuideSchema";
import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/lebenslauf-quereinsteiger", { type: "article" });

const faqData = [
  {
    question: "Muss ich im Lebenslauf erklären, warum ich die Branche wechsle?",
    answer:
      "Nein – das ist Aufgabe des Motivationsschreibens. Im Lebenslauf zeigen Sie mit Ihren Stationen, Tätigkeiten und Weiterbildungen, was Sie für die neue Branche mitbringen. Den Wechsel selbst begründen Sie im Motivationsschreiben.",
  },
  {
    question: "Wie kann ich fehlende Branchenerfahrung kompensieren?",
    answer:
      "Durch Weiterbildungen, Zertifikate, Praktika oder Freelance-Projekte in der neuen Branche. Auch ehrenamtliches Engagement oder Nebenprojekte können Motivation und Kompetenz belegen. Zeigen Sie, dass Sie aktiv den Übergang gestalten.",
  },
  {
    question: "Welches Lebenslauf-Format eignet sich für Quereinsteiger?",
    answer:
      "Derselbe Aufbau wie für alle: Persönliche Angaben, Berufliche Erfahrung, Aus- & Weiterbildungen, Kenntnisse & Fähigkeiten – so sind alle CVolution-Vorlagen gegliedert. Ihre übertragbaren Fähigkeiten zeigen Sie in den Tätigkeiten jeder Station, neue Zertifikate stehen zuoberst bei den Aus- & Weiterbildungen.",
  },
  {
    question: "Wie erkläre ich Lücken im Lebenslauf beim Quereinstieg?",
    answer:
      "Kurze Lücken von 1–3 Monaten müssen nicht erklärt werden. Längere Phasen benennen Sie kurz: «Berufliche Neuorientierung und Weiterbildung» mit Datum. Zeigen Sie, was Sie in dieser Zeit konkret getan haben (Kurse, Recherche, Projekte).",
  },
  {
    question: "Lohnt es sich, den Lebenslauf für jede Stelle anzupassen?",
    answer:
      "Ja, besonders als Quereinsteiger. Betonen Sie jeweils die Kompetenzen, die für die Zielstelle am relevantesten sind. Schon die Reihenfolge der Tätigkeiten bei jeder Station kann entscheidend sein: Was für die Zielstelle zählt, steht zuoberst.",
  },
];

const changerExperience: CvStation = {
  dates: "03.2017 – heute",
  role: "Projektleiterin Logistik",
  org: "Muster Logistik AG, Basel",
  tasks: [
    "Rekrutierung und Einarbeitung von 15 neuen Mitarbeitenden pro Jahr",
    "Führung eines Teams von 6 Personen inkl. Mitarbeitergespräche",
    "Konzeption und Durchführung interner Schulungen zu neuen Prozessen",
    "Leitung von Optimierungsprojekten mit bis zu 20 Beteiligten",
  ],
};

const changerEducation: CvStation[] = [
  { dates: "09.2023 – 06.2024", role: "CAS HR-Management", org: "Fachhochschule Nordwestschweiz" },
  { dates: "08.2009 – 07.2012", role: "Kauffrau EFZ", org: "Muster Spedition AG, Basel" },
];

export default function LebenslaufQuereinsteiger() {
  return (
    <>
      <GuideSchema path="/lebenslauf-quereinsteiger" faqs={faqData} />
      <main className="bg-[#F8FAFC] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* Hero */}
          <div className="mb-10">
            <p className="text-sm font-medium text-[#204878] uppercase tracking-wide mb-2">Bewerbungsratgeber</p>
            <h1 className="text-4xl font-bold text-[#111827] leading-tight mb-4">
              Lebenslauf als Quereinsteiger – So überzeugen Sie trotz Branchenwechsel
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Ein beruflicher Quereinstieg ist in der Schweiz häufiger geworden – und er muss kein Nachteil sein. Mit der
              richtigen Darstellung Ihres Lebenslaufs können Sie Ihre bisherigen Kompetenzen als Stärke positionieren und
              Arbeitgeber von Ihrer Eignung überzeugen. Entscheidend ist, wie Sie Ihre Geschichte erzählen.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Was Schweizer Arbeitgeber beim Quereinstieg erwarten</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Arbeitgeber sind skeptisch gegenüber Quereinstieg – aber nicht ablehnend. Sie stellen sich vor allem
              folgende Fragen:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Warum will diese Person in unsere Branche wechseln?",
                "Hat sie sich ernsthaft mit unserem Bereich auseinandergesetzt?",
                "Welche ihrer bisherigen Fähigkeiten sind für uns nützlich?",
                "Wie schnell wird sie einsatzfähig sein?",
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
              Ihr Lebenslauf muss diese Fragen antizipieren und beantworten – bevor sie gestellt werden.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Übertragbare Kompetenzen identifizieren und betonen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Der erste Schritt ist eine ehrliche Bestandsaufnahme: Welche Ihrer Fähigkeiten sind in der neuen Branche
              wertvoll? Übertragbare Kompetenzen sind oft wertvoller als gedacht.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Beispiele übertragbarer Kompetenzen</h3>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Projektmanagement:</strong> strukturiertes Vorgehen, Terminplanung, Ressourcensteuerung – branchenunabhängig gefragt</>,
                <><strong>Kundenorientierung:</strong> Erfahrung im Umgang mit Kunden, Beschwerdemanagement, Beziehungsaufbau</>,
                <><strong>Analytische Fähigkeiten:</strong> Datenauswertung, Entscheidungsfindung auf Basis von Zahlen</>,
                <><strong>Kommunikation:</strong> Präsentieren, Verhandeln, schriftliche Kommunikation</>,
                <><strong>Führungserfahrung:</strong> Teamleitung, Mitarbeitermotivation, Konfliktlösung</>,
                <><strong>Technische Kenntnisse:</strong> IT, spezifische Software oder Methoden, die auch in der Zielbranche gefragt sind</>,
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

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Aufbau des Lebenslaufs für Quereinsteiger</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Auch beim Branchenwechsel bleibt der Aufbau gleich – genau so, wie er in unseren Lebenslauf-Vorlagen
              angelegt ist. Arbeitgeber finden sich sofort zurecht, und Ihre übertragbaren Kompetenzen stehen dort, wo
              sie gelesen werden: bei den Tätigkeiten jeder Station.
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-[#111827] mb-3">Struktur wie in den Vorlagen</h3>
              <ul className="space-y-2">
                {[
                  "Persönliche Angaben mit Foto: Name, Adresse, Tel., E-Mail, Geburtsdatum, Zivilstand, Heimatort",
                  "Berufliche Erfahrung (antichronologisch) – Tätigkeiten mit Bezug zur Zielbranche zuoberst",
                  "Aus- & Weiterbildungen (antichronologisch) – neue Zertifikate für die Zielbranche zuoberst",
                  "Kenntnisse & Fähigkeiten: Fremdsprachen, Führerschein, Programme",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#374151]">
                    <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterbildungen strategisch einsetzen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Investitionen in die neue Branche signalisieren Ernsthaftigkeit. Folgende Weiterbildungen erhöhen Ihre
              Chancen als Quereinsteiger erheblich:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Zertifikatslehrgänge:</strong> z. B. CAS Digital Marketing, CAS Projektmanagement, CAS HR</>,
                <><strong>Online-Zertifikate:</strong> Coursera, LinkedIn Learning, Google-Zertifikate – gut, aber ergänzend</>,
                <><strong>Praktika oder Hospitationen:</strong> Selbst kurze Einblicke in die neue Branche sind wertvolle Belege</>,
                <><strong>Freelance-Projekte:</strong> Falls Sie bereits in der neuen Branche tätig waren</>,
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

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Beispiel: Von der Logistik ins HR</h2>
            <p className="text-[#374151] leading-relaxed mb-5">
              Eine Projektleiterin aus der Logistik bewirbt sich im HR. Statt eines zusätzlichen Abschnitts stellt sie
              die Tätigkeiten mit HR-Bezug an den Anfang und führt den neuen CAS zuoberst bei den Weiterbildungen auf –
              im Design «Klassisch» unserer Vorlagen:
            </p>
            <div className="space-y-4">
              <KlassischSnippet title="Berufliche Erfahrung" stations={[changerExperience]} />
              <KlassischSnippet title="Ausbildungen / Weiterbildungen" stations={changerEducation} />
            </div>
          </section>

          {/* Internal links - card grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/lebenslauf-aufbau", label: "Lebenslauf Aufbau – Schritt für Schritt erklärt" },
                { href: "/bewerbung-schreiben", label: "Bewerbung schreiben – Anleitung für die Schweiz" },
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

          <GuideCta path="/lebenslauf-quereinsteiger" />

        </div>
      </main>
    </>
  );
}
