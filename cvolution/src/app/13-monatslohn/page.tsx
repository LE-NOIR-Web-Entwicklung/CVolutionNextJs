import { FaqSection } from "@/components/content/FaqSection";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideLink, GuideList, GuidePage, GuideSection, GuideTable } from "@/components/content/GuideLayout";
import { RelatedGuides } from "@/components/content/RelatedGuides";
import { GuideSchema } from "@/components/seo/GuideSchema";
import type { Faq } from "@/lib/seo";
import { guideFor, guidesForService, isHiddenPath, metaFor } from "@/lib/seo-pages";
import { MEDIAN_MONTHLY_2024, formatChf } from "@/lib/swiss-payroll";

export const metadata = metaFor("/13-monatslohn", { type: "article" });

const PATH = "/13-monatslohn";

// Pro-rata examples for a monthly salary of CHF 6'000 (13 × 6'000 = CHF 78'000 per year).
const MONTHLY = 6000;
const proRata = [3, 6, 9, 12].map((months) => ({ months, amount: (MONTHLY * months) / 12 }));

// Same annual salary, paid in 12 or 13 instalments.
const ANNUAL = 84500;

const faqs: Faq[] = [
  {
    question: "Ist der 13. Monatslohn in der Schweiz Pflicht?",
    answer:
      "Nein. Das Obligationenrecht schreibt keinen 13. Monatslohn vor. Er ist nur geschuldet, wenn er im Arbeitsvertrag, in einem Gesamtarbeitsvertrag oder im Personalreglement vereinbart ist. In vielen GAV, etwa im Gastgewerbe, im Bauhauptgewerbe und im Detailhandel grosser Arbeitgeber, ist er Pflicht.",
  },
  {
    question: "Wie wird der 13. Monatslohn berechnet?",
    answer:
      "In der Regel entspricht er einem durchschnittlichen Monatslohn ohne Zulagen. Haben Sie nicht das ganze Jahr gearbeitet, erhalten Sie den Anteil: Monatslohn × gearbeitete Monate ÷ 12. Bei einem Monatslohn von CHF 6'000 und 8 Monaten sind das CHF 4'000.",
  },
  {
    question: "Bekomme ich den 13. Monatslohn auch bei einer Kündigung?",
    answer:
      "Ja, wenn er vertraglich vereinbart ist. Er ist dann Teil des Lohns und wird anteilsmässig bis zum letzten Arbeitstag ausbezahlt, auch während der Probezeit und unabhängig davon, wer gekündigt hat.",
  },
  {
    question: "Was ist der Unterschied zwischen 13. Monatslohn und Gratifikation?",
    answer:
      "Der 13. Monatslohn ist ein fester Lohnbestandteil. Eine Gratifikation (Art. 322d OR) ist eine Sondervergütung, deren Höhe und Auszahlung der Arbeitgeber mitbestimmt. Wird sie mehrere Jahre vorbehaltlos ausbezahlt, kann sie zum Anspruch werden. Steht im Vertrag nur «Bonus» oder «Gratifikation», lohnt sich ein genauer Blick.",
  },
  {
    question: "Werden auf den 13. Monatslohn Sozialabzüge fällig?",
    answer:
      "Ja. AHV/IV/EO, ALV, Pensionskasse und Unfallversicherung werden wie beim normalen Lohn abgezogen. Netto bleibt deshalb ungefähr der gleiche Anteil wie bei einem Monatslohn.",
  },
  {
    question: "Wann wird der 13. Monatslohn ausbezahlt?",
    answer:
      "Meist mit dem Novemberlohn oder dem Dezemberlohn. Manche Arbeitgeber zahlen je die Hälfte im Juni und im Dezember. Massgebend ist der Arbeitsvertrag.",
  },
];

export default function DreizehnterMonatslohn() {
  return (
    <>
      <GuideSchema path={PATH} datePublished="2026-11-14" dateModified="2026-11-14" />
      <GuidePage
        eyebrow="Lohn-Ratgeber · Arbeitsrecht Schweiz"
        title="13. Monatslohn in der Schweiz: Pflicht, Berechnung und Kündigung"
        intro={
          <p>
            Der 13. Monatslohn ist in der Schweiz weit verbreitet – gesetzlich vorgeschrieben ist er aber nicht. Hier lesen Sie, wann Sie Anspruch haben, wie er bei einem Ein- oder Austritt berechnet wird und
            warum Sie Lohnangebote immer als Jahreslohn vergleichen sollten.
          </p>
        }
      >
        <GuideSection title="Ist der 13. Monatslohn Pflicht?">
          <p>
            Nein. Das Obligationenrecht kennt keinen gesetzlichen Anspruch. Geschuldet ist der 13. Monatslohn, sobald er
            vereinbart ist, und zwar in einer dieser Quellen:
          </p>
          <GuideList
            items={[
              <>
                <strong className="font-semibold text-[#101828]">Arbeitsvertrag:</strong> «Der Lohn beträgt CHF 6&apos;000 brutto
                pro Monat, 13 × pro Jahr ausbezahlt.»
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Gesamtarbeitsvertrag:</strong> Viele GAV schreiben ihn vor, zum
                Beispiel im Gastgewerbe, im Bauhauptgewerbe, im Elektro- und Telekommunikationsgewerbe und bei vielen
                Detailhändlern.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Personalreglement:</strong> Bund, Kantone und viele
                Gemeinden zahlen ihn gemäss ihren Lohnreglementen.
              </>,
            ]}
          />
          <p>
            Steht im Vertrag nichts dazu, haben Sie keinen Anspruch. Fragen Sie im Bewerbungsgespräch deshalb immer
            nach, ob der genannte Lohn 12- oder 13-mal ausbezahlt wird.
          </p>
        </GuideSection>

        <GuideSection title="Berechnung: so viel steht Ihnen zu">
          <p>
            Der 13. Monatslohn entspricht in der Regel einem durchschnittlichen Bruttomonatslohn, ohne Zulagen und
            Spesen. Wer nicht das ganze Kalenderjahr gearbeitet hat, erhält den Anteil (pro rata temporis):
          </p>
          <p className="rounded-2xl bg-white p-5 text-center font-semibold text-[#101828] ring-1 ring-[#dce5ef]">
            13. Monatslohn = Monatslohn × gearbeitete Monate ÷ 12
          </p>
          <GuideTable
            caption="Anteiliger 13. Monatslohn bei CHF 6'000 pro Monat"
            head={["Gearbeitete Monate", "Anteil 13. Monatslohn"]}
            rows={proRata.map(({ months, amount }) => [`${months} Monate`, formatChf(amount)])}
          />
          <p>
            Bei Teilzeit gilt dasselbe: Der 13. Monatslohn richtet sich nach Ihrem tatsächlichen Monatslohn. Wer im
            Stundenlohn arbeitet, erhält ihn oft als Zuschlag von 8.33 % auf jede Stunde (1 ÷ 12). Dieser Zuschlag muss
            auf der Lohnabrechnung separat ausgewiesen sein.
          </p>
        </GuideSection>

        <GuideSection title="13. Monatslohn bei Kündigung und Probezeit">
          <p>
            Ist der 13. Monatslohn vereinbart, ist er Teil Ihres Lohns. Er wird deshalb bei jedem Austritt anteilsmässig
            ausbezahlt:
          </p>
          <GuideList
            items={[
              "Egal, ob Sie selbst kündigen oder gekündigt werden.",
              "Auch in der Probezeit: Wer nach zwei Monaten geht, erhält 2/12 des Monatslohns zusätzlich.",
              "Bis zum letzten Tag des Arbeitsverhältnisses, also inklusive Kündigungsfrist.",
              "Meist mit der Schlussabrechnung. Fehlt er, fordern Sie ihn schriftlich ein. Lohnforderungen verjähren nach fünf Jahren.",
            ]}
          />
          <p>
            Anders bei einer Gratifikation: Hier kann der Vertrag vorsehen, dass sie nur ausbezahlt wird, wenn Sie zu
            einem Stichtag noch angestellt sind. Prüfen Sie deshalb, welcher Begriff in Ihrem Vertrag steht. Wie Sie
            nach einer Kündigung weitermachen, lesen Sie unter{" "}
            <GuideLink href="/bewerbung-nach-kuendigung">Bewerbung nach Kündigung</GuideLink>.
          </p>
        </GuideSection>

        <GuideSection title="Im Lohnvergleich richtig einrechnen">
          <p>
            Der häufigste Fehler beim Lohnvergleich: Monatslöhne vergleichen, ohne auf die Anzahl Auszahlungen zu
            achten. Derselbe Jahreslohn von {formatChf(ANNUAL)} sieht je nach Vertrag so aus:
          </p>
          <GuideTable
            caption="Gleicher Jahreslohn mit 12 oder 13 Auszahlungen"
            head={["Vertrag", "Monatslohn", "Jahreslohn"]}
            rows={[
              ["12 Monatslöhne", formatChf(ANNUAL / 12), formatChf(ANNUAL)],
              ["13 Monatslöhne", formatChf(ANNUAL / 13), formatChf(ANNUAL)],
            ]}
          />
          <GuideList
            items={[
              <>
                <strong className="font-semibold text-[#101828]">Angebote vergleichen:</strong> Rechnen Sie immer auf den
                Jahreslohn hoch. CHF 6&apos;500 × 13 sind mehr als CHF 7&apos;000 × 12.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Lohnstatistiken:</strong> Die Medianlöhne des BFS (Schweiz:{" "}
                {formatChf(MEDIAN_MONTHLY_2024)}) enthalten bereits 1/12 des 13. Monatslohns. Wer 13 × CHF 6&apos;500 verdient,
                vergleicht also CHF 7&apos;042 mit dem Median.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Lohnvorstellung:</strong> Nennen Sie in der Bewerbung den
                Jahreslohn, dann gibt es keine Missverständnisse. Mehr dazu unter{" "}
                <GuideLink href="/lohnvorstellung-bewerbung">Lohnvorstellung in der Bewerbung</GuideLink>.
              </>,
            ]}
          />
          {!isHiddenPath("/lohnrechner-schweiz") && (
            <p>
              Was netto übrig bleibt, zeigt der <GuideLink href="/lohnrechner-schweiz">Lohnrechner</GuideLink> – dort können
              Sie 12 oder 13 Monatslöhne einstellen.
            </p>
          )}
        </GuideSection>

        <FaqSection faqs={faqs} heading="Häufige Fragen zum 13. Monatslohn" className="mt-12" />

        <p className="mt-8 text-xs leading-5 text-[#607089]">
          Rechtliche Grundlagen: Art. 322 und 322d OR sowie die Rechtsprechung des Bundesgerichts zur Abgrenzung von 13.
          Monatslohn und Gratifikation. Massgebend sind Ihr Arbeitsvertrag und ein allfälliger Gesamtarbeitsvertrag. Diese
          Seite ersetzt keine Rechtsberatung.
        </p>

        <RelatedGuides guides={guidesForService("/service-salary").filter((guide) => guide.path !== PATH)} className="mt-14" />

        <div className="mt-14">
          <GuideCta cta={guideFor(PATH)?.service} />
        </div>
      </GuidePage>
    </>
  );
}
