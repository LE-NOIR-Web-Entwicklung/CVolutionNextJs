import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "RAV Bewerbung Tipps Schweiz 2025 | Anforderungen & Vorgehen",
  description:
    "RAV Bewerbung Tipps für die Schweiz: Was das RAV von Ihren Bewerbungsunterlagen erwartet, wie Sie die Nachweispflicht erfüllen und trotzdem gezielt suchen.",
  alternates: { canonical: "https://cvolution.ch/rav-bewerbung-tipps" },
};

const faqData = [
  {
    question: "Wie viele Bewerbungen muss ich pro Monat beim RAV einreichen?",
    answer:
      "Die Mindestanzahl wird vom RAV individuell festgelegt und beträgt in der Regel 8–12 Bewerbungen pro Monat. Die genaue Anzahl hängt von Ihrer Branche, Region und der Beratungssituation ab. Fragen Sie Ihre Beratungsperson direkt nach Ihren spezifischen Anforderungen.",
  },
  {
    question: "Welche Bewerbungsformen werden vom RAV anerkannt?",
    answer:
      "Anerkannt werden schriftliche Bewerbungen (per E-Mail oder Post), Online-Bewerbungen über Firmenportale, Bewerbungen über Stellenvermittlungen sowie Spontanbewerbungen. Telefonische Kontakte allein reichen meist nicht aus. Halten Sie immer eine schriftliche Bestätigung fest.",
  },
  {
    question: "Was passiert, wenn ich nicht genug Bewerbungen nachweisen kann?",
    answer:
      "Wenn Sie die Bewerbungspflicht nicht erfüllen, kann das RAV eine Einstellung der Taggeldleistungen (Sanktion) verfügen. Diese kann eine oder mehrere Wochen betragen. Im Wiederholungsfall kann die Sanktion verlängert werden.",
  },
  {
    question: "Darf ich beim RAV wählerisch bei den Stellenangeboten sein?",
    answer:
      "In einem gewissen Mass ja – insbesondere in den ersten Wochen der Arbeitslosigkeit. Langfristig erwartet das RAV jedoch Kompromissbereitschaft bezüglich Gehalt, Pensum und Funktion. Ab einer bestimmten Dauer der Arbeitslosigkeit können zumutbare Stellen auch unterhalb des bisherigen Lohnniveaus liegen.",
  },
  {
    question: "Muss ich alle Absagen dokumentieren?",
    answer:
      "Ja. Sammeln Sie alle Absagen als E-Mails oder Briefe. Falls Sie keine Rückmeldung erhalten, halten Sie fest, wann Sie die Bewerbung geschickt haben (Datum, Unternehmen, Stelle). Das RAV prüft die Nachweise bei jedem Beratungsgespräch.",
  },
  {
    question: "Kann ich mich auch für Stellen ausserhalb meines gelernten Berufs bewerben?",
    answer:
      "Ja, und das ist oft sinnvoll. Quereinsteiger-Bewerbungen können zählen, solange sie realistisch sind und Sie tatsächlich die Anforderungen weitgehend erfüllen. Besprechen Sie mit Ihrer RAV-Beratungsperson, welche Branchen und Funktionen für Sie in Frage kommen.",
  },
];

export default function RavBewerbungTipps() {
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
              RAV Bewerbung Tipps – Anforderungen erfüllen und gezielt suchen
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Bei Anmeldung beim RAV (Regionales Arbeitsvermittlungszentrum) gelten klare Regeln: Sie müssen aktiv nach
              einer Stelle suchen und Ihre Bewerbungsbemühungen nachweisen. Dieser Leitfaden erklärt, wie Sie die
              Anforderungen erfüllen, Sanktionen vermeiden und trotzdem eine Stelle finden, die zu Ihnen passt.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Was das RAV von Ihnen erwartet</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Wer in der Schweiz Arbeitslosenentschädigung (ALV) bezieht, hat eine Mitwirkungspflicht. Dazu gehören:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Aktive Stellensuche mit einer festgelegten Mindestanzahl Bewerbungen pro Monat",
                "Regelmässige Beratungsgespräche beim RAV wahrnehmen",
                "Zumutbare Stellen annehmen, die das RAV vermittelt",
                "Bewerbungsnachweise vollständig dokumentieren und vorlegen",
                "Kursbesuche oder Programme des RAV absolvieren, wenn angeordnet",
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
              Die genaue Zahl der monatlich geforderten Bewerbungen wird individuell festgelegt – fragen Sie Ihre
              Beratungsperson explizit danach, um Sanktionen zu vermeiden.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Bewerbungen richtig dokumentieren</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Das RAV akzeptiert Bewerbungsnachweise in verschiedenen Formen. Wichtig ist, dass Sie jeden Kontakt
              lückenlos festhalten.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Was Sie dokumentieren müssen</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Name des Unternehmens und der angeschriebenen Person (falls bekannt)",
                "Datum der Bewerbung",
                "Bezeichnung der Stelle oder «Spontanbewerbung»",
                "Bewerbungskanal (E-Mail, Post, Online-Portal)",
                "Rückmeldung (Absage, Einladung, keine Antwort)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151]">
                  <svg className="w-5 h-5 text-[#204878] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Praktische Hilfsmittel</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Excel- oder Google-Tabelle mit allen Bewerbungen",
                "E-Mail-Ordner für alle versendeten Bewerbungen und Antworten",
                "Screenshot bei Online-Bewerbungen über Portale ohne automatische Bestätigung",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Qualität statt Masse – trotz Mindestanzahl</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Viele Arbeitssuchende machen den Fehler, Massenbewerbungen zu verschicken, um die Mindestzahl zu
              erreichen. Das ist kontraproduktiv: Pauschale Bewerbungen landen oft direkt im Papierkorb.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">So kombinieren Sie Pflicht und Strategie</h3>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Gezielte Bewerbungen:</strong> Mindestens 50 % Ihrer Bewerbungen sollten auf konkrete Stellenausschreibungen eingehen, die gut zu Ihrem Profil passen.</>,
                <><strong>Spontanbewerbungen:</strong> Suchen Sie Unternehmen, die häufig Stellen in Ihrem Bereich ausschreiben, und bewerben Sie sich initiativ.</>,
                <><strong>Netzwerk aktivieren:</strong> Kontakte über LinkedIn oder persönliche Empfehlungen sind besonders effektiv – halten Sie diese Kontakte ebenfalls schriftlich fest.</>,
                <><strong>Personalvermittlungen:</strong> Registrierung und Gespräche mit Personalvermittlern zählen als Bewerbung und öffnen oft versteckte Stellen.</>,
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Professionelle Bewerbungsunterlagen für das RAV-Umfeld</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Auch unter dem Druck der Mindestanforderungen sollten Ihre Bewerbungsunterlagen professionell sein. Ein
              schlecht formatierter Lebenslauf oder ein generisches Motivationsschreiben reduziert Ihre Chancen erheblich.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Checkliste für Ihre Unterlagen</h3>
            <ul className="space-y-2 mb-4">
              {[
                "Lebenslauf: aktuell, maximal 2 Seiten, mit Foto, in umgekehrter Chronologie",
                "Motivationsschreiben: auf jede Stelle individuell angepasst, max. 1 Seite",
                "Arbeitszeugnisse: alle relevanten, vollständige Kopien",
                "Diplome und Zertifikate: in Kopie beifügen",
                "Alle Dokumente als PDF-Datei zusammenfassen (Gesamtgrösse max. 5 MB)",
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
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Umgang mit Sanktionen und Einsprachen</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Wenn das RAV eine Sanktion (Einstellung der Taggeldleistungen) verfügt, haben Sie das Recht, dagegen
              Einsprache zu erheben. Vorgehen:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Lesen Sie den Sanktionsentscheid sorgfältig und notieren Sie die Einsprachefrist (30 Tage).",
                "Sammeln Sie alle Nachweise, die belegen, dass Sie die Bewerbungspflicht erfüllt haben (E-Mails, Tabellen, Absagen).",
                "Reichen Sie die Einsprache schriftlich bei der zuständigen Stelle ein.",
                "Bei Unsicherheit: Beratung bei einer Gewerkschaft, dem Beratungszentrum für Arbeitnehmende oder einem Anwalt für Arbeitsrecht einholen.",
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/bewerbung-schreiben", label: "Bewerbung schreiben – Anleitung und Tipps für die Schweiz" },
                { href: "/lebenslauf-vorlage-schweiz", label: "Lebenslauf Vorlage Schweiz – Kostenlose Muster" },
                { href: "/motivationsschreiben-beispiel", label: "Motivationsschreiben Beispiel – Vorlage für die Schweiz" },
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
              <Link href="/service-rav"
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
