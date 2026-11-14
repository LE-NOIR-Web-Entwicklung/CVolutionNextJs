import type { Metadata } from "next";

export const SITE_URL = "https://cvolution.ch";
export const SITE_NAME = "CVolution";
export const DEFAULT_OG_IMAGE = "/images/hero2.png";

export const BUSINESS = {
  legalName: "CVolution GmbH",
  name: "CVolution",
  email: "info@cvolution.ch",
  telephone: "+41764405151",
  streetAddress: "Ausserfeldstrasse 9",
  postalCode: "5036",
  addressLocality: "Oberentfelden",
  addressRegion: "AG",
  addressCountry: "CH",
  logo: `${SITE_URL}/images/logo-nobg.png`,
  sameAs: [
    "https://linkedin.com/company/cvolution-gmbh",
    "https://facebook.com/cvolutionswitzerland",
    "https://instagram.com/cvolution.ch",
  ],
} as const;

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

/**
 * Unique title, description, canonical and social tags for one route.
 * Titles are absolute so the layout template never makes them longer than 60 characters.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "de_CH",
      type,
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** For carts, confirmations, logins and order forms: keep them out of the index, keep links followable. */
export function noindexMetadata(title: string): Metadata {
  return {
    title: { absolute: `${title} | CVolution` },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}

export type Faq = { question: string; answer: string };

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BUSINESS.name,
        legalName: BUSINESS.legalName,
        url: SITE_URL,
        logo: BUSINESS.logo,
        email: BUSINESS.email,
        telephone: BUSINESS.telephone,
        sameAs: BUSINESS.sameAs,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#localbusiness`,
        name: BUSINESS.legalName,
        url: SITE_URL,
        image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        logo: BUSINESS.logo,
        email: BUSINESS.email,
        telephone: BUSINESS.telephone,
        priceRange: "CHF 13.90 – CHF 149",
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS.streetAddress,
          postalCode: BUSINESS.postalCode,
          addressLocality: BUSINESS.addressLocality,
          addressRegion: BUSINESS.addressRegion,
          addressCountry: BUSINESS.addressCountry,
        },
        areaServed: { "@type": "Country", name: "Schweiz" },
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        sameAs: BUSINESS.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BUSINESS.name,
        inLanguage: "de-CH",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

type ServiceSchemaInput = {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  offers: { name: string; price: number; unitText?: string }[];
};

export function serviceSchema({ name, description, path, serviceType, offers }: ServiceSchemaInput) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    serviceType,
    url,
    inLanguage: "de-CH",
    provider: { "@id": `${SITE_URL}/#localbusiness` },
    areaServed: { "@type": "Country", name: "Schweiz" },
    offers: offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: offer.price.toFixed(2),
      priceCurrency: "CHF",
      url,
      availability: "https://schema.org/InStock",
      ...(offer.unitText
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: offer.price.toFixed(2),
              priceCurrency: "CHF",
              unitText: offer.unitText,
            },
          }
        : {}),
    })),
  };
}

type ArticleSchemaInput = {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
};

export function articleSchema({
  title,
  description,
  path,
  datePublished = "2026-01-15",
  dateModified = "2026-11-13",
  image = DEFAULT_OG_IMAGE,
}: ArticleSchemaInput) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: "de-CH",
    image: absoluteUrl(image),
    datePublished,
    dateModified,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BUSINESS.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
