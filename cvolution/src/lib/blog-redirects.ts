/**
 * Permanent redirects for renamed blog posts.
 *
 * Workflow when shortening a slug in the admin panel:
 *   1. Change the slug of the post in Supabase (blog_posts.slug).
 *   2. Add { from: old slug, to: new slug } below and deploy.
 * The old URL then answers with 308 and Google moves its signals to the new URL.
 * Slugs: lowercase, 3–5 words, umlauts as ae/oe/ue, no dates or filler words.
 */
export const BLOG_SLUG_REDIRECTS: { from: string; to: string }[] = [
  // { from: "so-schreiben-sie-in-10-schritten-das-perfekte-motivationsschreiben-fuer-die-schweiz", to: "motivationsschreiben-schweiz" },
];
