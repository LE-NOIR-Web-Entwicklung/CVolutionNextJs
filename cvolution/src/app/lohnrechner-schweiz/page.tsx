import Link from "next/link";
import { FaqSection } from "@/components/content/FaqSection";
import { GuideCta } from "@/components/content/GuideCta";
import { RelatedGuides } from "@/components/content/RelatedGuides";
import { SalaryCalculator } from "@/components/salary/SalaryCalculator";
import { GuideSchema } from "@/components/seo/GuideSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, type Faq } from "@/lib/seo";
import { guideFor, guidesForService, metaFor } from "@/lib/seo-pages";
import { BVG, MEDIAN_MONTHLY_2024, PAYROLL_YEAR, RATES, calculatePayroll, formatChf } from "@/lib/swiss-payroll";

export const metadata = metaFor("/lohnrechner-schweiz", { type: "article" });

const PATH = "/lohnrechner-schweiz";

// Worked examples are computed from the same rules as the calculator, so they never drift apart.
const examples = [5000, MEDIAN_MONTHLY_2024, 9000].map((monthly) => ({
  monthly,
  result: calculatePayroll({ gross: monthly, period: "month", payments: 13, workload: 100, age: 35, otherPercent: 1.5 }),
}));

const typicalShare = (examples[1].result.totalDeductions / examples[1].result.annualGross) * 100;

const faqs: Faq[] = [
  {
    question: "Wie viel wird in der Schweiz vom Bruttolohn abgezogen?",
    answer: `Ohne Quellensteuer meist zwischen 10 und 15 Prozent. Bei einem Monatslohn von ${formatChf(MEDIAN_MONTHLY_2024)} und Alter 35 sind es nach den gesetzlichen Mindestsätzen rund ${typicalShare.toFixed(0)} Prozent. Die grössten Posten sind AHV/IV/EO (5.3 %) und die Pensionskasse, deren Beitrag mit dem Alter steigt.`,
  },
  {
    question: "Wie hoch ist der Medianlohn in der Schweiz?",
    answer: `Gemäss Lohnstrukturerhebung des Bundesamts für Statistik lag der Medianlohn 2024 bei ${formatChf(MEDIAN_MONTHLY_2024)} brutto pro Monat für eine Vollzeitstelle, inklusive anteiligem 13. Monatslohn. Die Hälfte der Vollzeitbeschäftigten verdient mehr, die andere Hälfte weniger.`,
  },
  {
    question: "Ist der 13. Monatslohn in der Schweiz Pflicht?",
    answer:
      "Nein. Ein 13. Monatslohn ist weit verbreitet, aber nur geschuldet, wenn er im Arbeitsvertrag oder im Gesamtarbeitsvertrag vereinbart ist. Ist er vereinbart, wird er bei einem unterjährigen Austritt anteilsmässig ausbezahlt.",
  },
  {
    question: "Was ist der koordinierte Lohn bei der Pensionskasse?",
    answer: `Der Teil des Jahreslohns, auf den die Pensionskassenbeiträge berechnet werden: Jahreslohn bis höchstens CHF ${BVG.upperLimit.toLocaleString("de-CH")} minus Koordinationsabzug von CHF ${BVG.coordinationDeduction.toLocaleString("de-CH")}. Unter einem Jahreslohn von CHF ${BVG.entryThreshold.toLocaleString("de-CH")} besteht keine obligatorische Pensionskasse.`,
  },
  {
    question: "Warum weicht meine Lohnabrechnung vom Rechner ab?",
    answer:
      "Viele Pensionskassen verlangen höhere Beiträge als das gesetzliche Minimum, und die Sätze für NBU und Krankentaggeld unterscheiden sich je nach Arbeitgeber. Dazu kommen allenfalls Quellensteuer, Kinderzulagen oder Spesen. Die genauen Sätze finden Sie auf Ihrer Lohnabrechnung.",
  },
];

export default function LohnrechnerSchweiz() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <GuideSchema path={PATH} faqs={faqs} datePublished="2026-11-14" dateModified="2026-11-14" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Lohnrechner Schweiz",
          url: `${SITE_URL}${PATH}`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Alle",
          inLanguage: "de-CH",
          offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
          provider: { "@id": `${SITE_URL}/#organization` },
        }}
      />

      <section className="relative isolate px-5 pb-16 pt-10 sm:px-6 sm:pt-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[22rem] bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)]" />
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold text-[#204878]">Kostenloser Rechner · Stand {PAYROLL_YEAR}</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-[#101828] text-balance sm:text-5xl">
            Lohnrechner Schweiz {PAYROLL_YEAR}: Brutto-Netto-Lohn berechnen
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">
            Geben Sie Ihren Bruttolohn ein und sehen Sie sofort, was nach AHV, ALV, Pensionskasse und Unfallversicherung
            übrig bleibt – und wo Ihr Lohn im Vergleich zum Schweizer Medianlohn steht.
          </p>

          <div className="mt-8">
            <SalaryCalculator />
          </div>

          <article className="mt-16 max-w-3xl space-y-12">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">So rechnet der Lohnrechner</h2>
              <p className="mt-3 leading-7 text-[#40516a]">
                Der Rechner verwendet die gesetzlichen Beitragssätze für Arbeitnehmende, Stand 1. Januar {PAYROLL_YEAR}.
                Die Pensionskasse rechnen wir mit dem gesetzlichen Minimum. Viele Kassen verlangen mehr, dann fällt Ihr
                Nettolohn etwas tiefer aus.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl bg-white ring-1 ring-[#dce5ef]">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead className="bg-[#eef4fb] text-xs uppercase tracking-wide text-[#40516a]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Abzug</th>
                      <th className="px-4 py-3 font-semibold">Satz Arbeitnehmende</th>
                      <th className="px-4 py-3 font-semibold">Grundlage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6edf5] text-[#40516a]">
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#101828]">AHV / IV / EO</td>
                      <td className="px-4 py-3 tabular-nums">5.3 %</td>
                      <td className="px-4 py-3">ganzer Bruttolohn</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#101828]">ALV</td>
                      <td className="px-4 py-3 tabular-nums">1.1 %</td>
                      <td className="px-4 py-3">bis CHF {RATES.alvCeiling.toLocaleString("de-CH")} pro Jahr</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#101828]">Pensionskasse (BVG)</td>
                      <td className="px-4 py-3 tabular-nums">3.5 / 5 / 7.5 / 9 %</td>
                      <td className="px-4 py-3">koordinierter Lohn, nach Alter 25–34 / 35–44 / 45–54 / 55–65</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#101828]">NBU / KTG</td>
                      <td className="px-4 py-3 tabular-nums">ca. 1–2 %</td>
                      <td className="px-4 py-3">je nach Arbeitgeber und Versicherung</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">Beispiele: Brutto und Netto</h2>
              <p className="mt-3 leading-7 text-[#40516a]">13 Monatslöhne, Alter 35, Vollzeit, NBU/KTG 1.5 %.</p>
              <div className="mt-5 overflow-x-auto rounded-2xl bg-white ring-1 ring-[#dce5ef]">
                <table className="w-full min-w-[30rem] text-right text-sm tabular-nums">
                  <thead className="bg-[#eef4fb] text-xs uppercase tracking-wide text-[#40516a]">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Brutto pro Monat</th>
                      <th className="px-4 py-3 font-semibold">Abzüge pro Monat</th>
                      <th className="px-4 py-3 font-semibold">Netto pro Monat</th>
                      <th className="px-4 py-3 font-semibold">Netto pro Jahr</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6edf5] text-[#40516a]">
                    {examples.map(({ monthly, result }) => (
                      <tr key={monthly}>
                        <td className="px-4 py-3 text-left font-medium text-[#101828]">
                          {formatChf(monthly)}
                          {monthly === MEDIAN_MONTHLY_2024 ? <span className="ml-2 text-xs text-[#607089]">(Medianlohn)</span> : null}
                        </td>
                        <td className="px-4 py-3">{formatChf(result.totalDeductions / 13)}</td>
                        <td className="px-4 py-3 font-semibold text-[#101828]">{formatChf(result.netPerPayment)}</td>
                        <td className="px-4 py-3">{formatChf(result.annualNet)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">Was der Rechner nicht berücksichtigt</h2>
              <ul className="mt-4 space-y-3 text-[#40516a]">
                {[
                  ["Quellensteuer", "Personen ohne Niederlassungsbewilligung C zahlen die Steuern direkt über den Lohn. Der Satz hängt von Kanton, Zivilstand und Kindern ab."],
                  ["Höhere Pensionskassenbeiträge", "Viele Arbeitgeber versichern mehr als das Minimum. Das senkt den Nettolohn, erhöht aber Ihr Altersguthaben."],
                  ["Zulagen und Spesen", "Kinder- und Ausbildungszulagen sowie Spesen werden zum Nettolohn dazugerechnet."],
                  ["Bonus und variable Lohnanteile", "Rechnen Sie einen fixen Bonus in den Jahreslohn ein, um ihn mitzuberücksichtigen."],
                ].map(([title, text]) => (
                  <li key={title} className="flex gap-3">
                    <span aria-hidden="true" className="mt-1 text-[#204878]">•</span>
                    <span>
                      <strong className="font-semibold text-[#101828]">{title}:</strong> {text}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">Netto ist nicht gleich fair</h2>
              <p className="mt-3 leading-7 text-[#40516a]">
                Der Rechner zeigt, was auf Ihrem Konto landet. Ob Ihr Bruttolohn für Ihre Funktion, Erfahrung und Region
                marktgerecht ist, beantwortet er nicht. Wie Sie das selbst prüfen, steht im Ratgeber{" "}
                <Link href="/lohnanalyse-schweiz" className="font-semibold text-[#204878] underline underline-offset-4">
                  Lohnanalyse Schweiz
                </Link>
                . Wie Sie mehr herausholen, lesen Sie unter{" "}
                <Link href="/lohn-verhandeln-schweiz" className="font-semibold text-[#204878] underline underline-offset-4">
                  Lohn verhandeln
                </Link>
                .
              </p>
            </section>

            <FaqSection faqs={faqs} heading="Häufige Fragen zum Lohnrechner" />

            <p className="text-xs leading-5 text-[#607089]">
              Quellen: Bundesamt für Sozialversicherungen (Beitragssätze und BVG-Grenzbeträge {PAYROLL_YEAR}), Bundesamt für
              Statistik (Lohnstrukturerhebung 2024). Alle Angaben ohne Gewähr; massgebend ist Ihre Lohnabrechnung.
            </p>
          </article>

          <RelatedGuides
            guides={guidesForService("/service-salary").filter((guide) => guide.path !== PATH)}
            className="mt-14"
          />

          <div className="mt-14">
            <GuideCta cta={guideFor(PATH)?.service} />
          </div>
        </div>
      </section>
    </main>
  );
}
