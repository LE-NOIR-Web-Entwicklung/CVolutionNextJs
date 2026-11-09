import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BlogPostExplorer } from "@/app/blog/BlogPostExplorer";
import { getPublishedBlogPosts } from "@/lib/public-blog";

export const metadata: Metadata = {
  title: "Blog | CVolution",
  description: "Ratgeber, Vorlagen und konkrete Tipps rund um Bewerbung, Lebenslauf, Lohn und Karriere in der Schweiz.",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-950">
      <section className="relative isolate bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)] px-5 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-14">

        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-[#204878]/15 bg-white/70 px-3 py-1 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
                CVolution Blog
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] text-[#101828] text-balance sm:text-5xl lg:text-6xl">
                Karriere aus erster Hand
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#4f5d72] text-pretty sm:text-lg sm:leading-8">
                Praxisnahe Einblicke in Recruiting, Löhne und Bewerbungen für den Schweizer Arbeitsmarkt, mit konkreten Tipps für klarere Unterlagen und bessere Entscheidungen.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="https://www.linkedin.com/newsletters/karriere-aus-erster-hand-7401807449113972736/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-[#204878] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#204878]/15 transition hover:-translate-y-0.5 hover:bg-[#173d66] active:translate-y-0"
              >
                Newsletter abonnieren
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-6 pb-16 lg:mt-12 lg:pb-20">
        <BlogPostExplorer posts={posts} />
      </section>
    </main>
  );
}
