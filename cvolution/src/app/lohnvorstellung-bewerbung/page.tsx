import { FaqSection } from "@/components/content/FaqSection";
import { GuideCta } from "@/components/content/GuideCta";
import { GuideLink, GuideList, GuidePage, GuideSection, GuideTable, GuideTemplate } from "@/components/content/GuideLayout";
import { RelatedGuides } from "@/components/content/RelatedGuides";
import { GuideSchema } from "@/components/seo/GuideSchema";
import type { Faq } from "@/lib/seo";
import { guideFor, guidesForService, metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/lohnvorstellung-bewerbung", { type: "article" });

const PATH = "/lohnvorstellung-bewerbung";

const faqs: Faq[] = [
  {
    question: "Muss ich in der Bewerbung eine Lohnvorstellung angeben?",
    answer:
      "Nur wenn das Inserat ausdrücklich danach fragt. Dann sollten Sie es auch tun: Wer die Angabe weglässt, wirkt unaufmerksam und wird bei vielen Firmen schon im ersten Schritt aussortiert. Fragt das Inserat nicht danach, sprechen Sie den Lohn erst im Gespräch an.",
  },
  {
    question: "Gebe ich den Lohn brutto oder netto an?",
    answer:
      "Immer brutto und am besten als Jahreslohn, zum Beispiel «CHF 88'000 brutto pro Jahr». So gibt es keine Missverständnisse über 12 oder 13 Monatslöhne und Abzüge.",
  },
  {
    question: "Soll ich eine Spanne oder einen festen Betrag nennen?",
    answer:
      "In der schriftlichen Bewerbung ist eine enge Spanne von 5 bis 8 Prozent üblich, etwa «CHF 85'000 bis 90'000». Achten Sie darauf, dass schon die Untergrenze für Sie stimmt, denn dort setzen viele Arbeitgeber an. Im Gespräch wirkt ein konkreter Betrag sicherer.",
  },
  {
    question: "Was passiert, wenn meine Lohnvorstellung zu hoch ist?",
    answer:
      "Liegt sie im marktüblichen Rahmen und ist begründet, wird man Sie trotzdem einladen und verhandeln. Problematisch sind nur Forderungen weit über dem Markt. Prüfen Sie Ihren Betrag deshalb vorher mit offiziellen Zahlen oder einer Lohnanalyse.",
  },
  {
    question: "Darf mich der Arbeitgeber nach meinem aktuellen Lohn fragen?",
    answer:
      "Fragen darf er, Sie müssen aber nicht antworten. Sie können stattdessen sagen, was Sie für die neue Stelle erwarten, und das mit Ihrem Profil und dem Markt begründen. Eine Lohnabrechnung müssen Sie nicht vorlegen.",
  },
];

export default function LohnvorstellungBewerbung() {
  return (
    <>
      <GuideSchema path={PATH} datePublished="2026-11-14" dateModified="2026-11-14" />
      <GuidePage
        eyebrow="Lohn-Ratgeber · mit Formulierungen"
        title="Lohnvorstellung in der Bewerbung: richtig angeben und begründen"
        intro={
          <p>
            «Bitte senden Sie uns Ihr Dossier mit Angabe Ihrer Lohnvorstellung.» Dieser Satz verunsichert viele. Hier
            lesen Sie, wann Sie eine Zahl nennen müssen, wie Sie sie im Motivationsschreiben formulieren, was Sie im
            Gespräch antworten und warum der Bruttolohn nur ein Teil des Angebots ist.
          </p>
        }
      >
        <GuideSection title="Muss ich eine Lohnvorstellung angeben?">
          <GuideList
            items={[
              <>
                <strong className="font-semibold text-[#101828]">Das Inserat fragt danach:</strong> Ja, immer. Ohne Angabe
                fallen Sie bei vielen Firmen aus der Vorauswahl.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Das Inserat fragt nicht danach:</strong> Nein. Der Lohn ist
                dann Thema im ersten oder zweiten Gespräch.
              </>,
              <>
                <strong className="font-semibold text-[#101828]">Online-Formular mit Pflichtfeld:</strong> Tragen Sie den
                Jahreslohn brutto ein. Eine 0 oder 1 wirkt unprofessionell und hilft niemandem.
              </>,
            ]}
          />
          <p>
            Bevor Sie eine Zahl nennen, sollten Sie wissen, was Ihre Funktion in Ihrer Region wert ist. Gute
            Ausgangspunkte sind <GuideLink href="/lohn-nach-beruf">Lohn nach Beruf</GuideLink> und{" "}
            <GuideLink href="/lohn-nach-kanton">Lohn nach Kanton</GuideLink>. Bei einem Stellenwechsel sind 10 bis 15
            Prozent mehr als heute oft realistisch, wenn die neue Stelle mindestens gleichwertig ist.
          </p>
        </GuideSection>

        <GuideSection title="Formulierung im Motivationsschreiben">
          <p>
            Die Lohnvorstellung gehört an das Ende des Motivationsschreibens, direkt vor den Schlusssatz. Ein Satz genügt,
            begründen müssen Sie die Zahl im Schreiben nicht.
          </p>
          <GuideTemplate label="Mit Spanne">
            Meine Lohnvorstellung liegt bei CHF 85'000 bis 90'000 brutto pro Jahr. Ich freue mich darauf, Sie in einem
            persönlichen Gespräch von meiner Motivation zu überzeugen.
          </GuideTemplate>
          <GuideTemplate label="Mit festem Betrag und Eintrittstermin">
            Für diese Position stelle ich mir einen Jahreslohn von CHF 88'000 brutto vor. Ich bin ab dem 1. März verfügbar
            und freue mich auf Ihre Einladung.
          </GuideTemplate>
          <GuideTemplate label="Teilzeit">
            Meine Lohnvorstellung beträgt CHF 92'000 brutto pro Jahr bei einem Pensum von 100 %, für das ausgeschriebene
            80-%-Pensum entsprechend CHF 73'600.
          </GuideTemplate>
          <p>
            Vermeiden Sie «nach Vereinbarung» oder «marktüblich», wenn ausdrücklich nach einer Zahl gefragt ist. Mehr
            zum Aufbau des Schreibens finden Sie in den{" "}
            <GuideLink href="/motivationsschreiben-tipps">Tipps zum Motivationsschreiben</GuideLink>.
          </p>
        </GuideSection>

        <GuideSection title="Die Lohnfrage im Bewerbungsgespräch">
          <p>
            Spätestens im zweiten Gespräch kommt die Frage «Was stellen Sie sich lohnmässig vor?». Antworten Sie ruhig,
            mit einer Zahl und einem Satz Begründung:
          </p>
          <GuideTemplate label="Antwortbeispiel">
            «Mit meinen sechs Jahren Erfahrung im Rechnungswesen und dem eidgenössischen Fachausweis sehe ich mich bei CHF
            98'000 im Jahr. Das entspricht dem, was für vergleichbare Stellen im Raum Zürich bezahlt wird.»
          </GuideTemplate>
          <GuideTemplate label="Wenn Sie zuerst mehr über die Stelle wissen möchten">
            «Das hängt für mich auch von der Verantwortung und den Nebenleistungen ab. Können Sie mir sagen, welches
            Lohnband für die Stelle vorgesehen ist? Dann kann ich Ihnen eine konkrete Zahl nennen.»
          </GuideTemplate>
          <p>
            Haben Sie schriftlich bereits eine Zahl genannt, bleiben Sie im Gespräch dabei. Ein höherer Betrag ist nur
            glaubwürdig, wenn sich die Stelle als grösser herausgestellt hat. Wie Sie danach weiterverhandeln, steht
            unter <GuideLink href="/lohn-verhandeln-schweiz">Lohn verhandeln</GuideLink>; weitere typische Fragen unter{" "}
            <GuideLink href="/bewerbungsgespraech-tipps">Bewerbungsgespräch Tipps</GuideLink>.
          </p>
        </GuideSection>

        <GuideSection title="Bruttolohn oder Gesamtpaket?">
          <p>
            Zwei Angebote mit gleichem Bruttolohn können sich um mehrere tausend Franken pro Jahr unterscheiden. Fragen
            Sie vor der Zusage nach diesen Punkten:
          </p>
          <GuideTable
            caption="Bestandteile eines Lohnangebots"
            head={["Bestandteil", "Worauf achten"]}
            alignRight={false}
            rows={[
              ["12 oder 13 Monatslöhne", <>Immer als Jahreslohn vergleichen – siehe <GuideLink href="/13-monatslohn">13. Monatslohn</GuideLink>.</>],
              ["Bonus", "Garantiert oder freiwillig? Wovon hängt er ab, und wie hoch war er in den letzten Jahren?"],
              ["Pensionskasse", "Zahlt der Arbeitgeber mehr als die Hälfte der Beiträge? Das kann mehrere Prozent des Lohns ausmachen."],
              ["Ferien", "Fünf statt vier Wochen entsprechen rund 2 % mehr Lohn."],
              ["Arbeitszeit", "40 oder 42 Stunden pro Woche – das sind 5 % Unterschied im Stundenlohn."],
              ["Weitere Leistungen", "Homeoffice, Weiterbildung, ÖV-Abo, Krankentaggeld, Familienleistungen."],
            ]}
          />
        </GuideSection>

        <FaqSection faqs={faqs} heading="Häufige Fragen zur Lohnvorstellung" className="mt-12" />

        <RelatedGuides guides={guidesForService("/service-salary").filter((guide) => guide.path !== PATH)} className="mt-14" />

        <div className="mt-14">
          <GuideCta cta={guideFor(PATH)?.service} />
        </div>
      </GuidePage>
    </>
  );
}
