import { ServiceDetailPage } from "@/components/ServiceDetailPage";
import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/service-cv");

export default function ServiceCV() {
  return (
    <ServiceDetailPage
      eyebrow="Lebenslauf-Service"
      title="Lebenslauf schreiben lassen – klar, professionell, nach Schweizer Standard"
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
      path="/service-cv"
      schemaName="Lebenslauf schreiben lassen"
      offers={[{ name: "Lebenslauf", price: 99 }]}
      faqs={[
        { question: "Was kostet es, einen Lebenslauf schreiben zu lassen?", answer: "Bei CVolution kostet ein professionell erstellter Lebenslauf CHF 99. Darin enthalten sind die Analyse Ihrer bisherigen Laufbahn, die inhaltliche Überarbeitung und die Gestaltung nach Schweizer Standard." },
        { question: "Welche Unterlagen brauchen Sie von mir?", answer: "Am besten Ihren bisherigen Lebenslauf oder Ihr LinkedIn-Profil, Ihre Arbeitszeugnisse und – falls vorhanden – das Inserat der Stelle, auf die Sie sich bewerben möchten. Fehlt etwas, fragen wir gezielt nach." },
        { question: "Ist der Lebenslauf auf eine bestimmte Stelle zugeschnitten?", answer: "Ja. Wir richten Profil, Reihenfolge und Formulierungen auf die gewünschte Position und Branche aus. So sehen Personalverantwortliche auf den ersten Blick, warum Sie passen." },
        { question: "Kann ich den Lebenslauf später selbst anpassen?", answer: "Ja. Sie erhalten Ihren Lebenslauf so, dass Sie ihn für weitere Bewerbungen selbst aktualisieren können. Für laufende Bewerbungen eignet sich zusätzlich unser Self-Service." },
      ]}
    />
  );
}
