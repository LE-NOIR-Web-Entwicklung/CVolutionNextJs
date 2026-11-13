import { ServiceDetailPage } from "@/components/ServiceDetailPage";
import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/service-linkedin");

export default function ServiceLinkedIn() {
  return (
    <ServiceDetailPage
      eyebrow="LinkedIn Profil Optimierung"
      title="LinkedIn-Profil optimieren lassen – damit Recruiter Sie finden"
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
      path="/service-linkedin"
      schemaName="LinkedIn-Profil optimieren lassen"
      offers={[{ name: "LinkedIn Profil Optimierung", price: 149 }]}
      faqs={[
        { question: "Was kostet die LinkedIn-Profil-Optimierung?", answer: "Die Optimierung Ihres LinkedIn-Profils kostet CHF 149. Sie umfasst Analyse, Positionierung, Headline, Info-Bereich und die Texte zu Ihren Erfahrungen." },
        { question: "Warum ist LinkedIn für die Stellensuche in der Schweiz wichtig?", answer: "Viele Recruiter und Personalverantwortliche suchen Kandidatinnen und Kandidaten aktiv auf LinkedIn. Ein klares Profil mit den richtigen Stichworten sorgt dafür, dass Sie gefunden werden." },
        { question: "Was brauchen Sie von mir?", answer: "Den Link zu Ihrem LinkedIn-Profil und Ihre Zielposition oder Branche. Beides geben Sie direkt bei der Bestellung an." },
      ]}
    />
  );
}
