import type { BlogPost } from "./blog-types";

export function getPostDate(post: BlogPost) {
  return post.published_at || post.created_at;
}

export function formatPostDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function getCoverImageUrl(post: Pick<BlogPost, "cover_image_url">) {
  const url = post.cover_image_url?.trim();
  if (!url || url.toLowerCase() === "empty" || url.toLowerCase() === "null") return "";
  return url;
}

