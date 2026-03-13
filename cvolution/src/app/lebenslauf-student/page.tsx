import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lebenslauf Student Schweiz 2025 | Vorlage & Tipps ohne viel Erfahrung",
  description:
    "Lebenslauf als Student oder Absolventin in der Schweiz schreiben: Was Sie trotz wenig Berufserfahrung überzeugend darstellen können – mit Vorlage und Beispielen.",
  alternates: { canonical: "https://cvolution.ch/lebenslauf-student" },
};

const faqData = [
  {
    question: "Was schreibe ich in den Lebenslauf, wenn ich kaum Berufserfahrung habe?",
    answer:
      "Nutzen Sie alle relevanten Erfahrungen: Praktika, Studentenjobs, Freiwilligenarbeit, Vereinsengagement, Auslandssemester und bedeutende Hochschulprojekte. Beschreiben Sie nicht nur was, sondern was Sie dabei gelernt haben und welchen Beitrag Sie geleistet haben.",
  },
  {
    question: "Wie lang sollte ein Studenten-Lebenslauf sein?",
    answer:
      "Eine Seite ist ideal, wenn Sie weniger als drei Jahre Berufserfahrung haben. Zwei Seiten sind akzeptabel, wenn Sie mehrere relevante Praktika, Hochschulprojekte oder Engagement nachweisen können. Niemals künstlich verlängern.",
  },
  {
    question: "Soll ich meine Noten im Lebenslauf angeben?",
    answer:
      "Wenn Ihr Notendurchschnitt gut ist (5,0 und besser in der Schweizer Notenskala, bzw. cum laude oder besser), geben Sie ihn an. Liegt der Schnitt darunter, können Sie ihn weglassen. Für Berufseinsteiger ist der Abschluss selbst wichtiger als der genaue Durchschnitt.",
  },
  {
    question: "Welche Skills sind als Student besonders gefragt?",
    answer:
      "IT-Kenntnisse (Office, branchenspezifische Software, Programmiersprachen), Sprachkenntnisse auf konkret beschriebenem Niveau (A1–C2), analytisches Denken und Teamarbeit. Belegen Sie Soft Skills mit konkreten Beispielen statt leere Schlagwörter zu verwenden.",
  },
  {
    question: "Soll ich ein Foto in den Lebenslauf einfügen?",
    answer:
      "In der Schweiz ist ein professionelles Bewerbungsfoto Standard und wird erwartet. Verwenden Sie ein aktuelles, freundliches Porträtfoto mit neutralem Hintergrund – kein Urlaubsfoto oder Selfie.",
  },
];

export default function LebenslaufStudent() {
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
              Lebenslauf als Student – Überzeugend auch ohne viel Berufserfahrung
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Als Student oder Absolventin stehen Sie vor einer besonderen Herausforderung: Ihr Lebenslauf soll
              überzeugend wirken, auch wenn die Berufserfahrung noch begrenzt ist. Die gute Nachricht: Schweizer
              Arbeitgeber wissen das – und achten bei Berufseinsteigern auf andere Qualitäten. Dieser Leitfaden zeigt,
              wie Sie Ihr Profil optimal darstellen.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Aufbau des Studenten-Lebenslaufs</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Für Berufseinsteiger empfiehlt sich ein leicht angepasster Aufbau gegenüber dem klassischen Lebenslauf:
              Die Ausbildung steht vor der Berufserfahrung, da sie das Fundament Ihres Profils ist.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Empfohlene Reihenfolge</h3>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Persönliche Angaben:</strong> Name, Adresse, Telefon, E-Mail, LinkedIn-Profil (optional)</>,
                <><strong>Kurzprofil / Zusammenfassung (optional):</strong> 2–3 Sätze, die Ihre Stärken und Karriereziele benennen</>,
                <><strong>Ausbildung:</strong> Studium, Matura/Berufsmatura, relevante Zertifikate</>,
                <><strong>Berufserfahrung:</strong> Praktika, Studentenjobs, Werkstudentenstellen</>,
                <><strong>Projekte und Engagement:</strong> Hochschulprojekte, Verein, Freiwilligenarbeit</>,
                <><strong>Kenntnisse:</strong> Sprachen, IT, Soft Skills (mit Belegen)</>,
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Ausbildung überzeugend darstellen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Die Ausbildung ist Ihr wichtigstes Kapitel. Gehen Sie über reine Fakten hinaus:
            </p>
            <div className="space-y-4">
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-[#111827] mb-2">Beispiel – schwach</h3>
                <p className="text-[#64748B] italic">
                  BSc Betriebswirtschaft, Universität Zürich, 2020–2024
                </p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-[#111827] mb-2">Beispiel – stark</h3>
                <p className="text-[#374151] italic">
                  BSc Betriebswirtschaft, Universität Zürich, 2020–2024
                  <br />
                  Schwerpunkte: Marketing, Strategisches Management | Durchschnitt: 5,2
                  <br />
                  Bachelorarbeit: «Nachhaltigkeitskommunikation in Schweizer KMU» (Note 5,5)
                </p>
              </div>
            </div>
            <ul className="space-y-2 mt-4">
              {[
                "Benennen Sie Studienschwerpunkte, die zur Stelle passen",
                "Erwähnen Sie Ihre Abschlussarbeit, wenn sie relevant ist",
                "Geben Sie den Notendurchschnitt an, wenn er überzeugend ist (5,0+)",
                "Nennen Sie besondere Auszeichnungen oder Stipendien",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Praktika und Studentenjobs richtig beschreiben</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Praktika sind für Berufseinsteiger Gold wert. Beschreiben Sie nicht nur die Tätigkeit, sondern Ihre
              konkreten Beiträge und Lernerfolge.
            </p>
            <div className="space-y-4">
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-[#111827] mb-2">Beispiel – schwach</h3>
                <p className="text-[#64748B] italic">
                  Marketing Praktikum, Firma XY, Sommer 2023
                  <br />
                  – Social Media, Texte schreiben, Marktanalysen
                </p>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-[#111827] mb-2">Beispiel – stark</h3>
                <p className="text-[#374151] italic">
                  Marketing Praktikant, Firma XY AG, Zürich | Jun–Aug 2023
                  <br />
                  – Eigenverantwortliche Betreuung des Instagram-Kanals (Reichweite +23 %)
                  <br />
                  – Erstellung von Wettbewerbsanalysen für 3 Produktlaunches
                  <br />
                  – Mitarbeit bei der Konzeption einer E-Mail-Kampagne (Öffnungsrate: 38 %)
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Engagement und Projekte als Ersatz für Berufserfahrung</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Wer noch wenig Berufserfahrung hat, kann mit anderen Aktivitäten punkten:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Hochschulprojekte:</strong> Gruppenarbeiten, Seminararbeiten oder Case Studies, die reale Probleme gelöst haben</>,
                <><strong>Engagement in Hochschulvereinen:</strong> Vorstandsarbeit, Eventorganisation, Mitgliedschaft in Fachgruppen</>,
                <><strong>Freiwilligenarbeit:</strong> Soziales Engagement, Sporttrainer, Pfadfinder</>,
                <><strong>Nebenprojekte:</strong> App-Entwicklung, Blog, YouTube-Kanal – wenn relevant</>,
                <><strong>Auslandssemester:</strong> Zeigt Initiative, Anpassungsfähigkeit und Sprachkenntnisse</>,
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Sprachkenntnisse und IT-Skills</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Für viele Stellen in der Schweiz sind Mehrsprachigkeit und IT-Kenntnisse entscheidend. Seien Sie konkret:
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Sprachen</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Verwenden Sie das GER-Niveau (A1–C2) oder native / muttersprachlich",
                "Differenzieren Sie Schrift und Mündlich, wenn nötig",
                "Beispiel: Englisch C1 (Cambridge Certificate), Französisch B2",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">IT-Kenntnisse</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Microsoft Office: konkrete Programme statt nur «MS Office» (Excel: Pivot, SVERWEIS)",
                "Programmiersprachen mit Niveau (Python: Grundkenntnisse / fortgeschritten)",
                "Branchenspezifische Tools (Adobe, Salesforce, SAP, SPSS etc.)",
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

          {/* Internal links - card grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/lebenslauf-vorlage-schweiz", label: "Lebenslauf Vorlage Schweiz – Kostenlose Muster" },
                { href: "/", label: "Motivationsschreiben Praktikum – Mit Vorlage und Beispiel" },
                { href: "/lebenslauf-aufbau", label: "Lebenslauf Aufbau – Schritt für Schritt erklärt" },
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
