import { ServiceDetailPage } from "@/components/ServiceDetailPage";

export default function ServiceCV() {
  return (
    <ServiceDetailPage
      eyebrow="Lebenslauf-Service"
      title="Ein Lebenslauf, der sofort Orientierung gibt."
      subtitle="Wir strukturieren Ihre Erfahrung, schärfen Ihr Profil und gestalten ein professionelles Dokument für Ihre nächste Bewerbung."
      image="/images/resume.png"
      imageAlt="Lebenslauf"
      introTitle="Ihr Lebenslauf, klar positioniert"
      description="Ein professioneller Lebenslauf ist der Schlüssel zu einem erfolgreichen Bewerbungsprozess. Oft entscheidet er darüber, ob Sie zu einem Vorstellungsgespräch eingeladen werden oder nicht. Wir bei CVolution wissen, worauf es ankommt. Unser Service geht über das blosse Erstellen eines Dokuments hinaus. Wir analysieren Ihre berufliche Laufbahn, identifizieren Ihre Stärken und Kompetenzen und setzen diese gezielt in Szene. Mit einem modernen Layout und einer klaren Struktur gestalten wir einen Lebenslauf, der nicht nur professionell aussieht, sondern auch die Aufmerksamkeit von Personalverantwortlichen auf sich zieht. Egal, ob Sie sich in einer neuen Branche bewerben möchten, eine Führungskarriere anstreben oder den Berufseinstieg planen – wir passen Ihren Lebenslauf individuell an Ihre Ziele und die Anforderungen der jeweiligen Branche an."
      services={[
        "Analyse Ihrer bisherigen beruflichen Laufbahn",
        "Individuelle Gestaltung eines professionellen Lebenslaufs",
        "Anpassung an die gewünschte Position und Branche",
      ]}
      closingText="Mit einem optimierten Lebenslauf erhöhen Sie Ihre Chancen auf ein Vorstellungsgespräch und den nächsten Karriereschritt."
      price="CHF 99"
      serviceType="cv"
    />
  );
}
