import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { GUIDES, PAGE_META, isHiddenPath, type PagePath } from "@/lib/seo-pages";
import { getPublishedBlogPosts } from "@/lib/public-blog";
import { SALARY_JOBS } from "@/lib/salary-jobs";

// Rebuilt at most once per hour so new blog posts show up without a deploy.
export const revalidate = 3600;

const PRIORITY: Partial<Record<PagePath, number>> = {
  "/": 1.0,
  "/service-salary": 0.95,
  "/service": 0.9,
  "/service-cv": 0.9,
  "/service-motivation": 0.85,
  "/service-career": 0.85,
  "/service-linkedin": 0.85,
  "/service-check": 0.85,
  "/service-rav": 0.8,
  "/service-downloads": 0.8,
  "/self": 0.85,
  "/blog": 0.7,
  "/about": 0.5,
  "/team": 0.4,
  "/contact": 0.5,
  "/agb": 0.2,
  "/impressum": 0.2,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const guidePaths = new Set<string>(GUIDES.map((guide) => guide.path));

  const pages: MetadataRoute.Sitemap = (Object.keys(PAGE_META) as PagePath[]).filter((path) => !isHiddenPath(path)).map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/blog" ? "weekly" : guidePaths.has(path) ? "monthly" : "monthly",
    priority: PRIORITY[path] ?? (guidePaths.has(path) ? 0.75 : 0.6),
  }));

  const jobs: MetadataRoute.Sitemap = SALARY_JOBS.map((job) => ({
    url: `${SITE_URL}/lohn/${job.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const posts = await getPublishedBlogPosts();
  const blog: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at || post.created_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...jobs, ...blog];
}
