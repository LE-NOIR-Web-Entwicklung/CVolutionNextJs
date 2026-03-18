import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lebenslauf Vorlage Schweiz 2026 | Kostenlose Muster & Tipps",
  description:
    "Professionelle Lebenslauf-Vorlagen für den Schweizer Arbeitsmarkt. Erfahren Sie, worauf Schweizer Arbeitgeber achten, und laden Sie kostenlose Muster herunter.",
  alternates: { canonical: "https://cvolution.ch/lebenslauf-vorlage-schweiz" },
};

const faqData = [
  {
    question: "Welches Format ist für einen Schweizer Lebenslauf am besten geeignet?",
    answer:
      "Im Schweizer Arbeitsmarkt hat sich das chronologisch-umgekehrte Format durchgesetzt: Die aktuellste Stelle steht zuoberst. Das Dokument sollte maximal zwei A4-Seiten umfassen und als PDF eingereicht werden.",
  },
  {
    question: "Gehört ein Foto in den Schweizer Lebenslauf?",
    answer:
      "Ja, in der Schweiz ist ein professionelles Bewerbungsfoto üblich und wird von den meisten Arbeitgebern erwartet. Das Foto sollte aktuell, freundlich und in einem professionellen Umfeld aufgenommen sein.",
  },
  {
    question: "Wie lang sollte ein Schweizer Lebenslauf sein?",
    answer:
      "In der Schweiz gilt: ein bis zwei Seiten sind ideal. Berufseinsteiger mit wenig Erfahrung können mit einer Seite auskommen, während erfahrene Fachkräfte zwei Seiten nutzen dürfen – aber nicht müssen.",
  },
  {
    question: "Muss ich im Lebenslauf Schweizer Franken als Lohnerwartung angeben?",
    answer:
      "Lohnangaben im Lebenslauf sind in der Schweiz nicht üblich. Diese Angaben werden – wenn überhaupt – im Motivationsschreiben oder auf explizite Anfrage des Arbeitgebers gemacht.",
  },
  {
    question: "Welche Sprachen sollte ich im Lebenslauf angeben?",
    answer:
      "Geben Sie alle relevanten Sprachen mit einem standardisierten Niveau an (z. B. Europäischer Referenzrahmen: A1 bis C2 oder Begriffe wie Muttersprache, verhandlungssicher, fliessend, Grundkenntnisse). In der mehrsprachigen Schweiz sind Kenntnisse in Deutsch, Französisch, Italienisch und Englisch besonders wertvoll.",
  },
  {
    question: "Wie gehe ich mit Lücken im Lebenslauf um?",
    answer:
      "Erklären Sie Lücken kurz und sachlich, zum Beispiel mit Weiterbildung, Familienzeit, Sprachaufenthalt oder Jobsuche. Unkommentierte Lücken wirken schnell verdächtig und können Ihr Dossier benachteiligen.",
  },
];

export default function LebenslaufVorlagePage() {
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
              Lebenslauf Vorlage Schweiz: Professionelle Muster für den Schweizer Arbeitsmarkt
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Ein überzeugender Lebenslauf ist Ihre Visitenkarte auf dem Schweizer Stellenmarkt. Erfahren Sie, welche
              Vorlagen Schweizer HR-Verantwortliche bevorzugen, was zwingend enthalten sein muss – und was Sie besser
              weglassen.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Was macht eine gute Lebenslauf-Vorlage aus?</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Eine professionelle Vorlage ist mehr als ein schön formatiertes Dokument. Sie strukturiert Ihre
              berufliche Laufbahn so, dass eine Personalverantwortliche Person innerhalb von 30 Sekunden die
              wichtigsten Informationen erfassen kann. Im Schweizer Arbeitsmarkt gelten klare Konventionen, die Sie
              kennen sollten.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Anders als in den USA oder Grossbritannien ist in der Schweiz das persönliche Erscheinungsbild im
              Bewerbungsdossier erwünscht: Ein aktuelles Foto und vollständige Personalien gehören dazu. Gleichzeitig
              legen Schweizer Unternehmen grossen Wert auf Vollständigkeit, Genauigkeit und eine fehlerfreie
              Orthographie.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Aufbau einer Schweizer Lebenslauf-Vorlage</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Persönliche Angaben (Name, Adresse, Telefon, E-Mail, Geburtsdatum, Nationalität)",
                "Professionelles Bewerbungsfoto (rechtsbündig oben)",
                "Berufserfahrung (antichronologisch – aktuellste Stelle zuerst)",
                "Ausbildung und Weiterbildungen",
                "Sprachkenntnisse mit Niveauangabe",
                "IT- und Fachkenntnisse",
                "Hobbys und persönliche Interessen (optional, aber oft positiv bewertet)",
                "Referenzen auf Anfrage oder direkte Nennung",
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

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Welche Vorlage eignet sich für welches Profil?</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Nicht jede Vorlage passt zu jedem Bewerberprofil. Die Wahl der richtigen Vorlage hängt von Ihrer
              Berufserfahrung, der Branche und der angestrebten Position ab.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Chronologische Vorlage – für die meisten Kandidierenden</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Die chronologisch-umgekehrte Vorlage ist der Standard im Schweizer Arbeitsmarkt. Sie zeigt Ihre
              Karriereentwicklung linear und ist für Personalverantwortliche am einfachsten zu lesen. Diese Vorlage
              eignet sich, wenn Sie eine klare, aufsteigende Karriere vorweisen können.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Praktische Tipps für Ihre Lebenslauf-Vorlage</h2>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Gestaltung und Formatierung</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Wählen Sie eine serifenlose Schriftart wie Arial, Calibri oder Helvetica in Grösse 10–12 Punkt. Der
              Zeilenabstand sollte 1,15 bis 1,5 betragen. Nutzen Sie Weissraum bewusst – ein übersichtliches Layout
              wirkt professioneller als ein dichtes. Randabstände von mindestens 1,5 cm auf allen Seiten sind
              empfehlenswert.
            </p>

            <h3 className="text-xl font-semibold text-[#111827] mb-3">Sprache und Ton</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Verwenden Sie aktive, prägnante Formulierungen. Statt «war verantwortlich für» schreiben Sie besser
              «verantwortete» oder «leitete». Verwenden Sie konkrete Zahlen und Erfolge, wo immer möglich: «Umsatz um
              18 % gesteigert» überzeugt mehr als «Umsatz gesteigert».
            </p>
          </section>

          {/* Section 4 – Example */}
          <section className="mb-10 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Beispiel: Berufserfahrung korrekt formulieren</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              So sieht ein gut strukturierter Berufserfahrungs-Eintrag aus:
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-100">
              <p className="font-semibold text-[#111827]">Projektleiter Marketing | Muster AG, Zürich</p>
              <p className="text-sm text-[#64748B] mb-3">März 2020 – heute</p>
              <ul className="space-y-1 text-[#374151] text-sm">
                <li>• Leitung eines 5-köpfigen Teams für digitale Marketingkampagnen</li>
                <li>• Steigerung der organischen Reichweite um 40 % innerhalb von 12 Monaten</li>
                <li>• Verwaltung eines Jahresbudgets von CHF 200'000</li>
                <li>• Einführung eines neuen CRM-Systems (Salesforce) für 80 Mitarbeitende</li>
              </ul>
            </div>
          </section>

          {/* Internal links */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/lebenslauf-aufbau", label: "Lebenslauf Aufbau" },
                { href: "/lebenslauf-fehler", label: "Häufige Lebenslauf-Fehler" },
                { href: "/bewerbung-schweiz", label: "Bewerbung in der Schweiz" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[#204878] font-medium"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Häufige Fragen zur Lebenslauf-Vorlage</h2>
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
              Unsere Experten mit über 10 Jahren Recruiting-Erfahrung erstellen für Sie einen Lebenslauf, der überzeugt –
              zugeschnitten auf den Schweizer Arbeitsmarkt.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/service-cv"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200"
              >
                Lebenslauf erstellen lassen
              </Link>
              <Link
                href="/service"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors duration-200"
              >
                Komplette Bewerbung
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
