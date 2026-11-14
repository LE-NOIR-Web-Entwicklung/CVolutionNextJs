import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FaqSection } from "@/components/content/FaqSection";
import { GuideCta } from "@/components/content/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { LSE_SOURCE_URL, LSE_YEAR, type LseValue } from "@/data/bfs-lse-berufsgruppen";
import { SITE_URL, articleSchema, breadcrumbSchema, faqSchema, pageMetadata, type Faq } from "@/lib/seo";
import { guideFor } from "@/lib/seo-pages";
import { LSE_TOTAL, SALARY_JOBS, chf, jobForGroup, lseGroup, salaryJob, salaryJobTitle } from "@/lib/salary-jobs";
import { calculatePayroll } from "@/lib/swiss-payroll";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
// Rebuild hourly, so the net pay estimate switches to the new payroll year on 1 January.
export const revalidate = 3600;

export function generateStaticParams() {
  return SALARY_JOBS.map((job) => ({ slug: job.slug }));
}

function describe(slug: string) {
  const job = salaryJob(slug);
  const group = job ? lseGroup(job.primary) : undefined;
  if (!job || !group?.total) return null;
  const median = group.total.v;
  const delta = ((median - LSE_TOTAL.total!.v) / LSE_TOTAL.total!.v) * 100;
  // BFS medians include 1/12 of the 13th salary, so 12 × median is the annual gross.
  const net = calculatePayroll({ gross: median * 12, period: "year", payments: 12, workload: 100, age: 35, otherPercent: 1.5 });
  return { job, group, median, delta, net };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = describe(slug);
  if (!data) return {};
  const { job, median, delta } = data;
  const description = `Was verdient man ${job.asPhrase}? Median ${chf(median)} brutto pro Monat (BFS ${LSE_YEAR}), ${Math.abs(delta).toFixed(0)} % ${delta >= 0 ? "über" : "unter"} dem Schnitt. Nach Alter und Geschlecht.`;
  return pageMetadata({ title: salaryJobTitle(job), description: description.slice(0, 155), path: `/lohn/${job.slug}`, type: "article" });
}

function Value({ value }: { value: LseValue }) {
  if (!value) return <span className="text-[#8090a5]">–</span>;
  return (
    <span className="tabular-nums">
      {value.u ? "≈ " : ""}
      {chf(value.v)}
    </span>
  );
}

export default async function SalaryJobPage({ params }: Props) {
  const { slug } = await params;
  const data = describe(slug);
  if (!data) notFound();
  const { job, group, median, delta, net } = data;
  const path = `/lohn/${job.slug}`;
  const related = job.related.map((code) => lseGroup(code)).filter((g) => g?.total);
  const hasUncertain = [group, ...related].some((g) => g && Object.values(g).some((v) => typeof v === "object" && v?.u));

  const faqs: Faq[] = [
    {
      question: `Wie viel verdient man ${job.asPhrase} in der Schweiz?`,
      answer: `Der Medianlohn in der Berufsgruppe «${group.name}» liegt bei ${chf(median)} brutto pro Monat für eine Vollzeitstelle (BFS Lohnstrukturerhebung ${LSE_YEAR}, inkl. anteiligem 13. Monatslohn). Das sind ${Math.abs(delta).toFixed(0)} % ${delta >= 0 ? "mehr" : "weniger"} als der Median aller Berufe von ${chf(LSE_TOTAL.total!.v)}.`,
    },
    {
      question: `Wie entwickelt sich der Lohn ${job.asPhrase} mit dem Alter?`,
      answer: `Bis 29 Jahre liegt der Median bei ${group.u29 ? chf(group.u29.v) : "–"}, zwischen 30 und 49 Jahren bei ${group.a30to49 ? chf(group.a30to49.v) : "–"} und ab 50 Jahren bei ${group.o50 ? chf(group.o50.v) : "–"} pro Monat.`,
    },
    {
      question: `Wie viel bleibt netto?`,
      answer: `Bei einem Bruttolohn von ${chf(median)} (12 Monatslöhne, Alter 35) bleiben nach AHV, ALV, Pensionskasse (gesetzliches Minimum) und NBU rund ${chf(net.netPerPayment)} pro Monat. Ihren eigenen Nettolohn berechnen Sie im Lohnrechner.`,
    },
  ];
  if (group.women && group.men) {
    faqs.push({
      question: "Verdienen Frauen und Männer gleich viel?",
      answer: `In dieser Berufsgruppe liegt der Median der Frauen bei ${chf(group.women.v)} und jener der Männer bei ${chf(group.men.v)}. Unterschiede entstehen unter anderem durch Funktion, Erfahrung und Branche; nicht jeder Unterschied ist erklärbar.`,
    });
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#142033]">
      <JsonLd
        data={[
          articleSchema({ title: salaryJobTitle(job), description: faqs[0].answer, path, datePublished: "2026-11-14", dateModified: "2026-11-14" }),
          breadcrumbSchema([
            { name: "Startseite", path: "/" },
            { name: "Lohn nach Beruf", path: "/lohn-nach-beruf" },
            { name: `Lohn ${job.keyword}`, path },
          ]),
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "Occupation",
            name: job.keyword,
            description: job.examples,
            occupationLocation: { "@type": "Country", name: "Schweiz" },
            estimatedSalary: {
              "@type": "MonetaryAmountDistribution",
              name: "Medianlohn brutto pro Monat",
              currency: "CHF",
              duration: "P1M",
              median: median,
            },
            mainEntityOfPage: `${SITE_URL}${path}`,
          },
        ]}
      />

      <section className="relative isolate px-5 pb-16 pt-10 sm:px-6 sm:pt-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[22rem] bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)]" />
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Brotkrümel" className="mb-4 text-sm text-[#607089]">
            <Link href="/lohn-nach-beruf" className="font-semibold text-[#204878] hover:underline">
              Lohn nach Beruf
            </Link>{" "}
            / {job.keyword}
          </nav>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-[#101828] text-balance sm:text-5xl">
            Was verdient man {job.asPhrase} in der Schweiz?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">{job.intro}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#173d66] p-5 text-white sm:col-span-1">
              <p className="text-sm text-white/70">Medianlohn brutto</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">{chf(median)}</p>
              <p className="mt-1 text-sm text-white/70">pro Monat, Vollzeit</p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#dce5ef]">
              <p className="text-sm text-[#607089]">Im Vergleich zu allen Berufen</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-[#101828]">
                {delta >= 0 ? "+" : "−"}
                {Math.abs(delta).toFixed(0)} %
              </p>
              <p className="mt-1 text-sm text-[#607089]">Median Schweiz {chf(LSE_TOTAL.total!.v)}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-[#dce5ef]">
              <p className="text-sm text-[#607089]">Netto pro Monat, ca.</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-[#101828]">{chf(net.netPerPayment)}</p>
              <p className="mt-1 text-sm text-[#607089]">
                <Link href="/lohnrechner-schweiz" className="font-semibold text-[#204878] hover:underline">
                  Eigenen Lohn berechnen
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#607089]">
            Berufsgruppe {group.code} «{group.name}»: {job.examples}
          </p>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">Lohn nach Alter und Geschlecht</h2>
            <div className="mt-5 overflow-x-auto rounded-2xl bg-white ring-1 ring-[#dce5ef]">
              <table className="w-full min-w-[30rem] text-right text-sm">
                <caption className="sr-only">Medianlohn brutto pro Monat nach Alter und Geschlecht</caption>
                <thead className="bg-[#eef4fb] text-xs uppercase tracking-wide text-[#40516a]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Alter</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Frauen</th>
                    <th className="px-4 py-3 font-semibold">Männer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6edf5] text-[#40516a]">
                  {(
                    [
                      ["bis 29 Jahre", group.u29, group.u29Women, group.u29Men],
                      ["30 bis 49 Jahre", group.a30to49, group.a30to49Women, group.a30to49Men],
                      ["ab 50 Jahren", group.o50, group.o50Women, group.o50Men],
                      ["Alle", group.total, group.women, group.men],
                    ] as const
                  ).map(([labelText, total, women, men]) => (
                    <tr key={labelText} className={labelText === "Alle" ? "font-semibold text-[#101828]" : ""}>
                      <td className="px-4 py-3 text-left">{labelText}</td>
                      <td className="px-4 py-3"><Value value={total} /></td>
                      <td className="px-4 py-3"><Value value={women} /></td>
                      <td className="px-4 py-3"><Value value={men} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {related.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">Verwandte Berufsgruppen</h2>
              <ul className="mt-5 divide-y divide-[#e6edf5] rounded-2xl bg-white ring-1 ring-[#dce5ef]">
                {related.map((g) => {
                  const page = jobForGroup(g!.code);
                  return (
                    <li key={g!.code} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                      {page ? (
                        <Link href={`/lohn/${page.slug}`} className="font-medium text-[#204878] hover:underline">
                          {g!.name}
                        </Link>
                      ) : (
                        <span className="text-[#40516a]">{g!.name}</span>
                      )}
                      <span className="shrink-0 font-semibold text-[#101828]"><Value value={g!.total} /></span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">Was den Lohn {job.asPhrase} bestimmt</h2>
            <ul className="mt-4 space-y-3 text-[#40516a]">
              {job.factors.map((factor) => (
                <li key={factor} className="flex gap-3 leading-7">
                  <span aria-hidden="true" className="text-[#204878]">•</span>
                  {factor}
                </li>
              ))}
            </ul>
            <p className="mt-5 leading-7 text-[#40516a]">
              Der Median ist ein Mittelwert über viele Funktionen. Ob Ihr eigener Lohn passt, hängt von Ihrer Rolle,
              Erfahrung und Region ab – im Ratgeber{" "}
              <Link href="/lohn-verhandeln-schweiz" className="font-semibold text-[#204878] underline underline-offset-4">
                Lohn verhandeln
              </Link>{" "}
              lesen Sie, wie Sie mehr herausholen.
            </p>
          </section>

          <FaqSection faqs={faqs} heading={`Häufige Fragen zum Lohn ${job.asPhrase}`} className="mt-12" />

          <p className="mt-8 text-xs leading-5 text-[#607089]">
            Quelle:{" "}
            <a href={LSE_SOURCE_URL} className="underline" rel="noopener noreferrer" target="_blank">
              Bundesamt für Statistik, Schweizerische Lohnstrukturerhebung {LSE_YEAR}
            </a>
            , Tabelle T17. Standardisierter Bruttomonatslohn (Vollzeit, 40 Stunden, inkl. 1/12 des 13. Monatslohns),
            privater und öffentlicher Sektor.{hasUncertain ? " ≈ = statistisch weniger zuverlässiger Wert." : ""} Nettolohn
            geschätzt mit den gesetzlichen Abzügen {net.year}.
          </p>

          <div className="mt-12">
            <GuideCta cta={guideFor("/lohnrechner-schweiz")?.service} />
          </div>
        </div>
      </section>
    </main>
  );
}
