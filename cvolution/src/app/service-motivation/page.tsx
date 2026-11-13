import { ServiceDetailPage } from "@/components/ServiceDetailPage";
import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/service-motivation");

export default function ServiceMotivation() {
  return (
    <ServiceDetailPage
      eyebrow="Motivationsschreiben"
      title="Motivationsschreiben schreiben lassen – passend zur Stelle, authentisch im Ton"
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
      path="/service-motivation"
      schemaName="Motivationsschreiben schreiben lassen"
      offers={[{ name: "Motivationsschreiben", price: 99 }]}
      faqs={[
        { question: "Was kostet ein professionelles Motivationsschreiben?", answer: "Ein individuell formuliertes Motivationsschreiben kostet bei CVolution CHF 99 pro Stelle." },
        { question: "Wie lang sollte ein Motivationsschreiben in der Schweiz sein?", answer: "Maximal eine A4-Seite. Personalverantwortliche lesen zuerst Einstieg und Schluss – deshalb formulieren wir diese besonders präzise und auf die Stelle bezogen." },
        { question: "Klingt das Schreiben danach noch nach mir?", answer: "Ja. Wir erarbeiten Ihre Argumente gemeinsam mit Ihnen und achten darauf, dass Ton und Inhalt zu Ihrer Person passen. Ein Schreiben, das austauschbar klingt, überzeugt niemanden." },
        { question: "Was brauchen Sie für die Erstellung?", answer: "Das Stelleninserat, Ihren aktuellen Lebenslauf und ein paar Stichworte, warum Sie die Stelle interessiert. Den Rest klären wir bei Bedarf mit Ihnen." },
      ]}
    />
  );
}
