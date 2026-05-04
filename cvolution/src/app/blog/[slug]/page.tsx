import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/public-blog";
import { formatPostDate, getCoverImageUrl, getPostDate } from "@/lib/blog-display";

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function renderContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      if (block.startsWith("### ")) {
        return (
          <h3 key={index} className="mt-10 text-2xl font-semibold text-slate-950">
            {block.replace(/^###\s+/, "")}
          </h3>
        );
      }

      if (block.startsWith("## ")) {
        return (
          <h2 key={index} className="mt-12 text-3xl font-semibold text-slate-950">
            {block.replace(/^##\s+/, "")}
          </h2>
        );
      }

      if (block.startsWith("- ")) {
        const items = block.split("\n").map((item) => item.replace(/^-\s+/, "").trim()).filter(Boolean);
        return (
          <ul key={index} className="my-7 list-disc space-y-3 pl-6 text-lg leading-8 text-slate-700">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={index} className="text-lg leading-8 text-slate-700">
          {block}
        </p>
      );
    });
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | CVolution Blog`,
    description: post.excerpt || "CVolution Blogbeitrag rund um Bewerbung und Karriere.",
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: getCoverImageUrl(post) ? [getCoverImageUrl(post)] : undefined,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <article>
        <header className="border-b border-slate-200 bg-[#f7f9fc]">
          <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#204878] hover:text-[#16375f]">
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Blog
            </Link>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formatPostDate(getPostDate(post))}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readingTime(post.content)} Min. Lesezeit
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">{post.title}</h1>
            {post.excerpt && <p className="mt-6 text-xl leading-8 text-slate-600">{post.excerpt}</p>}
            {post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {getCoverImageUrl(post) && (
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-200">
              <img
                src={getCoverImageUrl(post)}
                alt={post.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#204878] shadow-sm">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatPostDate(getPostDate(post))}
              </span>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl space-y-7 px-6 pb-20 pt-4">
          {renderContent(post.content)}
        </div>
      </article>
    </main>
  );
}
