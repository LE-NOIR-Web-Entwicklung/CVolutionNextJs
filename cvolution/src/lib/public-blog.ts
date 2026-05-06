import type { BlogPost } from "./blog-types";
import { getSupabasePublishableKey, getSupabaseUrl } from "./supabase-env";

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_PUBLISHABLE_KEY = getSupabasePublishableKey();
const BLOG_QUERY_TIMEOUT_MS = 5000;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn("Public blog ENV fehlt: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (oder Legacy ANON). Blog API kann fehlschlagen.");
}

async function fetchBlogRows(path: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BLOG_QUERY_TIMEOUT_MS);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
      next: { revalidate: 300 },
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error("Public blog fetch failed", { status: res.status, statusText: res.statusText });
      return [];
    }

    return (await res.json()) as BlogPost[];
  } catch (error) {
    console.error("Public blog fetch unavailable", { reason: error instanceof Error ? error.message : String(error) });
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function getPublishedBlogPosts() {
  const query = new URLSearchParams({
    select: "*",
    is_published: "eq.true",
    order: "published_at.desc.nullslast,created_at.desc",
  });

  return fetchBlogRows(`blog_posts?${query.toString()}`);
}

export async function getPublishedBlogPost(slug: string) {
  const query = new URLSearchParams({
    select: "*",
    slug: `eq.${slug}`,
    is_published: "eq.true",
    limit: "1",
  });
  const rows = await fetchBlogRows(`blog_posts?${query.toString()}`);
  return rows[0] || null;
}
