import { ServiceDetailPage } from "@/components/ServiceDetailPage";

export default function ServiceCareer() {
  return (
    <ServiceDetailPage
      eyebrow="Laufbahnberatung"
      title="Mehr Klarheit für Ihren beruflichen Weg."
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
    />
  );
}
