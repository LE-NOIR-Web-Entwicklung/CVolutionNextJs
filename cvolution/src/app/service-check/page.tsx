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
      description="Ein überzeugendes Bewerbungsdossier ist oft der Schlüssel zum Vorstellungsgespräch. Personalverantwortliche entscheiden innert Sekunden, ob eine Bewerbung weiter geprüft wird – oder eben nicht. Deshalb ist es entscheidend, dass deine Unterlagen inhaltlich wie formal überzeugen. Wir prüfen Aufbau, Inhalt, Formulierungen, Gestaltung sowie die Gesamtaussage deines Dossiers. Du erhältst von uns ein verständliches Feedback mit konkreten Empfehlungen. Wir analysieren deine Bewerbungsdokumente sorgfältig und zeigen dir auf, wo du optimieren kannst."
      servicesTitle="Wir prüfen insbesondere"
      services={[
        "Lebenslauf und CV",
        "Arbeitszeugnisse",
        "Weitere Unterlagen wie Motivationsschreiben oder Deckblatt",
      ]}
      closingText="Mit optimierten Bewerbungsunterlagen erhöhen Sie Ihre Chancen auf ein Vorstellungsgespräch und den nächsten Karriereschritt."
      price="CHF 49"
      serviceType="check"
    />
  );
}
