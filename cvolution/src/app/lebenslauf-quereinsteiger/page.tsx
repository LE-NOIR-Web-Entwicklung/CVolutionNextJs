import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lebenslauf Quereinsteiger Schweiz 2025 | Tipps & Vorlage",
  description:
    "Lebenslauf als Quereinsteiger in der Schweiz: Wie Sie Ihren beruflichen Wechsel positiv darstellen, übertragbare Kompetenzen hervorheben und Arbeitgeber überzeugen.",
  alternates: { canonical: "https://cvolution.ch/lebenslauf-quereinsteiger" },
};

const faqData = [
  {
    question: "Muss ich im Lebenslauf erklären, warum ich die Branche wechsle?",
    answer:
      "Nein – das ist Aufgabe des Motivationsschreibens. Im Lebenslauf listen Sie Ihre Stationen und Kompetenzen auf. Fügen Sie allenfalls ein kurzes Profil (3–4 Sätze) ganz oben ein, das Ihren Quereinstieg positiv rahmt.",
  },
  {
    question: "Wie kann ich fehlende Branchenerfahrung kompensieren?",
    answer:
      "Durch Weiterbildungen, Zertifikate, Praktika oder Freelance-Projekte in der neuen Branche. Auch ehrenamtliches Engagement oder Nebenprojekte können Motivation und Kompetenz belegen. Zeigen Sie, dass Sie aktiv den Übergang gestalten.",
  },
  {
    question: "Welches Lebenslauf-Format eignet sich für Quereinsteiger?",
    answer:
      "Ein funktionales oder kombiniertes Format kann sinnvoll sein: Zuerst Kompetenzen nach Themen gruppieren, dann erst die chronologische Berufserfahrung. So treten Ihre übertragbaren Fähigkeiten in den Vordergrund, bevor die Branchenferne auffällt.",
  },
  {
    question: "Wie erkläre ich Lücken im Lebenslauf beim Quereinstieg?",
    answer:
      "Kurze Lücken von 1–3 Monaten müssen nicht erklärt werden. Längere Phasen benennen Sie kurz: «Berufliche Neuorientierung und Weiterbildung» mit Datum. Zeigen Sie, was Sie in dieser Zeit konkret getan haben (Kurse, Recherche, Projekte).",
  },
  {
    question: "Lohnt es sich, den Lebenslauf für jede Stelle anzupassen?",
    answer:
      "Ja, besonders als Quereinsteiger. Betonen Sie jeweils die Kompetenzen, die für die Zielstelle am relevantesten sind. Die Reihenfolge der Stichworte in Ihrer Kompetenzliste kann bereits entscheidend sein.",
  },
];

export default function LebenslaufQuereinsteiger() {
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

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Lebenslauf-Format für Quereinsteiger wählen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Das klassische chronologische Format stellt die Branchenferne sofort in den Vordergrund. Für Quereinsteiger
              eignen sich zwei alternative Ansätze:
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Kombiniertes Format (empfohlen)</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Beginn mit einem Kompetenzprofil, das Ihre Stärken thematisch gruppiert – gefolgt von der chronologischen
              Berufserfahrung. So sieht der Arbeitgeber zuerst, was Sie können, bevor er sieht, woher Sie kommen.
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
              <h4 className="font-semibold text-[#111827] mb-3">Struktur: Kombiniertes Format</h4>
              <ul className="space-y-2">
                {[
                  "Persönliche Angaben + Foto",
                  "Profil / Zusammenfassung (3–4 Sätze, inkl. Wechselwunsch positiv formuliert)",
                  "Kernkompetenzen (thematisch: Projektmanagement | Kommunikation | IT)",
                  "Weiterbildungen und Zertifikate (Neues zuerst)",
                  "Berufserfahrung (chronologisch, umgekehrt)",
                  "Ausbildung",
                  "Sprachen und weitere Kenntnisse",
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

          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Profil-Abschnitt als Einstieg nutzen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Ein kurzes Profil am Anfang des Lebenslaufs ist für Quereinsteiger besonders wertvoll. Es gibt Ihnen die
              Möglichkeit, den Kontext zu setzen:
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-[#111827] mb-2">Beispiel Profil-Abschnitt</h3>
              <p className="text-[#374151] italic">
                «Erfahrene Projektleiterin mit 8 Jahren Erfahrung in der Logistikbranche, aktuell im gezielten
                Übergang in den Bereich HR. Abgeschlossener CAS HR-Management (FHNW, 2024). Ich bringe ausgeprägte
                Kommunikations- und Organisationskompetenz mit und möchte diese künftig in der Personalentwicklung
                einsetzen.»
              </p>
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
