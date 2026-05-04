import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSlug, normalizeTags } from "@/lib/blog-utils";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";

type BlogPayload = {
  title?: unknown;
  slug?: unknown;
  excerpt?: unknown;
  content?: unknown;
  coverImageUrl?: unknown;
  coverImagePath?: unknown;
  tags?: unknown;
  isPublished?: unknown;
  publishedAt?: unknown;
};

function parseBlogPatch(payload: BlogPayload) {
  const data: Record<string, unknown> = {};

  if (typeof payload.title === "string") {
    const title = payload.title.trim();
    if (!title) return { error: "Titel ist erforderlich." };
    data.title = title;
  }

  if (typeof payload.slug === "string") {
    const slug = createSlug(payload.slug);
    if (!slug) return { error: "Slug ist erforderlich." };
    data.slug = slug;
  }

  if (typeof payload.excerpt === "string") data.excerpt = payload.excerpt.trim() || null;
  if (typeof payload.content === "string") {
    const content = payload.content.trim();
    if (!content) return { error: "Inhalt ist erforderlich." };
    data.content = content;
  }
  if (typeof payload.coverImageUrl === "string") data.cover_image_url = payload.coverImageUrl.trim() || null;
  if (typeof payload.coverImagePath === "string") data.cover_image_path = payload.coverImagePath.trim() || null;
  if (payload.tags !== undefined) data.tags = normalizeTags(payload.tags);
  if (payload.publishedAt !== undefined) {
    if (typeof payload.publishedAt !== "string" || !payload.publishedAt.trim()) {
      data.published_at = null;
    } else {
      const publishedAt = new Date(payload.publishedAt);
      if (Number.isNaN(publishedAt.getTime())) return { error: "Ungültiges Veröffentlichungsdatum." };
      data.published_at = publishedAt.toISOString();
    }
  }
  if (typeof payload.isPublished === "boolean") {
    data.is_published = payload.isPublished;
    if (payload.isPublished && !data.published_at) data.published_at = new Date().toISOString();
  }

  return { data };
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { id } = await params;
  const parsed = parseBlogPatch(await request.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const shouldReplaceCover = Object.prototype.hasOwnProperty.call(parsed.data, "cover_image_path");
  const { data: existingPost } = shouldReplaceCover
    ? await supabaseAdmin.from("blog_posts").select("cover_image_path").eq("id", id).maybeSingle()
    : { data: null };

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Admin blog update failed", { reason: error.message, admin: admin.email, id });
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({ error: status === 409 ? "Dieser Slug existiert bereits." : "Blog-Beitrag konnte nicht gespeichert werden." }, { status });
  }

  if (
    shouldReplaceCover &&
    existingPost?.cover_image_path &&
    existingPost.cover_image_path !== data.cover_image_path
  ) {
    await supabaseAdmin.storage.from("blog-images").remove([existingPost.cover_image_path]);
  }

  return NextResponse.json({ post: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { id } = await params;
  const { data: post } = await supabaseAdmin
    .from("blog_posts")
    .select("cover_image_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
  if (error) {
    console.error("Admin blog delete failed", { reason: error.message, admin: admin.email, id });
    return NextResponse.json({ error: "Blog-Beitrag konnte nicht gelöscht werden." }, { status: 500 });
  }

  if (post?.cover_image_path) {
    await supabaseAdmin.storage.from("blog-images").remove([post.cover_image_path]);
  }

  return NextResponse.json({ ok: true });
}
