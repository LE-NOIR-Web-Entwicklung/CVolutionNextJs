import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarClock, Check, FileText, Sparkles } from "lucide-react";

const steps = [
  {
    title: "Lebenslauf erfassen",
    description: "Tragen Sie Ihre Daten ein oder importieren Sie einen bestehenden CV oder Ihr LinkedIn-PDF.",
  },
  {
    title: "Stelle hinzufügen",
    description: "Fügen Sie den Link zum Inserat ein. Die KI übernimmt Unternehmen und Stelle.",
  },
  {
    title: "Schreiben erstellen",
    description: "Die KI verfasst ein Motivationsschreiben passend zu Stelle und Lebenslauf. Sie prüfen und laden es als Word-Datei herunter.",
  },
  {
    title: "Bewerbung verfolgen",
    description: "Sie sehen jederzeit Status, Termine und den nächsten Schritt jeder Bewerbung.",
  },
];

const tools = [
  {
    title: "CV Self-Service",
    description: "Ihr Lebenslauf, einmal erfasst und jederzeit aktuell.",
    icon: FileText,
    items: [
      "Profil, Erfahrung, Bildung, Sprachen und Fähigkeiten",
      "Import von CV oder LinkedIn-PDF",
      "3 Designs: Klassisch, Modern, Zeitlos",
      "Export als PDF oder Word-Datei",
    ],
  },
  {
    title: "AI Motivationsschreiben",
    description: "Ein eigenes Schreiben für jede Stelle.",
    icon: Sparkles,
    items: [
      "Passend zu Inserat und Lebenslauf",
      "Für Stellen- und Spontanbewerbungen",
      "Auf Deutsch, Englisch und Französisch",
      "Text bearbeiten und als Word-Datei herunterladen",
    ],
  },
  {
    title: "Bewerbungsmanager",
    description: "Alle Bewerbungen an einem Ort im Blick.",
    icon: BriefcaseBusiness,
    items: [
      "Stellenangaben per Link mit KI auslesen",
      "Schreiben direkt bei der Bewerbung",
      "Status und Termine bis zur Zusage",
      "Nächste Schritte und Notizen",
    ],
  },
];

const included = [
  "Unbegrenzte Änderungen",
  "Unbegrenzte Downloads",
  "Sichere Datenspeicherung",
  "Zugriff von überall",
];

const designs = [
  { title: "Klassisch", image: "/images/cv-designs/cv-design-klassisch.png" },
  { title: "Modern", image: "/images/cv-designs/cv-design-modern.png" },
  { title: "Zeitlos", image: "/images/cv-designs/cv-design-zeitlos.png" },
];

// Fictional entries for the product preview in the hero.
const previewApplications = [
  { title: "Teamleitung Beratung", company: "Muster AG", status: "Gespräch", statusClass: "border-amber-200 bg-amber-50 text-amber-800", next: "Gespräch vorbereiten" },
  { title: "Projektleitung", company: "Beispiel GmbH", status: "Versendet", statusClass: "border-blue-200 bg-blue-50 text-blue-800", next: "Telefonisch nachfassen" },
  { title: "Sachbearbeitung HR", company: "Vorlage AG", status: "Entwurf", statusClass: "border-slate-200 bg-slate-50 text-slate-600", next: "Unterlagen versenden" },
];

const startButton = "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200";

export default function Self() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
          <div>
            <p className="text-sm font-semibold text-[#204878]">Self-Service</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-balance text-[#111827] sm:text-5xl">
              Von der Stellenanzeige zur fertigen Bewerbung
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#64748B]">
              Lebenslauf, Motivationsschreiben und alle Ihre Bewerbungen an einem Ort. Sie erledigen alles selbst, die KI hilft beim Schreiben.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/self/login" className={`${startButton} bg-[#204878] text-white hover:bg-[#1a3a66]`}>
                Jetzt Self-Service starten
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#ablauf" className={`${startButton} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}>
                So funktioniert es
              </a>
            </div>
            <p className="mt-4 text-sm text-[#64748B]">CHF 13.90 pro Monat, alles inklusive.</p>
          </div>

          <div aria-hidden="true" className="hidden rounded-lg border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(32,72,120,0.1)] lg:block">
            <p className="font-semibold text-[#111827]">Bewerbungen</p>
            <div className="mt-3 flex gap-1.5 text-xs">
              <span className="rounded-full bg-[#204878] px-2.5 py-1 text-white">Alle 3</span>
              <span className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-600">Offen 2</span>
              <span className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-600">Fällig 1</span>
            </div>
            <ul className="mt-3 divide-y divide-slate-100">
              {previewApplications.map((application) => (
                <li key={application.title} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#111827]">{application.title}</p>
                      <p className="text-xs text-[#64748B]">{application.company}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${application.statusClass}`}>{application.status}</span>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#64748B]">
                    <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                    {application.next}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="ablauf" className="scroll-mt-24 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">So funktioniert es</h2>
          <p className="mt-2 text-base text-[#64748B]">In vier Schritten zur Bewerbung. Den Lebenslauf erfassen Sie nur einmal.</p>

          <ol className="mt-10 grid gap-8 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex gap-4 lg:block">
                {index < steps.length - 1 && (
                  <span aria-hidden="true" className="absolute left-5 top-10 -bottom-8 w-px bg-slate-300 lg:bottom-auto lg:left-12 lg:right-0 lg:top-5 lg:h-px lg:w-auto" />
                )}
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#204878] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div className="lg:mt-4 lg:pr-4">
                  <h3 className="font-semibold text-[#111827]">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">Das ist alles enthalten</h2>
          <p className="mt-2 text-base text-[#64748B]">Drei Werkzeuge, die zusammenarbeiten, in einem Abo.</p>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {tools.map((tool) => (
              <article key={tool.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#EEF4FA] text-[#204878]">
                  <tool.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[#111827]">{tool.title}</h3>
                <p className="mt-1 text-sm text-[#64748B]">{tool.description}</p>
                <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
                  {tool.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#204878]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">3 Designs für Ihren Lebenslauf</h2>
          <p className="mt-2 text-base text-[#64748B]">Wählen Sie beim Export den Stil, der zu Ihrer Bewerbung passt.</p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {designs.map((design) => (
              <figure key={design.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[1/1.38]">
                  <img src={design.image} alt={`Lebenslauf Design ${design.title}`} className="h-full w-full object-cover" />
                </div>
                <figcaption className="border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-[#111827]">{design.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 sm:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 rounded-lg bg-[#204878] p-6 text-white sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-sm font-medium text-white/70">Self-Service-Abo</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">
                CHF 13.90 <span className="text-lg font-normal text-white/70">pro Monat</span>
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/90">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/self/login" className={`${startButton} bg-white text-[#204878] hover:bg-[#EEF4FA]`}>
              Jetzt Self-Service starten
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
