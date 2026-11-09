import { ServiceDetailPage } from "@/components/ServiceDetailPage";

export default function ServiceCheck() {
  return (
    <ServiceDetailPage
      eyebrow="Bewerbungsdossier-Check"
      title="Konkretes Feedback für bessere Unterlagen."
      subtitle="Wir prüfen Ihr Bewerbungsdossier auf Inhalt, Aufbau, Gestaltung und Wirkung und zeigen Ihnen, wo Sie gezielt verbessern können."
      image="/images/checked.png"
      imageAlt="Check"
      introTitle="Ein Check, der Ihre Bewerbung schärft"
      description="Ein überzeugendes Bewerbungsdossier ist oft der Schlüssel zum Vorstellungsgespräch. Personalverantwortliche entscheiden innert Sekunden, ob eine Bewerbung weiter geprüft wird – oder eben nicht. Deshalb ist es entscheidend, dass Ihre Unterlagen inhaltlich wie formal überzeugen. Wir prüfen Aufbau, Inhalt, Formulierungen, Gestaltung sowie die Gesamtaussage Ihres Dossiers. Sie erhalten von uns ein verständliches Feedback mit konkreten Empfehlungen. Wir analysieren Ihre Bewerbungsdokumente sorgfältig und zeigen Ihnen auf, wo Sie optimieren können."
      servicesTitle="Wir prüfen insbesondere"
      services={[
        "Lebenslauf",
        "Motivationsschreiben",
        "Arbeitszeugnisse",
        "Weitere Dokumente",
      ]}
      closingText="Mit optimierten Bewerbungsunterlagen erhöhen Sie Ihre Chancen auf ein Vorstellungsgespräch und den nächsten Karriereschritt."
      price="ab CHF 59"
      serviceType="check"
    />
  );
}
