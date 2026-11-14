import { ServiceDetailPage } from "@/components/ServiceDetailPage";
import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/service-rav");

export default function ServiceRAV() {
  return (
    <ServiceDetailPage
      eyebrow="RAV Unterstützung"
      title="RAV-Unterstützung: Bewerbungen und Nachweise sicher erfüllen"
      subtitle="Wir unterstützen Sie bei Bewerbungsunterlagen, RAV-Vorgaben und der Vorbereitung auf Gespräche."
      image="/images/customer-service.png"
      imageAlt="RAV Unterstützung"
      introTitle="RAV-Anforderungen gut vorbereitet erfüllen"
      description="Die Zusammenarbeit mit dem RAV kann eine Herausforderung darstellen, besonders wenn Sie sich unsicher sind, wie Sie die Anforderungen korrekt umsetzen. Unser Service bietet Ihnen eine umfassende Unterstützung, um den Prozess reibungslos zu gestalten. Wir helfen Ihnen, ein vollständiges und überzeugendes Bewerbungsdossier zu erstellen, unterstützen Sie bei der Nachweisführung für Bewerbungsaktivitäten und bereiten Sie auf Gespräche und Termine mit dem RAV vor. Unser Ziel ist es, Ihnen den Rücken freizuhalten, sodass Sie sich auf die wichtigen Schritte Ihrer beruflichen Zukunft konzentrieren können. Mit unserer Expertise stellen Sie sicher, dass alle Vorgaben erfüllt werden und Ihre Bewerbungen höchsten Standards entsprechen."
      services={[
        "Unterstützung bei der Erfüllung von RAV-Vorgaben",
        "Erstellung von Lebenslauf und Motivationsschreiben",
        "Vorbereitung auf Bewerbungsgespräche",
      ]}
      closingText="Mit unserer Hilfe meistern Sie die Herausforderungen des RAV und können sich auf Ihre berufliche Zukunft konzentrieren."
      price="ab CHF 99"
      serviceType="rav"
      path="/service-rav"
      schemaName="RAV-Unterstützung"
      offers={[{ name: "RAV Unterstützung", price: 99 }]}
      faqs={[
        { question: "Wie viele Bewerbungen verlangt das RAV?", answer: "Die Anzahl legt Ihre RAV-Beraterin oder Ihr RAV-Berater individuell fest. Häufig sind es mehrere Arbeitsbemühungen pro Monat. Massgebend ist die Vereinbarung in Ihrem Beratungsgespräch." },
        { question: "Wobei unterstützen Sie mich konkret?", answer: "Wir bringen Lebenslauf und Motivationsschreiben auf Stand, helfen Ihnen, Ihre Arbeitsbemühungen sauber zu dokumentieren, und bereiten Sie auf Gespräche vor." },
        { question: "Was kostet die RAV-Unterstützung?", answer: "Die Unterstützung startet bei CHF 99. Den genauen Umfang stimmen wir mit Ihnen ab." },
      ]}
    />
  );
}
