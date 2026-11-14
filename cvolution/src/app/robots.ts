import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Cart, confirmation, privacy page and login stay crawlable on purpose: they carry
 * a noindex meta tag, which Google can only see if crawling is allowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api/", "/downloads/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
