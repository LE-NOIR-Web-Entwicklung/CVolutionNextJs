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
      "Ihr Lohn im Branchenvergleich, mit individueller Einschätzung und starken Argumenten für die Gehaltsverhandlung.",
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
    "Ein professioneller Lebenslauf, individuell gestaltet und auf Ihre Zielposition und Branche zugeschnitten.",
    image: "/images/resume.png",
    price: "CHF 99",
    link: "/service-cv",
    serviceType: "cv",
  },
  {
    name: "Motivationsschreiben",
    description:
      "Wir erarbeiten Ihre Argumente und formulieren ein überzeugendes Schreiben, passend zur ausgeschriebenen Stelle.",
    image: "/images/copy-writing.png",
    price: "CHF 99",
    link: "/service-motivation",
    serviceType: "motivation",
  },
  {
    name: "Laufbahnberatung",
    description:
    "Stärken, Ziele und Optionen klären: Strategien für Weiterbildung, Neuorientierung und den nächsten Karriereschritt.",
    image: "/images/talk.png",
    price: "CHF 149 / Stunde",
    link: "/service-career",
    serviceType: "career",
  },
  {
    name: "Check",
    description:
    "Wir prüfen Ihre Bewerbungsunterlagen auf Inhalt, Aufbau, Gestaltung und Formulierungen, mit konkreten Empfehlungen.",
    image: "/images/checked.png",
    price: "ab CHF 59",
    link: "/service-check",
    serviceType: "check",
  },
  {
    name: "Downloads",
    description:
    "KI-Masterprompts für Motivationsschreiben und Word-Vorlagen für den Lebenslauf. Einzeln oder im Komplettpaket.",
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
    "Ein geschärftes LinkedIn-Profil mit klarer Positionierung und Texten, die Recruiter ansprechen.",
    image: "/images/copy-writing.png",
    price: "CHF 149",
    link: "/service-linkedin",
    serviceType: "linkedin",
  },
  {
    name: "RAV Unterstützung",
    description:
    "Unterlagen nach RAV-Vorgaben, von Lebenslauf und Motivationsschreiben bis zur Vorbereitung aufs Gespräch.",
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
      "Lebenslauf und Motivationsschreiben selbst erstellen, Bewerbungen verwalten und den eigenen Lohn einordnen.",
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
