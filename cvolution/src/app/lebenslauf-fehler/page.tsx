import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Lebenslauf Fehler vermeiden 2025 | Die 15 häufigsten Schwachstellen",
  description:
    "Diese Lebenslauf-Fehler kosten Sie die Einladung zum Vorstellungsgespräch. Erfahren Sie, welche Fehler Schweizer HR-Fachleute am häufigsten bemängeln und wie Sie sie vermeiden.",
  alternates: { canonical: "https://cvolution.ch/lebenslauf-fehler" },
};

const faqData = [
  {
    question: "Wie wichtig ist die Rechtschreibung im Lebenslauf?",
    answer:
      "Extrem wichtig. Rechtschreib- oder Grammatikfehler im Lebenslauf wirken unprofessionell und signalisieren mangelnde Sorgfalt. In vielen Unternehmen führt ein einziger auffälliger Fehler direkt zur Ablage. Lassen Sie Ihren Lebenslauf immer von einer weiteren Person gegenlesen.",
  },
  {
    question: "Darf ich meinen Lebenslauf auf drei Seiten ausweiten?",
    answer:
      "In der Schweiz gilt die Zwei-Seiten-Regel als Standard. Ausnahmen bestehen für Kaderposition mit sehr langer Karriere. Für die meisten Bewerbenden gilt: Kürzen Sie konsequent. Qualität vor Quantität.",
  },
  {
    question: "Warum sollte ich keine allgemeinen Bewerbungsfloskeln verwenden?",
    answer:
      "Formulierungen wie 'teamfähig', 'kommunikativ' oder 'belastbar' sind so verbreitet, dass sie keine Information mehr transportieren. Belegen Sie stattdessen solche Eigenschaften durch konkrete Beispiele aus Ihrem Berufsalltag.",
  },
  {
    question: "Ist ein generischer Lebenslauf ein Problem?",
    answer:
      "Ja. Ein Lebenslauf, der nicht auf die Stelle zugeschnitten ist, fällt bei erfahrenen Personalverantwortlichen sofort auf. Passen Sie Ihre Formulierungen, Schwerpunkte und Kompetenzen gezielt auf die Anforderungen der ausgeschriebenen Stelle an.",
  },
  {
    question: "Was tun, wenn ich viele kurze Anstellungen habe?",
    answer:
      "Seien Sie transparent und erklären Sie kurze Anstellungen kurz im Lebenslauf oder im Motivationsschreiben. Häufige Stellenwechsel müssen kein Nachteil sein – wenn Sie zeigen können, dass Sie dabei Kompetenzen aufgebaut und Mehrwert geschaffen haben.",
  },
  {
    question: "Welche E-Mail-Adresse soll ich für Bewerbungen nutzen?",
    answer:
      "Verwenden Sie eine professionelle E-Mail-Adresse, idealerweise mit Ihrem Vor- und Nachnamen. Adressen wie 'coolguy84@hotmail.com' wirken unprofessionell und hinterlassen einen schlechten ersten Eindruck.",
  },
];

export default function LebenslaufFehlerPage() {
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
              Lebenslauf-Fehler: Die 15 häufigsten Schwachstellen im Schweizer CV
            </h1>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Viele Bewerbungen scheitern nicht am fehlenden Können, sondern an vermeidbaren Fehlern im Lebenslauf.
              Erfahren Sie, was Schweizer HR-Verantwortliche am häufigsten bemängeln – und wie Sie es besser machen.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Warum kleine Fehler grosse Konsequenzen haben</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Der Schweizer Arbeitsmarkt ist kompetitiv. Auf eine attraktive Stelle bewerben sich oft 50 bis 200
              Kandidierende. Personalverantwortliche suchen beim ersten Screening nach Gründen, die Bewerberzahl zu
              reduzieren. Fehler im Lebenslauf liefern genau diesen Grund.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Es geht nicht nur um Rechtschreibfehler. Strukturelle Mängel, fehlende Informationen oder eine
              unpassende Präsentation können genauso schaden. Die gute Nachricht: Die meisten Fehler sind leicht
              vermeidbar, wenn man sie kennt.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Die 15 häufigsten Fehler im Überblick</h2>
            <div className="space-y-4">
              {[
                {
                  nr: "01",
                  titel: "Rechtschreib- und Grammatikfehler",
                  text: "Der klassischste aller Fehler. Nutzen Sie die Rechtschreibprüfung, aber verlassen Sie sich nicht ausschliesslich darauf. Lassen Sie den Lebenslauf von mindestens einer weiteren Person korrekturlesen.",
                },
                {
                  nr: "02",
                  titel: "Unprofessionelle E-Mail-Adresse",
                  text: "Adressen aus der Jugendzeit haben bei Bewerbungen nichts verloren. Erstellen Sie eine professionelle Adresse mit Vor- und Nachname.",
                },
                {
                  nr: "03",
                  titel: "Fehlende oder falsche Datumsangaben",
                  text: "Geben Sie immer Monat und Jahr an. Lücken ohne Erklärung wecken Misstrauen. Fehler bei Daten können bei einer Überprüfung als Unehrlichkeit gewertet werden.",
                },
                {
                  nr: "04",
                  titel: "Zu vage Tätigkeitsbeschreibungen",
                  text: "«Mitarbeit in verschiedenen Projekten» sagt nichts aus. Beschreiben Sie konkret, was Sie getan, verantwortet und erreicht haben.",
                },
                {
                  nr: "05",
                  titel: "Kein Bezug zur ausgeschriebenen Stelle",
                  text: "Ein generischer Einheits-Lebenslauf fällt auf. Passen Sie Formulierungen und Schwerpunkte gezielt an die Stellenbeschreibung an.",
                },
                {
                  nr: "06",
                  titel: "Kein Foto oder ungeeignetes Foto",
                  text: "In der Schweiz ist ein Bewerbungsfoto üblich. Verwenden Sie ein aktuelles, professionelles Porträtfoto – kein Urlaubsfoto oder Selfie.",
                },
                {
                  nr: "07",
                  titel: "Mehr als zwei Seiten",
                  text: "Ausser bei sehr langen Karrieren gilt: Zwei Seiten sind das Maximum. Streichen Sie konsequent alles, was nicht zur angestrebten Stelle beiträgt.",
                },
                {
                  nr: "08",
                  titel: "Unlesbare Schriftarten oder Design-Übertreibung",
                  text: "Kreativität im Design kann in kreativen Berufen ein Vorteil sein. In den meisten Branchen aber gilt: Lesbarkeit geht vor Originalität.",
                },
                {
                  nr: "09",
                  titel: "Fehlende Sprachniveaus",
                  text: "«Englisch» ohne Niveauangabe ist keine hilfreiche Information. Verwenden Sie den Europäischen Referenzrahmen (A1–C2) oder Begriffe wie 'fliessend', 'verhandlungssicher'.",
                },
                {
                  nr: "10",
                  titel: "Unerkläre Lücken im Lebenslauf",
                  text: "Lücken sind kein Problem, wenn sie erklärt werden. Weiterbildung, Familienzeit, Auslandsaufenthalt – all das ist legitim. Schreiben Sie es kurz hin.",
                },
                {
                  nr: "11",
                  titel: "Auflistung von Aufgaben statt Leistungen",
                  text: "Was haben Sie bewirkt? Zeigen Sie messbare Resultate: Umsatz gesteigert, Kosten gesenkt, Prozesse optimiert – immer mit konkreten Zahlen wenn möglich.",
                },
                {
                  nr: "12",
                  titel: "Falsches Dateiformat",
                  text: "Reichen Sie den Lebenslauf immer als PDF ein, ausser der Arbeitgeber verlangt explizit ein Word-Dokument. PDFs sehen auf jedem Gerät gleich aus.",
                },
                {
                  nr: "13",
                  titel: "Veraltete oder irrelevante Informationen",
                  text: "Sommerferien-Jobs aus der Schulzeit haben im Lebenslauf einer erfahrenen Fachkraft nichts verloren. Fokussieren Sie sich auf Relevantes.",
                },
                {
                  nr: "14",
                  titel: "Fehlende Nationalität oder Arbeitserlaubnis",
                  text: "Besonders für ausländische Bewerbende ist die Angabe der Aufenthaltsbewilligung wichtig. Arbeitgeber müssen wissen, ob und wie sie Sie anstellen können.",
                },
                {
                  nr: "15",
                  titel: "Nicht gespeicherte Dateinamen",
                  text: "Senden Sie nicht eine Datei namens 'CV_final_v3_wirklichfinal.pdf'. Wählen Sie einen professionellen Dateinamen: 'Lebenslauf_Vorname_Nachname.pdf'.",
                },
              ].map((item) => (
                <div key={item.nr} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex gap-4">
                  <span className="text-3xl font-bold text-gray-400 flex-shrink-0 leading-none">{item.nr}</span>
                  <div>
                    <h3 className="font-semibold text-[#111827] mb-1">{item.titel}</h3>
                    <p className="text-[#374151] text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Weiterführende Ratgeber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/lebenslauf-aufbau", label: "Lebenslauf Aufbau" },
                { href: "/lebenslauf-vorlage-schweiz", label: "Lebenslauf Vorlage" },
                { href: "/bewerbungsunterlagen-check", label: "Bewerbungsunterlagen-Check" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[#204878] font-medium">
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">Häufige Fragen zu Lebenslauf-Fehlern</h2>
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
              Unsere Experten prüfen Ihren Lebenslauf auf alle häufigen Fehler und optimieren ihn für den Schweizer Arbeitsmarkt.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/service-cv" className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200">
                Lebenslauf optimieren lassen
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
