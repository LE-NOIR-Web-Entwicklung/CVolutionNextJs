import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Clock, Tag } from "lucide-react";
import { getPublishedBlogPosts } from "@/lib/public-blog";

export const metadata: Metadata = {
  title: "Blog | CVolution",
  description: "Ratgeber, Vorlagen und konkrete Tipps rund um Bewerbung, Lebenslauf, Lohn und Karriere in der Schweiz.",
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const featured = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:py-20">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#204878]">CVolution Blog</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
              Karrierewissen, das Bewerbungen besser macht.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Praxisnahe Beiträge für Lebenslauf, Motivationsschreiben, Lohnverhandlung und Jobsuche in der Schweiz.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
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
                <div className="relative min-h-[320px] bg-slate-200">
                  {featured.cover_image_url ? (
                    <Image
                      src={featured.cover_image_url}
                      alt={featured.title}
                      fill
                      sizes="(min-width: 1024px) 52vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      priority
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
                        {formatDate(featured.published_at || featured.created_at)}
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
                    <div className="relative aspect-[16/10] bg-slate-200">
                      {post.cover_image_url ? (
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#204878] text-white">
                          <span className="font-semibold">CVolution</span>
                        </div>
                      )}
                    </div>
                    <article className="p-6">
                      <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{formatDate(post.published_at || post.created_at)}</span>
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
