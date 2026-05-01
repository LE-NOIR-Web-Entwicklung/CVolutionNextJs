import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  formatNewsletterDate,
  getNewsletterEditions,
  LINKEDIN_NEWSLETTER_URL,
} from "@/lib/linkedin-newsletter";

export const metadata: Metadata = {
  title: "Blog | Karriere aus erster Hand | CVolution",
  description:
    "Aktuelle LinkedIn-Newsletter-Ausgaben von Karriere aus erster Hand: Recruiting, Löhne, Bewerbung und Arbeitsmarkt Schweiz.",
  alternates: { canonical: "https://cvolution.ch/blog" },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const editions = await getNewsletterEditions();

  return (
    <>
      <Script
        id="blog-item-list-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Karriere aus erster Hand",
            itemListElement: editions.map((edition, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: edition.url,
              name: edition.title,
            })),
          }),
        }}
      />

      <main className="bg-[#F8FAFC] min-h-screen">
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#204878] uppercase tracking-wide mb-3">
                Blog
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight mb-5">
                Karriere aus erster Hand
              </h1>
              <p className="text-lg text-[#64748B] leading-relaxed">
                Praxisnahe Einblicke in Recruiting, Löhne, Bewerbungen und den Schweizer
                Arbeitsmarkt. Die Beiträge werden direkt aus dem LinkedIn-Newsletter gelesen.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {editions.map((edition) => (
                <article
                  key={edition.url}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {edition.imageUrl ? (
                    <a
                      href={edition.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-[16/9] bg-gray-100 overflow-hidden"
                    >
                      <img
                        src={edition.imageUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <div className="aspect-[16/9] bg-[#204878]" />
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <time
                      dateTime={edition.publishedAt}
                      className="text-xs font-semibold text-[#204878] uppercase tracking-wide mb-3"
                    >
                      {formatNewsletterDate(edition.publishedAt)}
                    </time>
                    <h2 className="text-xl font-semibold text-[#111827] leading-snug mb-3">
                      <a
                        href={edition.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#204878] transition-colors"
                      >
                        {edition.title}
                      </a>
                    </h2>
                    <p className="text-sm text-[#64748B] mb-5">{edition.source}</p>
                    <a
                      href={edition.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center text-sm font-semibold text-[#204878] hover:text-[#1a3a66]"
                    >
                      Auf LinkedIn lesen
                      <span className="ml-2" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 h-fit bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm font-semibold text-[#111827] mb-2">Newsletter</p>
              <p className="text-sm text-[#64748B] leading-relaxed mb-5">
                Folgen Sie dem LinkedIn-Newsletter für neue Ausgaben rund um Karriere,
                Bewerbung und Lohn.
              </p>
              <a
                href={LINKEDIN_NEWSLETTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-[#204878] rounded-lg hover:bg-[#1a3a66] transition-colors"
              >
                Newsletter öffnen
              </a>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-3">Passende Angebote</p>
                <div className="space-y-2">
                  {[
                    { href: "/service-career", label: "Laufbahnberatung" },
                    { href: "/service-cv", label: "Lebenslauf" },
                    { href: "/service-salary", label: "Lohnanalyse" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-sm text-[#64748B] hover:text-[#204878] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
