import { FaqSection } from "@/components/content/FaqSection";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideLink, GuideList, GuidePage, GuideSection, GuideTable } from "@/components/content/GuideLayout";
import { RelatedGuides } from "@/components/content/RelatedGuides";
import { GuideSchema } from "@/components/seo/GuideSchema";
import { LSE_REGION_SOURCE_URL, LSE_REGION_YEAR, type LseRegionValue } from "@/data/bfs-lse-grossregionen";
import type { Faq } from "@/lib/seo";
import { guideFor, guidesForService, isHiddenPath, metaFor } from "@/lib/seo-pages";
import { chf } from "@/lib/salary-jobs";
import { REGION_BRANCHES, REGION_TOTAL, SALARY_REGIONS, regionRow } from "@/lib/salary-regions";

export const metadata = metaFor("/lohn-nach-kanton", { type: "article" });

const PATH = "/lohn-nach-kanton";
const swiss = REGION_TOTAL.schweiz!.v;
const ranked = [...SALARY_REGIONS].sort((a, b) => REGION_TOTAL[b.key]!.v - REGION_TOTAL[a.key]!.v);
const highest = ranked[0];
const lowest = ranked[ranked.length - 1];
const max = REGION_TOTAL[highest.key]!.v;
const gap = REGION_TOTAL[highest.key]!.v - REGION_TOTAL[lowest.key]!.v;
const pct = (value: number) => `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(1)} %`;
const regionOf = (code: string) => SALARY_REGIONS.find((r) => r.cantons.some((c) => c.code === code))!;

function Value({ value }: { value: LseRegionValue }) {
  if (!value) return <span className="text-[#8090a5]">–</span>;
  return (
    <span className="tabular-nums">
      {value.u ? "≈ " : ""}
      {value.v.toLocaleString("de-CH")}
    </span>
  );
}

const faqs: Faq[] = [
  {
    question: "In welchem Kanton verdient man am meisten?",
    answer: `Die BFS-Lohnstrukturerhebung weist Löhne nach Grossregionen aus. Am höchsten ist der Medianlohn in der Region ${highest.name} mit ${chf(REGION_TOTAL[highest.key]!.v)} brutto pro Monat, gefolgt von der ${ranked[1].name} (${chf(REGION_TOTAL[ranked[1].key]!.v)}). Am tiefsten liegt er im ${lowest.name} mit ${chf(REGION_TOTAL[lowest.key]!.v)}.`,
  },
  {
    question: "Wie hoch ist der Lohn im Kanton Zürich?",
    answer: `Der Medianlohn in Zürich lag ${LSE_REGION_YEAR} bei ${chf(REGION_TOTAL.zuerich!.v)} brutto pro Monat für eine Vollzeitstelle, inklusive anteiligem 13. Monatslohn. Das sind ${pct(((REGION_TOTAL.zuerich!.v - swiss) / swiss) * 100)} gegenüber dem Schweizer Median von ${chf(swiss)}.`,
  },
  {
    question: "Warum gibt es keine Zahlen für jeden einzelnen Kanton?",
    answer:
      "Die Lohnstrukturerhebung ist eine Stichprobe. Für kleine Kantone wären die Ergebnisse statistisch zu unsicher, deshalb veröffentlicht das BFS die Zahlen nach sieben Grossregionen. Einige Kantone werten die Erhebung selbst aus und publizieren eigene Zahlen.",
  },
  {
    question: "Lohnt es sich, für einen höheren Lohn zu pendeln?",
    answer:
      "Rechnen Sie den Mehrlohn netto gegen Fahrkosten und Zeit. Ein GA 2. Klasse kostet rund CHF 4'000 pro Jahr, also über CHF 300 pro Monat. Lohnt sich der Wechsel nur knapp, kann ein Arbeitgeber in der Nähe mit Homeoffice-Tagen das bessere Gesamtpaket sein.",
  },
  {
    question: "Muss ein Arbeitgeber im teureren Kanton mehr zahlen?",
    answer:
      "Nein, ausser ein Gesamtarbeitsvertrag sieht regionale Lohnzonen vor oder ein Kanton hat einen Mindestlohn (zum Beispiel Genf, Neuenburg, Jura, Tessin und Basel-Stadt). Viele grosse Arbeitgeber zahlen aber bewusst regionale Zuschläge, weil sie sonst keine Leute finden.",
  },
];

export default function LohnNachKanton() {
  return (
    <>
      <GuideSchema path={PATH} datePublished="2026-11-14" dateModified="2026-11-14" />
      <GuidePage
        eyebrow={`Offizielle Zahlen des Bundesamts für Statistik · ${LSE_REGION_YEAR}`}
        title="Lohn nach Kanton: Wo verdient man in der Schweiz am meisten?"
        intro={
          <p>
            Zwischen der Region {highest.name} und dem {lowest.name} liegen beim Medianlohn {chf(gap)} pro Monat. Hier sehen
            Sie, was in Ihrer Region üblich ist, welche Branchen den Unterschied machen und warum ein höherer Lohn nicht
            automatisch mehr Geld im Portemonnaie bedeutet.
          </p>
        }
      >
        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">Medianlohn nach Grossregion</h2>
          <p className="mt-3 leading-7 text-[#40516a]">
            Brutto pro Monat, Vollzeit, privater und öffentlicher Sektor zusammen. Schweiz: {chf(swiss)}.
          </p>
          <ul className="mt-5 space-y-3">
            {ranked.map((region) => {
              const value = REGION_TOTAL[region.key]!.v;
              return (
                <li key={region.key} className="rounded-2xl bg-white p-4 ring-1 ring-[#dce5ef]">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-semibold text-[#101828]">{region.name}</p>
                    <p className="shrink-0 font-semibold tabular-nums text-[#101828]">
                      {chf(value)}{" "}
                      <span className="text-sm font-normal text-[#607089]">{pct(((value - swiss) / swiss) * 100)}</span>
                    </p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#eef4fb]" aria-hidden="true">
                    <div className="h-2 rounded-full bg-[#204878]" style={{ width: `${(value / max) * 100}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-[#607089]">{region.cantons.map((c) => c.name).join(", ")}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <GuideSection title="Welcher Kanton gehört zu welcher Region?">
          <p>
            Das BFS veröffentlicht keine Medianlöhne pro Kanton. Für Ihren Kanton gilt der Wert seiner Grossregion. In
            städtischen Zentren liegt der Lohn meist darüber, in ländlichen Gebieten darunter.
          </p>
          <GuideTable
            caption="Kantone und ihre Grossregion mit Medianlohn"
            head={["Kanton", "Grossregion", "Medianlohn"]}
            rows={SALARY_REGIONS.flatMap((region) => region.cantons)
              .sort((a, b) => a.name.localeCompare(b.name, "de-CH"))
              .map((canton) => {
                const region = regionOf(canton.code);
                return [`${canton.name} (${canton.code})`, region.name, chf(REGION_TOTAL[region.key]!.v)];
              })}
          />
        </GuideSection>

        <GuideSection title="Was die Regionen unterscheidet">
          <GuideList
            items={ranked.map((region) => (
              <>
                <strong className="font-semibold text-[#101828]">{region.name}:</strong> {region.note}
              </>
            ))}
          />
        </GuideSection>

        <GuideSection title="Lohn nach Branche und Region">
          <p>
            Der Unterschied zwischen den Regionen ist vor allem ein Branchen-Effekt: Wo viele Banken, Versicherungen und
            Pharmafirmen sitzen, ist der Median hoch. Innerhalb derselben Branche sind die Unterschiede kleiner, aber
            immer noch spürbar. Werte in CHF pro Monat.
          </p>
          <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-[#dce5ef]">
            <table className="w-full min-w-[46rem] text-right text-sm">
              <caption className="sr-only">Medianlohn nach Branche und Grossregion</caption>
              <thead className="bg-[#eef4fb] text-xs uppercase tracking-wide text-[#40516a]">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">Branche</th>
                  <th className="px-3 py-3 font-semibold">CH</th>
                  {SALARY_REGIONS.map((region) => (
                    <th key={region.key} className="px-3 py-3 font-semibold">
                      {region.name.replace("Espace ", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6edf5] text-[#40516a]">
                {REGION_BRANCHES.map(({ code, label }) => {
                  const row = regionRow(code);
                  if (!row) return null;
                  return (
                    <tr key={code}>
                      <td className="px-3 py-3 text-left font-medium text-[#101828]">{label}</td>
                      <td className="px-3 py-3 font-semibold text-[#101828]"><Value value={row.schweiz} /></td>
                      {SALARY_REGIONS.map((region) => (
                        <td key={region.key} className="px-3 py-3"><Value value={row[region.key]} /></td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[#607089]">≈ = statistisch weniger zuverlässiger Wert, – = zu wenige Daten.</p>
        </GuideSection>

        <GuideSection title="Kaufkraft und Steuern: brutto ist nicht alles">
          <p>
            Ein höherer Bruttolohn bedeutet nicht automatisch mehr frei verfügbares Einkommen. Drei Posten fressen einen
            Teil des Vorsprungs wieder auf:
          </p>
          <GuideList
            items={[
              <>
                <strong className="font-semibold text-[#101828]">Miete:</strong> In Zürich, Genf und Zug zahlen Sie für eine
                vergleichbare Wohnung oft mehrere hundert Franken mehr pro Monat als in der Ostschweiz oder im Mittelland.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Steuern:</strong> Die Einkommenssteuer hängt von Kanton und
                Gemeinde ab. Zug, Schwyz und Nidwalden gehören zu den günstigsten Kantonen, Genf, Waadt, Neuenburg und Bern zu den
                teureren. Ihre persönliche Belastung berechnen Sie mit dem Steuerrechner der ESTV.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Krankenkasse:</strong> Die Prämien unterscheiden sich je nach
                Prämienregion um mehrere tausend Franken pro Jahr und Haushalt.
              </>,
            ]}
          />
          <p>
            Vergleichen Sie Angebote deshalb immer netto und nach fixen Kosten.
            {!isHiddenPath("/lohnrechner-schweiz") && (
              <>
                {" "}Den Nettolohn nach Sozialabzügen zeigt der <GuideLink href="/lohnrechner-schweiz">Lohnrechner</GuideLink>.
              </>
            )}
          </p>
        </GuideSection>

        <GuideSection title="Pendeln für mehr Lohn: lohnt es sich?">
          <p>
            Ein Beispiel: Sie wohnen im Aargau und erhalten ein Angebot in Zürich mit CHF 600 mehr pro Monat. Netto bleiben
            davon rund CHF 520. Kostet das Pendeln zusätzlich CHF 200 pro Monat und eine Stunde pro Tag, verdienen Sie für
            rund 20 zusätzliche Stunden im Monat CHF 320 mehr. Ob sich das lohnt, hängt davon ab, wie Sie die Zeit nutzen
            können, und ob Homeoffice-Tage möglich sind.
          </p>
          <p>
            Wichtiger als der regionale Durchschnitt ist ohnehin, was Ihr Profil wert ist. Wie viel Ihr Beruf im Median
            einbringt, sehen Sie unter <GuideLink href="/lohn-nach-beruf">Lohn nach Beruf</GuideLink>.
          </p>
        </GuideSection>

        <FaqSection faqs={faqs} heading="Häufige Fragen zum Lohn nach Kanton" className="mt-12" />

        <p className="mt-8 text-xs leading-5 text-[#607089]">
          Quelle:{" "}
          <a href={LSE_REGION_SOURCE_URL} className="underline" rel="noopener noreferrer" target="_blank">
            Bundesamt für Statistik, Schweizerische Lohnstrukturerhebung {LSE_REGION_YEAR}
          </a>
          , Tabelle T1_gr. Standardisierter Bruttomonatslohn (Median, Vollzeit 40 Stunden, inkl. 1/12 des 13. Monatslohns),
          privater und öffentlicher Sektor zusammen.
        </p>

        <RelatedGuides guides={guidesForService("/service-salary").filter((guide) => guide.path !== PATH)} className="mt-14" />

        <div className="mt-14">
          <GuideCta cta={guideFor(PATH)?.service} />
        </div>
      </GuidePage>
    </>
  );
}
