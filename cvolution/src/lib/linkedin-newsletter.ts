export type NewsletterEdition = {
  title: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  source: string;
};

export const LINKEDIN_NEWSLETTER_URL =
  "https://www.linkedin.com/newsletters/karriere-aus-erster-hand-7401807449113972736/";

const FALLBACK_EDITIONS: NewsletterEdition[] = [
  {
    title: "Motivationsschreiben – Ein Relikt vergangener Tage oder ein Gamechanger bei…",
    url: "https://de.linkedin.com/pulse/motivationsschreiben-ein-relikt-vergangener-tage-oder-armend-mustafa-htr5e",
    publishedAt: "2026-04-16",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4E12AQHBEbQt_3K-ag/article-cover_image-shrink_600_2000/B4EZ2VrQfRJEAQ-/0/1776332638562?e=2147483647&v=beta&t=eNoHiLm662R4XiZR6LG4r7-iiBTDN4cCL1exRTFrcGo",
    source: "Armend M. on LinkedIn",
  },
  {
    title: "Arbeitszeugnisse lesen und verstehen 📄🔍",
    url: "https://de.linkedin.com/pulse/arbeitszeugnisse-lesen-und-verstehen-armend-mustafa-qzfae",
    publishedAt: "2026-03-11",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4E12AQEF4DE6Zlx0hg/article-cover_image-shrink_720_1280/B4EZzaHH8xG8AI-/0/1773185827214?e=2147483647&v=beta&t=KniKC--J-Jhe9tg3ai9AiVR3IgoVHUWcQLkyrQ52r6I",
    source: "Armend M. on LinkedIn",
  },
  {
    title: "Wenn du deinen Job wechseln musst, musst du den Arbeitsmarkt verstehen!🧠",
    url: "https://de.linkedin.com/pulse/wenn-du-deinen-job-wechseln-musst-den-arbeitsmarkt-armend-mustafa-jdo9e",
    publishedAt: "2026-02-18",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4E12AQH4GIdNVkV8PA/article-cover_image-shrink_720_1280/B4EZxtliESIcAI-/0/1771365082474?e=2147483647&v=beta&t=em8plVz-jVGKu8AHibwV4KSIQrD4emz9rbDY77L-ppw",
    source: "Armend M. on LinkedIn",
  },
  {
    title: "Wie viel verdient man als...?",
    url: "https://de.linkedin.com/pulse/wie-viel-verdient-man-als-armend-mustafa-vcboe",
    publishedAt: "2026-01-14",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4E12AQGOal7p-1cgEg/article-cover_image-shrink_423_752/B4EZu6gbIMKAAU-/0/1768360620977?e=2147483647&v=beta&t=oFZSGse3yjG3jtaQQbN_aNFggxDCbpuzj_BZxXgefXU",
    source: "Armend M. on LinkedIn",
  },
  {
    title: "Der perfekte Nebenjob 🚀",
    url: "https://de.linkedin.com/pulse/der-perfekte-nebenjob-armend-mustafa-ytjre",
    publishedAt: "2026-01-07",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4E12AQFiekUxfJij_w/article-cover_image-shrink_720_1280/B4EZuVxIeNLQAI-/0/1767744244411?e=2147483647&v=beta&t=K6ojuChSXBW2dMVaMWBZPfLrnYXaqQ0yU1CGXRoTwDw",
    source: "Armend M. on LinkedIn",
  },
];

const MONTHS: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseLinkedInDate(value: string) {
  const match = value.match(/([A-Z][a-z]{2})\s+(\d{1,2}),\s+(\d{4})/);

  if (!match) {
    return value;
  }

  const [, month, day, year] = match;
  return `${year}-${MONTHS[month] ?? "01"}-${day.padStart(2, "0")}`;
}

export function formatNewsletterDate(date: string) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function parseNewsletterEditions(html: string): NewsletterEdition[] {
  const blocks = html.match(/<li>\s*<div class="share-update-card">[\s\S]*?<\/li>/g) ?? [];

  return blocks
    .map((block) => {
      const dateMatch = block.match(/Published on\s+([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/);
      const titleMatch = block.match(
        /<a class="share-article__title-link" href="([^"]+)"[\s\S]*?>([\s\S]*?)<\/a>/,
      );
      const imageMatch = block.match(/share-article__image\s+" data-delayed-url="([^"]+)"/);
      const sourceMatch = block.match(/<h4 class="share-article__subtitle">\s*([\s\S]*?)\s*<\/h4>/);

      if (!dateMatch || !titleMatch) {
        return null;
      }

      return {
        title: decodeHtml(titleMatch[2]),
        url: decodeHtml(titleMatch[1]),
        publishedAt: parseLinkedInDate(dateMatch[1]),
        imageUrl: imageMatch ? decodeHtml(imageMatch[1]) : undefined,
        source: sourceMatch ? decodeHtml(sourceMatch[1]) : "LinkedIn Newsletter",
      };
    })
    .filter((edition): edition is NewsletterEdition => Boolean(edition));
}

export async function getNewsletterEditions() {
  try {
    const response = await fetch(LINKEDIN_NEWSLETTER_URL, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (compatible; CVolutionBot/1.0; +https://cvolution.ch/blog)",
      },
      next: { revalidate: 60 * 60 * 6 },
    });

    if (!response.ok) {
      return FALLBACK_EDITIONS;
    }

    const html = await response.text();
    const editions = parseNewsletterEditions(html);

    return editions.length > 0 ? editions : FALLBACK_EDITIONS;
  } catch {
    return FALLBACK_EDITIONS;
  }
}
