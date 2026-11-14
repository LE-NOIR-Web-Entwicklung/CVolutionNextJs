import Link from "next/link";
import { KlassischSnippet, type CvStation } from "@/components/content/CvTemplatePreview";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideSchema } from "@/components/seo/GuideSchema";
import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/lebenslauf-student", { type: "article" });

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

const educationWeak: CvStation = { dates: "2020 – 2024", role: "BSc Betriebswirtschaft", org: "Universität Zürich" };

const educationStrong: CvStation = {
  dates: "09.2020 – 07.2024",
  role: "Bachelor of Science in Betriebswirtschaft",
  org: "Universität Zürich",
  tasks: [
    "Schwerpunkte: Marketing, Strategisches Management (Durchschnitt 5,2)",
    "Bachelorarbeit: «Nachhaltigkeitskommunikation in Schweizer KMU» (Note 5,5)",
  ],
};

const internshipWeak: CvStation = {
  dates: "Sommer 2023",
  role: "Marketing Praktikum",
  org: "Firma XY",
  tasks: ["Social Media, Texte schreiben, Marktanalysen"],
};

const internshipStrong: CvStation = {
  dates: "06.2023 – 08.2023",
  role: "Praktikant Marketing",
  org: "Firma XY AG, Zürich",
  tasks: [
    "Eigenverantwortliche Betreuung des Instagram-Kanals (Reichweite +23 %)",
    "Erstellung von Wettbewerbsanalysen für 3 Produktlaunches",
    "Mitarbeit bei der Konzeption einer E-Mail-Kampagne (Öffnungsrate 38 %)",
  ],
};

export default function LebenslaufStudent() {
  return (
    <>
      <GuideSchema path="/lebenslauf-student" faqs={faqData} />
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
              Auch als Berufseinsteiger behalten Sie den klassischen Aufbau bei: Die Berufserfahrung steht vor der
              Ausbildung. Praktika, Studentenjobs und Werkstudentenstellen füllen diesen Abschnitt, die Ausbildung folgt
              direkt danach und wird ausführlich beschrieben.
            </p>
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Reihenfolge wie in unseren Vorlagen</h3>
            <ul className="space-y-2 mb-4">
              {[
                <><strong>Persönliche Angaben mit Foto:</strong> Name, Adresse, Tel., E-Mail, Geburtsdatum, Zivilstand, Heimatort</>,
                <><strong>Berufliche Erfahrung:</strong> Praktika, Studentenjobs, Werkstudentenstellen, regelmässiges Engagement</>,
                <><strong>Aus- &amp; Weiterbildungen:</strong> Studium, Matura/Berufsmatura, relevante Zertifikate – Projekte und Abschlussarbeit als Punkte darunter</>,
                <><strong>Kenntnisse &amp; Fähigkeiten:</strong> Fremdsprachen, Führerschein, Programme</>,
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
            <div className="space-y-5">
              <div>
                <p className="mb-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Schwach</p>
                <KlassischSnippet title="Ausbildungen / Weiterbildungen" stations={[educationWeak]} />
              </div>
              <div>
                <p className="mb-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Stark</p>
                <KlassischSnippet title="Ausbildungen / Weiterbildungen" stations={[educationStrong]} />
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
            <div className="space-y-5">
              <div>
                <p className="mb-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Schwach</p>
                <KlassischSnippet title="Berufliche Erfahrung" stations={[internshipWeak]} />
              </div>
              <div>
                <p className="mb-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Stark</p>
                <KlassischSnippet title="Berufliche Erfahrung" stations={[internshipStrong]} />
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Engagement und Projekte als Ersatz für Berufserfahrung</h2>
            <p className="text-[#374151] leading-relaxed mb-4">
              Wer noch wenig Berufserfahrung hat, kann mit anderen Aktivitäten punkten. Ein eigener Abschnitt ist dafür
              nicht nötig: Regelmässiges Engagement steht als Station unter «Berufliche Erfahrung», Hochschulprojekte
              und Auslandssemester als Punkte bei der jeweiligen Ausbildung.
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

          <GuideCta path="/lebenslauf-student" />

        </div>
      </main>
    </>
  );
}
