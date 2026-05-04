import { ServiceDetailPage } from "@/components/ServiceDetailPage";

export default function ServiceMotivation() {
  return (
    <ServiceDetailPage
      eyebrow="Motivationsschreiben"
      title="Ein Schreiben, das nach Ihnen klingt."
      subtitle="Wir formulieren ein Motivationsschreiben, das Ihre Stärken zeigt, zur Stelle passt und authentisch bleibt."
      image="/images/copy-writing.png"
      imageAlt="Motivationsschreiben"
      introTitle="Ihre Motivation, präzise formuliert"
      description="Das Motivationsschreiben bietet Ihnen die Möglichkeit, Ihre Persönlichkeit und Ihre Begeisterung für die gewünschte Stelle zu zeigen. Doch oft fällt es schwer, die richtigen Worte zu finden und sich von anderen Bewerbern abzuheben. Genau hier setzen wir an. Wir entwickeln gemeinsam mit Ihnen ein massgeschneidertes Motivationsschreiben, das Ihre Beweggründe überzeugend darstellt und Ihre Stärken hervorhebt. Dabei achten wir darauf, dass der Text authentisch bleibt und zu Ihrer individuellen Situation passt. Unsere Erfahrung hilft Ihnen, die richtige Balance zwischen Professionalität und Persönlichkeit zu finden, sodass Ihr Schreiben nicht nur die Aufmerksamkeit der Personalabteilung weckt, sondern auch nachhaltig in Erinnerung bleibt."
      services={[
        "Gemeinsames Erarbeiten Ihrer individuellen Argumente",
        "Formulierung eines überzeugenden Motivationsschreibens",
        "Anpassung an spezifische Stellenanforderungen",
      ]}
      closingText="Mit einem professionellen Motivationsschreiben erhöhen Sie Ihre Chancen auf ein Vorstellungsgespräch und den nächsten Karriereschritt."
      price="CHF 99"
      serviceType="motivation"
    />
  );
}
