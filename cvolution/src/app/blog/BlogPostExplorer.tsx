"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Clock, Search, Tag } from "lucide-react";
import type { BlogPost } from "@/lib/blog-types";
import { formatPostDate, getCoverImageUrl, getPostDate } from "@/lib/blog-display";

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function normalizeSearchValue(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getSearchText(post: BlogPost) {
  return normalizeSearchValue(
    [
      post.title,
      post.slug,
      post.excerpt || "",
      post.content,
      formatPostDate(getPostDate(post)),
      ...(post.tags || []),
    ].join(" ")
  );
}

type BlogPostExplorerProps = {
  posts: BlogPost[];
};

export function BlogPostExplorer({ posts }: BlogPostExplorerProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearchValue(query.trim());
  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts;
    return posts.filter((post) => getSearchText(post).includes(normalizedQuery));
  }, [normalizedQuery, posts]);
  const featured = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <h2 className="text-2xl font-semibold text-slate-950">Noch keine Beiträge veröffentlicht</h2>
        <p className="mt-3 text-slate-600">Schauen Sie bald wieder vorbei.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-stretch gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-end">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Blog durchsuchen"
            aria-label="Blog durchsuchen"
            className="w-full rounded-lg border border-slate-200 bg-transparent py-2.5 pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#204878] focus:bg-white focus:ring-3 focus:ring-[#204878]/8"
          />
        </div>
        {query.trim() && (
          <p className="text-sm text-slate-500">
            {filteredPosts.length} {filteredPosts.length === 1 ? "Beitrag" : "Beiträge"} gefunden
          </p>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold text-slate-950">Keine passenden Beiträge gefunden</h2>
          <p className="mt-3 text-slate-600">Versuchen Sie einen anderen Suchbegriff.</p>
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
                  {(featured.tags || []).map((tag) => (
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
    </div>
  );
}
