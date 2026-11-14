import Link from "next/link";
import { FaqSection } from "@/components/content/FaqSection";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideSchema } from "@/components/seo/GuideSchema";
import { LSE_GROUPS, LSE_SOURCE_URL, LSE_YEAR } from "@/data/bfs-lse-berufsgruppen";
import type { Faq } from "@/lib/seo";
import { guideFor, metaFor } from "@/lib/seo-pages";
import { LSE_TOTAL, SALARY_JOBS, chf, jobForGroup, lseGroup } from "@/lib/salary-jobs";

export const metadata = metaFor("/lohn-nach-beruf", { type: "article" });

const PATH = "/lohn-nach-beruf";
const groups = LSE_GROUPS.filter((group) => group.code !== "total" && group.total);
const max = Math.max(...groups.map((group) => group.total!.v));
const median = LSE_TOTAL.total!.v;
const majors = groups.filter((group) => group.code.length === 1);
const top = [...groups].filter((g) => g.code.length === 2).sort((a, b) => b.total!.v - a.total!.v);

const faqs: Faq[] = [
  {
    question: "Welcher Beruf verdient in der Schweiz am meisten?",
    answer: `Unter den Berufsgruppen der Lohnstrukturerhebung ${LSE_YEAR} liegen «${top[0].name}» (${chf(top[0].total!.v)}) und «${top[1].name}» (${chf(top[1].total!.v)}) vorne. Innerhalb jeder Gruppe gibt es aber grosse Unterschiede nach Funktion und Branche.`,
  },
  {
    question: "Wie hoch ist der Medianlohn in der Schweiz?",
    answer: `${chf(median)} brutto pro Monat für eine Vollzeitstelle (BFS ${LSE_YEAR}, inkl. anteiligem 13. Monatslohn). Frauen: ${chf(LSE_TOTAL.women!.v)}, Männer: ${chf(LSE_TOTAL.men!.v)}.`,
  },
  {
    question: "Was bedeutet Medianlohn?",
    answer: "Der Medianlohn teilt alle Löhne in zwei Hälften: Die eine Hälfte der Vollzeitbeschäftigten verdient mehr, die andere weniger. Er ist aussagekräftiger als der Durchschnitt, weil sehr hohe Löhne ihn kaum verzerren.",
  },
  {
    question: "Sind die Löhne brutto oder netto?",
    answer: "Brutto. Nach Abzug von AHV, ALV, Pensionskasse und Unfallversicherung bleiben meist 85 bis 90 Prozent. Den genauen Betrag zeigt der Lohnrechner.",
  },
];

export default function LohnNachBeruf() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#142033]">
      <GuideSchema path={PATH} faqs={faqs} datePublished="2026-11-14" dateModified="2026-11-14" />
      <section className="relative isolate px-5 pb-16 pt-10 sm:px-6 sm:pt-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[22rem] bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)]" />
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-semibold text-[#204878]">Offizielle Zahlen des Bundesamts für Statistik</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#101828] text-balance sm:text-5xl">
            Lohn nach Beruf: Was verdient man in der Schweiz?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">
            Medianlöhne für alle Berufsgruppen der Schweiz, brutto pro Monat bei einer Vollzeitstelle. Der Median über alle
            Berufe liegt bei {chf(median)}.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">Beliebte Berufe im Detail</h2>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SALARY_JOBS.map((job) => (
                <li key={job.slug}>
                  <Link
                    href={`/lohn/${job.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3.5 ring-1 ring-[#dce5ef] transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="font-medium text-[#204878]">Lohn {job.keyword}</span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-[#101828]">{chf(lseGroup(job.primary)!.total!.v)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">Alle Berufsgruppen im Vergleich</h2>
            <p className="mt-2 text-sm text-[#607089]">Medianlohn brutto pro Monat, Vollzeit. Die Linie markiert den Schweizer Median.</p>
            <div className="mt-5 space-y-6">
              {majors.map((major) => {
                const children = groups.filter((g) => g.code.length === 2 && g.code.startsWith(major.code));
                return (
                  <div key={major.code} className="rounded-2xl bg-white p-4 ring-1 ring-[#dce5ef] sm:p-6">
                    <h3 className="flex items-baseline justify-between gap-4 text-base font-semibold text-[#101828]">
                      {major.name}
                      <span className="shrink-0 tabular-nums">{chf(major.total!.v)}</span>
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {children.map((g) => {
                        const page = jobForGroup(g.code);
                        const width = (g.total!.v / max) * 100;
                        return (
                          <li key={g.code}>
                            <div className="flex items-baseline justify-between gap-4 text-sm">
                              {page ? (
                                <Link href={`/lohn/${page.slug}`} className="font-medium text-[#204878] hover:underline">
                                  {g.name}
                                </Link>
                              ) : (
                                <span className="text-[#40516a]">{g.name}</span>
                              )}
                              <span className="shrink-0 font-semibold tabular-nums text-[#101828]">
                                {g.total!.u ? "≈ " : ""}
                                {chf(g.total!.v)}
                              </span>
                            </div>
                            <div className="relative mt-1.5 h-2 rounded-full bg-[#eef4fb]" aria-hidden="true">
                              <div className="h-2 rounded-full bg-[#204878]" style={{ width: `${width}%` }} />
                              <div className="absolute -top-1 h-4 w-0.5 bg-[#e0a43a]" style={{ left: `${(median / max) * 100}%` }} />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">So lesen Sie die Zahlen</h2>
            <p className="mt-3 leading-7 text-[#40516a]">
              Die Werte stammen aus der Schweizerischen Lohnstrukturerhebung {LSE_YEAR}, der grössten Lohnstatistik der
              Schweiz. Sie sind auf eine Vollzeitstelle mit 40 Stunden hochgerechnet und enthalten einen Zwölftel des 13.
              Monatslohns. Eine Berufsgruppe umfasst viele Funktionen: Wer in der Gruppe Führungsverantwortung trägt
              oder in einer gut zahlenden Branche arbeitet, liegt oft deutlich darüber.
            </p>
            <p className="mt-3 leading-7 text-[#40516a]">
              Was nach den Abzügen übrig bleibt, berechnen Sie im{" "}
              <Link href="/lohnrechner-schweiz" className="font-semibold text-[#204878] underline underline-offset-4">
                Lohnrechner
              </Link>
              . Ob Ihr Lohn für Ihre konkrete Funktion fair ist, zeigt die{" "}
              <Link href="/service-salary" className="font-semibold text-[#204878] underline underline-offset-4">
                persönliche Lohnanalyse
              </Link>
              .
            </p>
          </section>

          <FaqSection faqs={faqs} heading="Häufige Fragen zum Lohn nach Beruf" className="mt-14 max-w-3xl" />

          <p className="mt-8 text-xs leading-5 text-[#607089]">
            Quelle:{" "}
            <a href={LSE_SOURCE_URL} className="underline" rel="noopener noreferrer" target="_blank">
              Bundesamt für Statistik, Schweizerische Lohnstrukturerhebung {LSE_YEAR}
            </a>
            , Tabelle T17, Berufsgruppen nach CH-ISCO-19. ≈ = statistisch weniger zuverlässiger Wert.
          </p>

          <div className="mt-12">
            <GuideCta cta={guideFor("/lohnrechner-schweiz")?.service} />
          </div>
        </div>
      </section>
    </main>
  );
}
