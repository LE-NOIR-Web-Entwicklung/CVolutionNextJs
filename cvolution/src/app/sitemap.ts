import { MetadataRoute } from "next";

const BASE_URL = "https://cvolution.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/service", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/service-cv", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/service-salary", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/service-career", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/service-motivation", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/service-check", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/service-rav", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/team", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/agb", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/impressum", priority: 0.3, changeFrequency: "yearly" as const },
    // Ratgeber
    { path: "/lebenslauf-vorlage-schweiz", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/lebenslauf-aufbau", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/lebenslauf-fehler", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/lebenslauf-beispiel", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/lebenslauf-format-schweiz", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/lebenslauf-student", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/lebenslauf-quereinsteiger", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/motivationsschreiben-tipps", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/bewerbung-schreiben", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/bewerbung-schweiz", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/bewerbung-vorlage-schweiz", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/bewerbung-nach-kuendigung", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/bewerbungsgespraech-tipps", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/lohn-verhandeln-schweiz", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/lohnanalyse-schweiz", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/rav-bewerbung-tipps", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
