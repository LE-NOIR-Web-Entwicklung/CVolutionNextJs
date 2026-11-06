import { getServiceDownloadPrice, SERVICE_DOWNLOAD_OFFERS, SERVICE_DOWNLOADS_PATH } from "@/lib/service-downloads";
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
    name: "Lebenslauf",
    description:
    "Analyse Ihrer bisherigen beruflichen Laufbahn. Individuelle Gestaltung eines professionellen Lebenslaufs. Anpassung an die gewünschte Position und Branche",
    image: "/images/resume.png",
    price: "CHF 99",
    link: "/service-cv",
    serviceType: "cv",
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
    name: "Laufbahnberatung",
    description:
    "Analyse Ihrer Stärken, Interessen und Ziele. Erarbeitung individueller Karriere-Strategien. Beratung zu Weiterbildung und beruflicher Neuorientierung",
    image: "/images/talk.png",
    price: "CHF 149 / Stunde",
    link: "/service-career",
    serviceType: "career",
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
  {
    name: "Downloads",
    description:
    "Masterprompts für Ihr Motivationsschreiben mit KI und Lebenslauf-Vorlagen für Word. CHF 19.90 pro Dokument oder alle 5 im Komplettpaket für CHF 49.90",
    image: "/images/resume.png",
    price: "ab CHF 19.90",
    link: SERVICE_DOWNLOADS_PATH,
    serviceType: "download_prompt_spontan",
    hasMultipleVariants: true,
    offerLabel: "6 Angebote ansehen",
  },
  {
    name: "LinkedIn Profil Optimierung",
    description:
    "Schärfung Ihres LinkedIn-Auftritts für die Stellensuche. Klare Positionierung, optimierte Profilstruktur und ansprechendes Copywriting für Recruiter",
    image: "/images/copy-writing.png",
    price: "CHF 149",
    link: "/service-linkedin",
    serviceType: "linkedin",
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
];

export type OfferCard = Pick<ServiceOffer, "name" | "description" | "image" | "price" | "link">;

export const OFFER_CARDS: OfferCard[] = [
  {
    name: "Self-Service",
    description:
      "Lebenslauf und Motivationsschreiben selbst erstellen, Bewerbungen verwalten und den eigenen Lohn einordnen. Alles an einem Ort, jederzeit verfügbar",
    image: "/images/self-service-icon.png",
    price: "CHF 13.90 / Monat",
    link: "/self",
  },
  ...SERVICE_OFFERS,
];

const offerNamed = (name: string) => SERVICE_OFFERS.find((offer) => offer.name === name) as ServiceOffer;

export const CART_RECOMMENDATION_OFFERS: ServiceOffer[] = [
  {
    name: "Lohnanalyse Telefon",
    description:
      "Fundierte Einschätzung Ihrer Vergütung im Branchenvergleich. Im telefonischen Gespräch ordnen wir die Resultate gemeinsam ein und beantworten Ihre Fragen.",
    image: "/images/search.png",
    price: "CHF 119",
    link: "/service-salary-tel",
    serviceType: "salary_phone",
  },
  offerNamed("Lebenslauf"),
  offerNamed("Motivationsschreiben"),
  offerNamed("Check"),
  offerNamed("RAV Unterstützung"),
  {
    name: "Lohnanalyse PDF",
    description:
      "Fundierte Einschätzung Ihrer Vergütung im Branchenvergleich. Sie übermitteln uns Ihre Angaben und erhalten die Analyse in strukturierter Form als PDF.",
    image: "/images/search.png",
    price: "CHF 69",
    link: "/service-salary-pdf",
    serviceType: "salary_pdf",
  },
  offerNamed("LinkedIn Profil Optimierung"),
];

export const CART_DOWNLOAD_OFFERS: ServiceOffer[] = SERVICE_DOWNLOAD_OFFERS.map((download) => ({
  name: download.label,
  description: download.description,
  image: "/images/resume.png",
  price: `CHF ${getServiceDownloadPrice(download.key).toFixed(2)}`,
  link: SERVICE_DOWNLOADS_PATH,
  serviceType: download.key,
}));
