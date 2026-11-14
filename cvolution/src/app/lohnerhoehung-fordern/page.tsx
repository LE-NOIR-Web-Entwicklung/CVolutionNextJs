import { FaqSection } from "@/components/content/FaqSection";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideLink, GuideList, GuidePage, GuideSection, GuideTable, GuideTemplate } from "@/components/content/GuideLayout";
import { RelatedGuides } from "@/components/content/RelatedGuides";
import { GuideSchema } from "@/components/seo/GuideSchema";
import type { Faq } from "@/lib/seo";
import { guideFor, guidesForService, metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/lohnerhoehung-fordern", { type: "article" });

const PATH = "/lohnerhoehung-fordern";

const faqs: Faq[] = [
  {
    question: "Wie viel Lohnerhöhung kann ich verlangen?",
    answer:
      "Bei gleicher Funktion sind 3 bis 5 Prozent eine gut begründbare Forderung, wenn Sie deutlich mehr leisten als erwartet oder unter dem Marktlohn liegen. Mit einer Beförderung oder klar mehr Verantwortung sind 5 bis 10 Prozent realistisch. Die generellen Lohnrunden lagen in den letzten Jahren meist bei 1 bis 2 Prozent.",
  },
  {
    question: "Wann ist der beste Zeitpunkt, um eine Lohnerhöhung zu verlangen?",
    answer:
      "Zwei bis drei Monate bevor das Budget für das nächste Jahr festgelegt wird, meist im Spätsommer oder Frühherbst. Gute Anlässe sind ausserdem ein abgeschlossenes Projekt, neue Aufgaben oder ein Mitarbeitergespräch mit gutem Feedback.",
  },
  {
    question: "Soll ich die Lohnerhöhung per E-Mail oder im Gespräch verlangen?",
    answer:
      "Verhandeln Sie im Gespräch. Per E-Mail bitten Sie nur um einen Termin und nennen das Thema. So kann sich Ihre Vorgesetzte vorbereiten und allenfalls schon vorab mit HR das Budget klären.",
  },
  {
    question: "Was tun, wenn der Chef Nein sagt?",
    answer:
      "Fragen Sie nach den Gründen und was Sie konkret erreichen müssen, damit eine Erhöhung möglich wird. Halten Sie Ziele und einen Termin für die nächste Besprechung schriftlich fest. Bleibt es dauerhaft beim Nein, ist ein Stellenwechsel oft der wirksamere Weg zu mehr Lohn.",
  },
  {
    question: "Habe ich Anspruch auf eine jährliche Lohnerhöhung?",
    answer:
      "Nein, ausser Ihr Arbeitsvertrag, ein Gesamtarbeitsvertrag oder ein Lohnreglement sieht sie vor, zum Beispiel Erfahrungsstufen in der öffentlichen Verwaltung. Auch einen gesetzlichen Teuerungsausgleich gibt es nicht.",
  },
];

export default function LohnerhoehungFordern() {
  return (
    <>
      <GuideSchema path={PATH} datePublished="2026-11-14" dateModified="2026-11-14" />
      <GuidePage
        eyebrow="Lohn-Ratgeber · mit E-Mail-Vorlage"
        title="Lohnerhöhung fordern: Wann, wie viel und mit welchen Worten"
        intro={
          <p>
            Eine Lohnerhöhung bekommt selten, wer still wartet. Mit dem richtigen Zeitpunkt, einer begründeten Zahl und
            einem gut vorbereiteten Gespräch stehen Ihre Chancen deutlich besser. Hier finden Sie den Ablauf, realistische
            Prozentsätze, eine E-Mail-Vorlage und was Sie bei einem Nein tun.
          </p>
        }
      >
        <GuideSection title="Wann Sie fragen sollten">
          <p>
            Der wichtigste Faktor ist das Budget. Ist es für das nächste Jahr einmal verteilt, kann auch eine
            wohlwollende Chefin kaum mehr etwas tun. Fragen Sie deshalb früh genug:
          </p>
          <GuideList
            items={[
              "Zwei bis drei Monate vor der Budgetrunde, in vielen Firmen also zwischen August und Oktober.",
              "Nach einem abgeschlossenen Projekt oder einem messbaren Erfolg, solange er allen präsent ist.",
              "Wenn Sie zusätzliche Aufgaben, Personal- oder Budgetverantwortung übernommen haben.",
              "Im Mitarbeitergespräch, wenn das Feedback gut ist. Kündigen Sie das Thema aber vorher an.",
              "Wenn Sie wissen, dass Ihr Lohn unter dem Marktlohn liegt, und das belegen können.",
            ]}
          />
          <p>
            Ungünstig sind die ersten Monate in einer neuen Stelle, Phasen mit Stellenabbau oder schlechten Zahlen und
            die Tage nach einem Fehler.
          </p>
        </GuideSection>

        <GuideSection title="Wie viel ist realistisch?">
          <p>
            Eine Zahl ohne Begründung wirkt willkürlich, eine zu tiefe Zahl verschenkt Geld. Diese Richtwerte haben sich
            in der Praxis bewährt:
          </p>
          <GuideTable
            caption="Realistische Lohnerhöhungen nach Situation"
            head={["Situation", "Realistische Erhöhung"]}
            alignRight={false}
            rows={[
              ["Generelle Lohnrunde, Teuerung", "1–2 %"],
              ["Gleiche Funktion, sehr gute Leistung", "3–5 %"],
              ["Lohn klar unter Marktniveau", "Angleichung an den Markt, oft 5–10 %"],
              ["Beförderung oder deutlich mehr Verantwortung", "5–10 %"],
              ["Stellenwechsel", "oft 10–15 %"],
            ]}
          />
          <p>
            Ihr stärkstes Argument ist der Marktlohn für Ihre Funktion. Erste Anhaltspunkte liefern{" "}
            <GuideLink href="/lohn-nach-beruf">Lohn nach Beruf</GuideLink> und{" "}
            <GuideLink href="/lohn-nach-kanton">Lohn nach Kanton</GuideLink>. Nennen Sie im Gespräch eine konkrete Zahl,
            nicht eine Spanne – sonst landen Sie fast immer am unteren Ende.
          </p>
        </GuideSection>

        <GuideSection title="Gesprächsleitfaden in fünf Schritten">
          <ol className="space-y-4">
            {[
              ["Einstieg", "Bedanken Sie sich für den Termin und nennen Sie das Ziel: «Ich möchte mit Ihnen über meine Entwicklung und meinen Lohn sprechen.»"],
              ["Leistung belegen", "Zwei bis drei konkrete Beispiele aus den letzten 12 Monaten: Projekte, Zahlen, neue Aufgaben, Lob von Kunden. Fakten wirken stärker als Fleiss."],
              ["Markt einordnen", "Zeigen Sie, wo Ihr Lohn im Vergleich zum Markt steht. Eine Lohnanalyse oder offizielle Zahlen geben dem Gespräch eine sachliche Basis."],
              ["Zahl nennen", "«Ich schlage deshalb eine Anpassung auf CHF 7'400 pro Monat vor.» Danach schweigen und die Antwort abwarten."],
              ["Nächste Schritte festhalten", "Vereinbaren Sie, wer bis wann was klärt, und fassen Sie das Ergebnis danach kurz per E-Mail zusammen."],
            ].map(([title, text], index) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#173d66] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span className="leading-7">
                  <strong className="font-semibold text-[#101828]">{title}:</strong> {text}
                </span>
              </li>
            ))}
          </ol>
          <p>
            Vermeiden Sie private Gründe wie Miete oder Familie und Vergleiche mit einzelnen Kolleginnen und Kollegen.
            Mehr Formulierungen für schwierige Momente finden Sie unter{" "}
            <GuideLink href="/lohn-verhandeln-schweiz">Lohn verhandeln</GuideLink>.
          </p>
        </GuideSection>

        <GuideSection title="E-Mail-Vorlage: Termin für das Lohngespräch">
          <p>Per E-Mail verhandeln Sie nicht, Sie bitten nur um einen Termin. Kurz und sachlich genügt:</p>
          <GuideTemplate label="Vorlage zum Anpassen">
            {`Betreff: Termin für ein Gespräch zu meiner Entwicklung und meinem Lohn

Guten Tag Frau Muster

Seit meinem Start vor zwei Jahren habe ich zusätzlich die Betreuung unserer Grosskunden übernommen und das Projekt X erfolgreich abgeschlossen. Gerne würde ich mit Ihnen über meine weitere Entwicklung und eine Anpassung meines Lohns sprechen.

Hätten Sie in den nächsten zwei Wochen 30 Minuten Zeit? Ich passe mich gerne Ihrem Kalender an.

Freundliche Grüsse
Anna Beispiel`}
          </GuideTemplate>
          <GuideTemplate label="Zusammenfassung nach dem Gespräch">
            {`Guten Tag Frau Muster

Vielen Dank für das offene Gespräch von heute. Wie besprochen klären Sie mit HR bis Ende Oktober eine Anpassung meines Lohns auf CHF 7'400 pro Monat ab Januar. Ich freue mich auf Ihre Rückmeldung.

Freundliche Grüsse
Anna Beispiel`}
          </GuideTemplate>
        </GuideSection>

        <GuideSection title="Was tun bei einem Nein?">
          <p>Ein Nein ist selten endgültig. Wichtig ist, was Sie aus dem Gespräch mitnehmen:</p>
          <GuideList
            items={[
              <>
                <strong className="font-semibold text-[#101828]">Gründe erfragen:</strong> Liegt es am Budget, an Ihrer
                Leistung oder an der Lohnstruktur? Die Antwort bestimmt den nächsten Schritt.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Ziele vereinbaren:</strong> «Was muss ich bis wann erreichen,
                damit wir die Anpassung umsetzen können?» Halten Sie das schriftlich fest.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Alternativen ansprechen:</strong> Weiterbildung, ein
                zusätzlicher Ferientag, mehr Homeoffice oder eine Einmalprämie kosten den Arbeitgeber oft weniger Budget.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Folgetermin setzen:</strong> In drei bis sechs Monaten
                nachfassen, nicht erst nach einem Jahr.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Markt testen:</strong> Bleibt es beim Nein, obwohl Sie klar
                unter dem Markt liegen, ist ein Wechsel meist der schnellere Weg. Hilfe dafür bietet die{" "}
                <GuideLink href="/service-career">Laufbahnberatung</GuideLink>.
              </>,
            ]}
          />
        </GuideSection>

        <FaqSection faqs={faqs} heading="Häufige Fragen zur Lohnerhöhung" className="mt-12" />

        <RelatedGuides guides={guidesForService("/service-salary").filter((guide) => guide.path !== PATH)} className="mt-14" />

        <div className="mt-14">
          <GuideCta cta={guideFor(PATH)?.service} />
        </div>
      </GuidePage>
    </>
  );
}
