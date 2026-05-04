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
  isPremium?: boolean;
  premiumBadge?: string;
  premiumHeadline?: string;
  premiumLongDescription?: string;
  premiumServices?: string[];
  premiumBenefits?: string[];
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  secondaryLink?: string;
  premiumTrustText?: string;
};

export const SERVICE_OFFERS: ServiceOffer[] = [
  {
    name: "Jobwechsel Komplett",
    description:
      "Das Rundum Paket für deinen nächsten Karriereschritt, mit professionellen Unterlagen, klarer Strategie und starken Argumenten für Bewerbung und Lohnverhandlung.",
    image: "/images/customer-service.png",
    price: "CHF 499 einmalig",
    link: "/service-jobwechsel-komplett",
    serviceType: "career",
    isPremium: true,
    premiumBadge: "Premium Paket",
    premiumHeadline: "Alles, was du für deinen nächsten Jobwechsel brauchst.",
    premiumLongDescription:
      "Du willst nicht einfach nur einen neuen Lebenslauf, sondern bessere Chancen im Bewerbungsprozess, einen stärkeren Auftritt und klare Argumente für deinen nächsten Lohnschritt. Mit Jobwechsel Komplett erhältst du Unterlagen, Strategie und persönliche Begleitung aus einer Hand.",
    premiumServices: [
      "Premium Lebenslauf mit klarem, professionellem Aufbau",
      "Vorlage für Motivationsschreiben für überzeugende Bewerbungen",
      "LinkedIn Profil Optimierung für mehr Sichtbarkeit",
      "Lohnanalyse mit realistischen Argumenten für die Verhandlung",
      "Bewerbungsstrategie passend zu deiner Position und Zielbranche",
      "1 Gesprächsvorbereitung für dein nächstes Interview",
      "30 Tage WhatsApp und Mail Support für Fragen und Anpassungen",
    ],
    premiumBenefits: [
      "Professioneller Auftritt bei Arbeitgebern",
      "Mehr Klarheit im Bewerbungsprozess",
      "Bessere Vorbereitung auf Interviews",
      "Stärkere Argumente für Lohnverhandlungen",
      "Persönliche Begleitung statt Standard Vorlagen",
    ],
    primaryCtaLabel: "Jobwechsel Komplett anfragen",
    secondaryCtaLabel: "Mehr erfahren",
    secondaryLink: "/service",
    premiumTrustText:
      "Ideal für Fachkräfte, Berufserfahrene und Personen, die ihren nächsten Karriereschritt gezielt vorbereiten möchten.",
  },
  {
    name: "Laufbahnberatung",
    description:
      "Analyse Ihrer Stärken, Interessen und Ziele. Erarbeitung individueller Karriere Strategien. Beratung zu Weiterbildung und beruflicher Neuorientierung",
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
      "Unterstützung bei der Erfüllung von RAV Vorgaben. Erstellung von Lebenslauf und Motivationsschreiben. Vorbereitung auf Bewerbungsgespräche",
    image: "/images/customer-service.png",
    price: "ab CHF 99",
    link: "/service-rav",
    serviceType: "rav",
  },
  {
    name: "Check",
    description:
      "Wir prüfen deinen Lebenslauf, deine Arbeitszeugnisse und weitere Bewerbungsdokumente auf Inhalt, Aufbau, Gestaltung und Formulierungen",
    image: "/images/checked.png",
    price: "CHF 49",
    link: "/service-check",
    serviceType: "check",
  },
];

export const CART_RECOMMENDATION_OFFERS: ServiceOffer[] = [
  SERVICE_OFFERS[1],
  SERVICE_OFFERS[2],
  SERVICE_OFFERS[4],
  SERVICE_OFFERS[5],
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
  SERVICE_OFFERS[6],
];
