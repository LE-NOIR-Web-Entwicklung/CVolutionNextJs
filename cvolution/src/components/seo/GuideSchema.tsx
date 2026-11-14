import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema, type Faq } from "@/lib/seo";
import { PAGE_META, type PagePath } from "@/lib/seo-pages";

type GuideSchemaProps = {
  path: PagePath;
  faqs?: Faq[];
  /** ISO date; the Ratgeber pages went live on 2026-05-05. */
  datePublished?: string;
  dateModified?: string;
};

/** Article + BreadcrumbList (+ FAQPage) for a Ratgeber page, built from its metadata entry. */
export function GuideSchema({
  path,
  faqs = [],
  datePublished = "2026-05-05",
  dateModified = "2026-11-13",
}: GuideSchemaProps) {
  const { title, description } = PAGE_META[path];
  const data: object[] = [
    articleSchema({ title, description, path, datePublished, dateModified }),
    breadcrumbSchema([
      { name: "Startseite", path: "/" },
      { name: title.split(":")[0], path },
    ]),
  ];
  if (faqs.length > 0) data.push(faqSchema(faqs));
  return <JsonLd data={data} />;
}
