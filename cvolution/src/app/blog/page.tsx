import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Clock, Tag } from "lucide-react";
import { getPublishedBlogPosts } from "@/lib/public-blog";
import { formatPostDate, getCoverImageUrl, getPostDate } from "@/lib/blog-display";

export const metadata: Metadata = {
  title: "Blog | CVolution",
  description: "Ratgeber, Vorlagen und konkrete Tipps rund um Bewerbung, Lebenslauf, Lohn und Karriere in der Schweiz.",
};

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const featured = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-950">
      <section className="relative isolate bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)] px-5 pb-18 pt-10 sm:px-6 sm:pb-20 sm:pt-12">

        <div className="mx-auto max-w-6xl">
          <div>
            <p className="mb-4 inline-flex rounded-md border border-[#204878]/15 bg-white/70 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
              CVolution Blog
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-tight text-[#101828] text-balance sm:text-5xl lg:text-6xl">
              Karriere aus erster Hand
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">
              Praxisnahe Einblicke in Recruiting, Löhne und Bewerbungen für den Schweizer Arbeitsmarkt, mit konkreten Tipps für klarere Unterlagen und bessere Entscheidungen.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-6 pb-16 lg:mt-20 lg:pb-20">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h2 className="text-2xl font-semibold text-slate-950">Noch keine Beiträge veröffentlicht</h2>
            <p className="mt-3 text-slate-600">Schauen Sie bald wieder vorbei.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="relative aspect-video bg-slate-200">
                  {getCoverImageUrl(featured) ? (
                    <img
                      src={getCoverImageUrl(featured)}
                      alt={featured.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#204878] text-white">
                      <span className="text-xl font-semibold">CVolution</span>
                    </div>
                  )}
                </div>
                <article className="flex flex-col justify-between p-7 lg:p-10">
                  <div>
                    <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {formatPostDate(getPostDate(featured))}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {readingTime(featured.content)} Min.
                      </span>
                    </div>
                    <h2 className="text-3xl font-semibold leading-tight text-slate-950 lg:text-4xl">{featured.title}</h2>
                    {featured.excerpt && <p className="mt-5 text-base leading-7 text-slate-600">{featured.excerpt}</p>}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {featured.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </Link>
            )}

            {remainingPosts.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {remainingPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-video bg-slate-200">
                      {getCoverImageUrl(post) ? (
                        <img
                          src={getCoverImageUrl(post)}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#204878] text-white">
                          <span className="font-semibold">CVolution</span>
                        </div>
                      )}
                    </div>
                    <article className="p-6">
                      <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{formatPostDate(getPostDate(post))}</span>
                        <span>{readingTime(post.content)} Min.</span>
                      </div>
                      <h2 className="text-xl font-semibold leading-snug text-slate-950">{post.title}</h2>
                      {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>}
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
