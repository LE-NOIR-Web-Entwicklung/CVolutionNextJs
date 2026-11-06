import { SERVICE_DOWNLOAD_OFFERS, SERVICE_DOWNLOADS_PATH, type ServiceDownloadKey } from "@/lib/service-downloads";
import { SERVICE_CONFIGS, type ServiceConfig } from "@/lib/services";

export type ShopProductKey =
  | "career"
  | "check"
  | "cv"
  | "linkedin"
  | "motivation"
  | "rav"
  | "salary_pdf"
  | "salary_phone"
  | ServiceDownloadKey;

export type ShopProduct = ServiceConfig & {
  key: ShopProductKey;
  href: string;
  shortDescription: string;
};

export const SHOP_PRODUCTS: Record<ShopProductKey, ShopProduct> = {
  career: {
    ...SERVICE_CONFIGS.career,
    key: "career",
    href: "/service-career",
    shortDescription: "Individuelle Laufbahnberatung mit klaren nächsten Schritten.",
  },
  cv: {
    ...SERVICE_CONFIGS.cv,
    key: "cv",
    href: "/service-cv",
    shortDescription: "Professioneller Lebenslauf mit Struktur, Inhalt und Design.",
  },
  linkedin: {
    ...SERVICE_CONFIGS.linkedin,
    key: "linkedin",
    href: "/service-linkedin",
    shortDescription: "Optimiertes LinkedIn-Profil mit klarem Suchfokus und starkem Copywriting.",
  },
  motivation: {
    ...SERVICE_CONFIGS.motivation,
    key: "motivation",
    href: "/service-motivation",
    shortDescription: "Passgenau formuliertes Motivationsschreiben.",
  },
  rav: {
    ...SERVICE_CONFIGS.rav,
    key: "rav",
    href: "/service-rav",
    shortDescription: "Unterstützung bei RAV-Vorgaben und Bewerbungsaktivitäten.",
  },
  check: {
    ...SERVICE_CONFIGS.check,
    key: "check",
    href: "/service-check",
    shortDescription: "Prüfung und Feedback zu Bewerbungsunterlagen.",
  },
  salary_pdf: {
    ...SERVICE_CONFIGS.salary_pdf,
    key: "salary_pdf",
    href: "/service-salary-pdf",
    shortDescription: "Lohnanalyse als PDF innerhalb von 2 Arbeitstagen.",
  },
  salary_phone: {
    ...SERVICE_CONFIGS.salary_phone,
    key: "salary_phone",
    href: "/service-salary-tel",
    shortDescription: "Lohnanalyse mit telefonischer Besprechung.",
  },
  ...(Object.fromEntries(SERVICE_DOWNLOAD_OFFERS.map((download) => [download.key, {
    ...SERVICE_CONFIGS[download.key],
    key: download.key,
    href: SERVICE_DOWNLOADS_PATH,
    shortDescription: download.key === "download_bundle"
      ? "Alle 5 Dokumente zum Herunterladen, Link per E-Mail."
      : `${download.format}-Dokument zum Herunterladen, Link per E-Mail.`,
  }])) as Record<ServiceDownloadKey, ShopProduct>),
};

export const SHOP_PRODUCT_LIST = Object.values(SHOP_PRODUCTS);

export function getShopProduct(value: unknown): ShopProduct | null {
  if (typeof value !== "string") return null;
  return SHOP_PRODUCTS[value as ShopProductKey] ?? null;
}
