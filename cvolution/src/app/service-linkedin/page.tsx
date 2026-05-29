import { ServiceDetailPage } from "@/components/ServiceDetailPage";

export default function ServiceLinkedIn() {
  return (
    <ServiceDetailPage
      eyebrow="LinkedIn Profil Optimierung"
      title="Ein LinkedIn-Profil, das Recruiter schneller überzeugt."
      subtitle="Wir schärfen Ihre Positionierung für die Stellensuche und formulieren Profiltexte, die professionell, klar und persönlich wirken."
      image="/images/copy-writing.png"
      imageAlt="LinkedIn Profil Optimierung"
      introTitle="Ihr LinkedIn-Auftritt, auf die Stellensuche ausgerichtet"
      description="Ein starkes LinkedIn-Profil ist heute weit mehr als ein digitaler Lebenslauf. Es zeigt auf den ersten Blick, wofür Sie stehen, welche Erfahrung Sie mitbringen und welche Rolle Sie als Nächstes suchen. Wir prüfen Ihr bestehendes Profil, verdichten Ihre wichtigsten Kompetenzen und übersetzen Ihre berufliche Geschichte in klare, ansprechende Texte. Dabei achten wir auf eine suchfreundliche Struktur, relevante Stichworte und eine Tonalität, die zu Ihnen und Ihrem Zielarbeitsmarkt passt."
      services={[
        "Analyse Ihres bestehenden LinkedIn-Profils",
        "Schärfung von Positionierung, Headline und Info-Bereich",
        "Ansprechendes Copywriting für Profiltext und Erfahrung",
        "Optimierung für Recruiter, Stellensuche und relevante Keywords",
      ]}
      closingText="So entsteht ein LinkedIn-Profil, das Ihre Stärken sichtbar macht und den nächsten beruflichen Schritt aktiv unterstützt."
      price="CHF 149"
      serviceType="linkedin"
    />
  );
}
