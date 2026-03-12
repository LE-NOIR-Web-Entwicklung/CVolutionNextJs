import { MetadataRoute } from "next";

const BASE_URL = "https://cvolution.ch";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api", "/self"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
