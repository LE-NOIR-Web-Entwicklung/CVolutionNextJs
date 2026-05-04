import { supabaseAdmin } from "../../lib/supabase-server";
import type { BlogPost } from "./blog-types";

const BLOG_QUERY_TIMEOUT_MS = 5000;

function withTimeout<T>(promise: PromiseLike<T>, fallback: T, label: string) {
  let timeout: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<T>((resolve) => {
    timeout = setTimeout(() => {
      console.error(`${label} timed out after ${BLOG_QUERY_TIMEOUT_MS}ms`);
      resolve(fallback);
    }, BLOG_QUERY_TIMEOUT_MS);
  });

  return Promise.race([Promise.resolve(promise), timeoutPromise]).finally(() => {
    clearTimeout(timeout);
  });
}

export async function getPublishedBlogPosts() {
  const { data, error } = await withTimeout(
    supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    { data: [], error: null, count: null, status: 200, statusText: "timeout fallback" },
    "Published blog list"
  );

  if (error) {
    console.error("Published blog list failed", { reason: error.message });
    return [];
  }

  return (data ?? []) as BlogPost[];
}

export async function getPublishedBlogPost(slug: string) {
  const { data, error } = await withTimeout(
    supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle(),
    { data: null, error: null, count: null, status: 200, statusText: "timeout fallback" },
    `Published blog detail ${slug}`
  );

  if (error) {
    console.error("Published blog detail failed", { slug, reason: error.message });
    return null;
  }

  return data as BlogPost | null;
}
