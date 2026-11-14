/**
 * Permanent redirects for renamed blog posts.
 *
 * Workflow when renaming a slug:
 *   1. Add { from: old slug, to: new slug } below and deploy.
 *   2. Change the slug (and title/excerpt) of the post in the admin panel (blog_posts.slug).
 * The order does not matter: /blog/[slug] only redirects once a published post with the new
 * slug exists, so until the rename the old URL keeps serving the post. Afterwards it answers
 * with 308 and Google moves its signals to the new URL.
 * Slugs: lowercase, 3–5 words, umlauts as ae/oe/ue, no dates or filler words.
 */
export const BLOG_SLUG_REDIRECTS: { from: string; to: string }[] = [
  // SEO-Plan D4 (renamed by search intent)
  { from: "wie-du-als-kandidat-bei-einem-unternehmer-punkten-kannst-interview-mit-patrick-mollet", to: "bewerbung-kmu-tipps" },
  { from: "motivationsschreiben-ein-relikt-vergangener-tage-oder-ein-gamechanger", to: "braucht-es-noch-ein-motivationsschreiben" },
  { from: "bewirb-dich-nicht-jetzt-die-richtige-bewerbungsstrategie", to: "bewerbungsstrategie" },
  { from: "warum-gute-kandidaten-trotzdem-absagen-erhalten", to: "absage-trotz-qualifikation" },
  { from: "wie-viel-verdient-man-als", to: "lohn-nach-beruf-schweiz" },
  { from: "die-reise-der-lohntransparenz", to: "lohntransparenz-schweiz" },
  { from: "der-perfekte-nebenjob", to: "nebenjob-schweiz" },
];

export function blogRedirectTarget(slug: string) {
  return BLOG_SLUG_REDIRECTS.find((entry) => entry.from === slug)?.to;
}
