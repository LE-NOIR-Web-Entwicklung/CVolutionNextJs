import { ServiceDetailPage } from "@/components/ServiceDetailPage";
import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/service-career");

export default function ServiceCareer() {
  return (
    <ServiceDetailPage
      eyebrow="Laufbahnberatung"
      title="Laufbahnberatung: mehr Klarheit für Ihren beruflichen Weg"
      subtitle="Wir analysieren Ihre Ziele, Interessen und Kompetenzen und entwickeln mit Ihnen konkrete nächste Schritte."
      image="/images/talk.png"
      imageAlt="Laufbahnberatung"
      introTitle="Ihre Karriere, mit Struktur betrachtet"
      description="Die Berufswelt verändert sich rasant, und manchmal ist es schwierig, den richtigen Weg zu finden. Ob Sie in Ihrer aktuellen Position unzufrieden sind, nach neuen Herausforderungen suchen oder Ihre Karriere strategisch weiterentwickeln möchten – unsere Laufbahnberatung bietet Ihnen Orientierung und Unterstützung. In individuellen Beratungsgesprächen analysieren wir Ihre beruflichen Ziele, Interessen und Kompetenzen. Gemeinsam entwickeln wir Strategien, die Ihnen helfen, Ihre Karriereziele zu erreichen. Wir unterstützen Sie bei der Planung von Weiterbildungen, beim Wechsel in eine neue Branche oder der Vorbereitung auf Führungsaufgaben. Mit unserer Hilfe gewinnen Sie Klarheit und setzen gezielt die nächsten Schritte auf Ihrem Weg zum Erfolg."
      services={[
        "Analyse Ihrer Stärken, Interessen und Ziele",
        "Erarbeitung individueller Karriere-Strategien",
        "Beratung zu Weiterbildung und beruflicher Neuorientierung",
      ]}
      closingText="Mit unserer Unterstützung finden Sie den richtigen Weg für Ihre berufliche Zukunft."
      price="CHF 149"
      priceSuffix="/ Stunde"
      serviceType="career"
      path="/service-career"
      schemaName="Laufbahnberatung"
      offers={[{ name: "Laufbahnberatung", price: 149, unitText: "Stunde" }]}
      faqs={[
        { question: "Was kostet eine Laufbahnberatung?", answer: "Die Laufbahnberatung kostet CHF 149 pro Stunde. Wie viele Sitzungen sinnvoll sind, hängt von Ihrer Fragestellung ab – oft bringt bereits ein Gespräch Klarheit über die nächsten Schritte." },
        { question: "Für wen eignet sich eine Laufbahnberatung?", answer: "Für Personen, die unzufrieden im aktuellen Job sind, eine Neuorientierung oder einen Branchenwechsel planen, eine Weiterbildung abwägen oder sich auf eine Führungsrolle vorbereiten." },
        { question: "Was ist das Ergebnis der Beratung?", answer: "Sie kennen Ihre Stärken und Ziele genauer und haben konkrete nächste Schritte – zum Beispiel passende Stellenprofile, eine Weiterbildungsentscheidung oder einen Plan für Ihre Bewerbungen." },
      ]}
    />
  );
}
