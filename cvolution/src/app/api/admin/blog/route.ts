import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSlug, normalizeTags } from "@/lib/blog-utils";
import { supabaseAdmin } from "../../../../../lib/supabase-server";

type BlogPayload = {
  title?: unknown;
  slug?: unknown;
  excerpt?: unknown;
  content?: unknown;
  coverImageUrl?: unknown;
  coverImagePath?: unknown;
  tags?: unknown;
  isPublished?: unknown;
};

function parseBlogPayload(payload: BlogPayload) {
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const rawSlug = typeof payload.slug === "string" && payload.slug.trim() ? payload.slug : title;
  const slug = createSlug(rawSlug);
  const content = typeof payload.content === "string" ? payload.content.trim() : "";
  const isPublished = typeof payload.isPublished === "boolean" ? payload.isPublished : false;

  if (!title) return { error: "Titel ist erforderlich." };
  if (!slug) return { error: "Slug ist erforderlich." };
  if (!content) return { error: "Inhalt ist erforderlich." };

  return {
    data: {
      title,
      slug,
      excerpt: typeof payload.excerpt === "string" && payload.excerpt.trim() ? payload.excerpt.trim() : null,
      content,
      cover_image_url:
        typeof payload.coverImageUrl === "string" && payload.coverImageUrl.trim()
          ? payload.coverImageUrl.trim()
          : null,
      cover_image_path:
        typeof payload.coverImagePath === "string" && payload.coverImagePath.trim()
          ? payload.coverImagePath.trim()
          : null,
      tags: normalizeTags(payload.tags),
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    },
  };
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin blog list failed", { reason: error.message, admin: admin.email });
    return NextResponse.json({ error: "Blog-Beiträge konnten nicht geladen werden." }, { status: 500 });
  }

  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const parsed = parseBlogPayload(await request.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert(parsed.data)
    .select("*")
    .single();

  if (error) {
    console.error("Admin blog create failed", { reason: error.message, admin: admin.email });
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({ error: status === 409 ? "Dieser Slug existiert bereits." : "Blog-Beitrag konnte nicht erstellt werden." }, { status });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}
