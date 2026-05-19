import type { ShopProductKey } from "@/lib/shop";

export type ServiceOffer = {
  name: string;
  description: string;
  image: string;
  price: string;
  link: string;
  serviceType: ShopProductKey;
  hasMultipleVariants?: boolean;
  offerLabel?: string;
};

export const SERVICE_OFFERS: ServiceOffer[] = [
  {
    name: "Laufbahnberatung",
    description:
      "Analyse Ihrer Stärken, Interessen und Ziele. Erarbeitung individueller Karriere-Strategien. Beratung zu Weiterbildung und beruflicher Neuorientierung",
    image: "/images/talk.png",
    price: "CHF 149 / Stunde",
    link: "/service-career",
    serviceType: "career",
  },
  {
    name: "Lebenslauf",
    description:
      "Analyse Ihrer bisherigen beruflichen Laufbahn. Individuelle Gestaltung eines professionellen Lebenslaufs. Anpassung an die gewünschte Position und Branche",
    image: "/images/resume.png",
    price: "CHF 99",
    link: "/service-cv",
    serviceType: "cv",
  },
  {
    name: "Lohnanalyse",
    description:
      "Transparenter Vergleich mit branchenüblichen Gehältern. Individuelle Einschätzung basierend auf Ihrer Position und Erfahrung. Wertvolle Argumente für Ihre Gehaltsverhandlung",
    image: "/images/search.png",
    price: "ab CHF 69",
    link: "/service-salary",
    serviceType: "salary_pdf",
    hasMultipleVariants: true,
    offerLabel: "2 Angebote ansehen",
  },
  {
    name: "Motivationsschreiben",
    description:
      "Gemeinsames Erarbeiten Ihrer individuellen Argumente. Formulierung eines überzeugenden Motivationsschreibens. Angepasst an spezifische Stellenanforderungen",
    image: "/images/copy-writing.png",
    price: "CHF 99",
    link: "/service-motivation",
    serviceType: "motivation",
  },
  {
    name: "RAV Unterstützung",
    description:
      "Unterstützung bei der Erfüllung von RAV-Vorgaben. Erstellung von Lebenslauf und Motivationsschreiben. Vorbereitung auf Bewerbungsgespräche",
    image: "/images/customer-service.png",
    price: "ab CHF 99",
    link: "/service-rav",
    serviceType: "rav",
  },
  {
    name: "Check",
    description:
      "Wir prüfen deinen Lebenslauf, dein Motivationsschreiben, deine Arbeitszeugnisse und weitere Bewerbungsdokumente auf Inhalt, Aufbau, Gestaltung und Formulierungen",
    image: "/images/checked.png",
    price: "ab CHF 59",
    link: "/service-check",
    serviceType: "check",
  },
];

export const CART_RECOMMENDATION_OFFERS: ServiceOffer[] = [
  SERVICE_OFFERS[0],
  SERVICE_OFFERS[1],
  SERVICE_OFFERS[3],
  SERVICE_OFFERS[4],
  {
    name: "Lohnanalyse PDF",
    description:
      "Fundierte Einschätzung Ihrer Vergütung im Branchenvergleich. Sie übermitteln uns Ihre Angaben und erhalten die Analyse in strukturierter Form als PDF.",
    image: "/images/search.png",
    price: "CHF 69",
    link: "/service-salary-pdf",
    serviceType: "salary_pdf",
  },
  {
    name: "Lohnanalyse Telefon",
    description:
      "Fundierte Einschätzung Ihrer Vergütung im Branchenvergleich. Im telefonischen Gespräch ordnen wir die Resultate gemeinsam ein und beantworten Ihre Fragen.",
    image: "/images/search.png",
    price: "CHF 119",
    link: "/service-salary-tel",
    serviceType: "salary_phone",
  },
  SERVICE_OFFERS[5],
];
