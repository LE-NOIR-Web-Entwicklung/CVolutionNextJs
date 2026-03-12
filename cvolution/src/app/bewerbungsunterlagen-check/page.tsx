import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bewerbungsunterlagen Check Schweiz 2025 | Checkliste vor dem Absenden",
  description:
    "Bewerbungsunterlagen Check für die Schweiz: Vollständige Checkliste für Lebenslauf, Motivationsschreiben und Beilagen – damit nichts Wichtiges fehlt und Sie einen professionellen Eindruck hinterlassen.",
  alternates: { canonical: "https://cvolution.ch/bewerbungsunterlagen-check" },
};

const faqData = [
  {
    question: "Was sind die häufigsten Fehler in Bewerbungsunterlagen?",
    answer:
      "Tippfehler und Grammatikfehler, fehlende oder veraltete Kontaktdaten, kein individuell angepasstes Motivationsschreiben, Lebenslauf ohne Foto, fehlende Arbeitszeugnisse, falsche Dateiformate und zu grosse Anhänge.",
  },
  {
    question: "Wie viele Personen sollten meine Unterlagen vor dem Absenden lesen?",
    answer:
      "Mindestens eine Person – am besten jemand aus Ihrem Berufsumfeld, der ehrliches Feedback geben kann. Eine zweite Person mit anderen Augen findet oft Fehler, die Sie selbst nicht mehr sehen.",
  },
  {
    question: "Wie benenne ich meine Bewerbungs-PDF-Datei richtig?",
    answer:
      "Verwenden Sie ein klares Schema: «Bewerbung_Vorname-Nachname_Funktionsbezeichnung.pdf». Beispiel: «Bewerbung_Anna-Meier_Marketing-Manager.pdf». Vermeiden Sie generische Namen wie «Bewerbung.pdf» oder «CV_neu_final2.pdf».",
  },
  {
    question: "Soll ich alle Beilagen in einem PDF zusammenfassen?",
    answer:
      "Ja, für E-Mail-Bewerbungen empfiehlt sich ein einzelnes PDF-Dokument. Reihenfolge: Motivationsschreiben, Lebenslauf, Arbeitszeugnisse (aktuellstes zuerst), Diplome und Zertifikate.",
  },
  {
    question: "Wie überprüfe ich, ob mein Lebenslauf ATS-kompatibel ist?",
    answer:
      "Öffnen Sie Ihr PDF und versuchen Sie, Text zu kopieren. Wenn das funktioniert, ist das Dokument textbasiert und ATS-lesbar. Kein Text = gescanntes Bild = nicht lesbar. Vermeiden Sie Tabellen, komplexe Layouts und Icons für Skills.",
  },
];

export default function BewerbungsunterlagenCheck() {
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] leading-tight mb-4">
              Bewerbungsunterlagen Check – Die vollständige Checkliste vor dem Absenden
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Bevor Sie Ihre Bewerbung absenden, lohnt sich ein letzter, systematischer Check. Tippfehler im
              Motivationsschreiben, ein veraltetes Datum oder ein fehlendes Zeugnis können den besten Eindruck zunichte
              machen. Diese Checkliste hilft Ihnen, alle häufigen Fehler zu vermeiden.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Checkliste Motivationsschreiben</h2>
            <ul className="space-y-2 mb-4">
              {[
                "Ansprechperson korrekt adressiert (Name und Funktion geprüft)",
                "Aktuelles Datum eingetragen",
                "Betreffzeile vollständig: Stelle + Referenznummer (falls vorhanden)",
                "Einstieg ist individuell und bezieht sich auf das Unternehmen",
                "Keine Wiederholung des Lebenslaufs – ergänzende Inhalte",
                "Kein generisches «Hiermit bewerbe ich mich...»",
                "Verfügbarkeit und Pensum erwähnt",
                "Unterschrift vorhanden (eingescannt oder digital)",
                "Rechtschreibung und Grammatik geprüft (Spellcheck + manuelle Lektüre)",
                "Korrektes Schweizer Deutsch (kein ss statt ß, aber «ss» bei Schweizer Schreibung beachten)",
                "Länge: maximal 1 Seite",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Checkliste Lebenslauf</h2>
            <ul className="space-y-2 mb-4">
              {[
                "Professionelles Foto vorhanden (aktuell, neutraler Hintergrund)",
                "Alle Kontaktdaten korrekt und aktuell (Telefon, E-Mail, Adresse)",
                "E-Mail-Adresse ist professionell (keine Spitznamen oder Zahlenfolgen)",
                "Berufserfahrung: antichronologisch, mit Daten, Unternehmen und Ort",
                "Aufgaben mit Aktivverben und konkreten Ergebnissen beschrieben",
                "Keine unerklärten Lücken von mehr als 3 Monaten",
                "Ausbildung vollständig mit Abschluss, Institution und Jahr",
                "Sprachen mit Niveau (A1–C2) angegeben",
                "IT-Kenntnisse spezifisch – keine leeren Schlagwörter",
                "Länge: 1 Seite (Berufseinsteiger) oder 2 Seiten (Fachkraft)",
                "Als PDF gespeichert (nicht Word)",
                "Dateiname professionell benannt",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Checkliste Beilagen</h2>
            <ul className="space-y-2 mb-4">
              {[
                "Arbeitszeugnisse aller relevanten Stellen vorhanden",
                "Aktuellstes Zeugnis zuerst, dann chronologisch rückwärts",
                "Zeugnis als lesbarer Scan (mindestens 150 dpi, nicht verwackelt)",
                "Hochschuldiplom / Berufsabschluss vorhanden",
                "Relevante Weiterbildungszertifikate beigefügt",
                "Alle Dokumente in einem einzigen PDF zusammengefasst",
                "Gesamtgrösse unter 8 MB",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Checkliste E-Mail-Bewerbung</h2>
            <ul className="space-y-2 mb-4">
              {[
                "Korrekte E-Mail-Adresse des Empfängers eingetragen",
                "Betreffzeile der E-Mail: «Bewerbung als [Funktion] – [Name]»",
                "Kurzer, professioneller Text im E-Mail-Body (kein zweites Motivationsschreiben)",
                "PDF-Anhang korrekt benannt und angehängt (vor dem Senden geprüft)",
                "Test-E-Mail an sich selbst gesendet und Anhang geöffnet",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Die häufigsten Fehler – und wie Sie sie vermeiden</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm mb-6">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left text-[#374151]">Fehler</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-[#374151]">Wie vermeiden</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Tippfehler im Firmennamen", "Firmenname von der offiziellen Website kopieren"],
                    ["Falsches Datum im Motivationsschreiben", "Unmittelbar vor dem Senden Datum prüfen"],
                    ["Generisches Motivationsschreiben", "Mindestens Einstieg und Firmenbezug individualisieren"],
                    ["Kein Foto im Lebenslauf", "Schweizer Standard: Foto ist erwartet"],
                    ["Arbeitszeugnisse fehlen", "Vollständigkeitsliste vor Zusammenstellung prüfen"],
                    ["Word-Datei statt PDF", "Immer als PDF exportieren"],
                    ["Falscher Ansprechpartner", "Auf der Karrierewebsite oder LinkedIn nachschlagen"],
                  ].map(([fehler, loesung], i) => (
                    <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                      <td className="border border-gray-200 px-4 py-2 text-[#374151]">{fehler}</td>
                      <td className="border border-gray-200 px-4 py-2 text-[#374151]">{loesung}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Internal links - card grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/bewerbung-vorlage-schweiz", label: "Bewerbung Vorlage Schweiz – Vollständige Muster" },
                { href: "/lebenslauf-fehler", label: "Lebenslauf Fehler – Die häufigsten Fehler und wie Sie diese vermeiden" },
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
              <Link href="/service-check"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200">
                Jetzt Beratung buchen
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
