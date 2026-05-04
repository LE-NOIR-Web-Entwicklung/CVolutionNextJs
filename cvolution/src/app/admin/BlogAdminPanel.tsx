"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Eye, ImageIcon, Plus, Trash2, X } from "lucide-react";
import { adminSupabase as supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { BlogPost } from "@/lib/blog-types";
import { createSlug } from "@/lib/blog-utils";
import { getCoverImageUrl } from "@/lib/blog-display";

const adminEmails = ["jan@cvolution.ch", "armend@cvolution.ch"];
const ADMIN_SESSION_STORAGE_KEY = "cvolution-admin-session";

type BlogFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImagePath: string;
  tags: string;
  isPublished: boolean;
  publishedAt: string;
};

const emptyBlogForm = (): BlogFormState => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  coverImagePath: "",
  tags: "",
  isPublished: false,
  publishedAt: "",
});

function formatDateTime(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("de-CH");
}

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function BlogAdminPanel() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormState>(() => emptyBlogForm());
  const [formError, setFormError] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [posts]
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const ensureAdminSession = async () => {
    const current = await supabase.auth.getSession();
    if (current.data.session) return current;

    const storedSession = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!storedSession) return current;

    try {
      const parsed = JSON.parse(storedSession) as {
        access_token?: string;
        refresh_token?: string;
      };

      if (!parsed.access_token || !parsed.refresh_token) return current;

      await supabase.auth.setSession({
        access_token: parsed.access_token,
        refresh_token: parsed.refresh_token,
      });

      return supabase.auth.getSession();
    } catch {
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      return current;
    }
  };

  const getAdminHeaders = async (contentType: string | null = "application/json"): Promise<Record<string, string>> => {
    const { data } = await ensureAdminSession();
    const token = data.session?.access_token;
    const email = data.session?.user.email?.toLowerCase();

    if (!token || !email || !adminEmails.includes(email)) {
      localStorage.removeItem("admin_logged_in");
      localStorage.removeItem("admin_email");
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      router.push("/admin/login");
      throw new Error("Bitte melden Sie sich erneut als Admin an.");
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    return headers;
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const headers = await getAdminHeaders();
      const res = await fetch("/api/admin/blog", { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Blog-Beiträge konnten nicht geladen werden.");
      setPosts(data.posts || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Blog-Beiträge konnten nicht geladen werden.";
      toast({ title: "Fehler", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const startCreatePost = () => {
    setEditingPostId(null);
    setForm(emptyBlogForm());
    setFormError("");
    setFileInputKey((key) => key + 1);
    setShowForm(true);
  };

  const startEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImageUrl: post.cover_image_url || "",
      coverImagePath: post.cover_image_path || "",
      tags: post.tags.join(", "),
      isPublished: post.is_published,
      publishedAt: toDatetimeLocal(post.published_at),
    });
    setFormError("");
    setFileInputKey((key) => key + 1);
    setShowForm(true);
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Titel ist erforderlich.";
    if (!createSlug(form.slug || form.title)) return "Slug ist erforderlich.";
    if (!form.content.trim()) return "Inhalt ist erforderlich.";
    return "";
  };

  const submitPost = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const headers = await getAdminHeaders();
      const payload = {
        title: form.title,
        slug: form.slug || form.title,
        excerpt: form.excerpt,
        content: form.content,
        coverImageUrl: form.coverImageUrl,
        coverImagePath: form.coverImagePath,
        tags: form.tags,
        isPublished: form.isPublished,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : "",
      };
      const res = await fetch(editingPostId ? `/api/admin/blog/${editingPostId}` : "/api/admin/blog", {
        method: editingPostId ? "PATCH" : "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Blog-Beitrag konnte nicht gespeichert werden.");
      toast({ title: "Gespeichert", description: "Blog-Beitrag wurde gespeichert." });
      setShowForm(false);
      await fetchPosts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Blog-Beitrag konnte nicht gespeichert werden.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const uploadCoverImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setFormError("");
    try {
      const headers = await getAdminHeaders(null);
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/blog/upload", {
        method: "POST",
        headers,
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bild konnte nicht hochgeladen werden.");
      const nextForm = {
        ...form,
        coverImageUrl: data.publicUrl,
        coverImagePath: data.path,
      };
      setForm((current) => ({
        ...current,
        coverImageUrl: data.publicUrl,
        coverImagePath: data.path,
      }));
      setFileInputKey((key) => key + 1);

      if (editingPostId) {
        const saveHeaders = await getAdminHeaders();
        const saveRes = await fetch(`/api/admin/blog/${editingPostId}`, {
          method: "PATCH",
          headers: saveHeaders,
          body: JSON.stringify({
            coverImageUrl: nextForm.coverImageUrl,
            coverImagePath: nextForm.coverImagePath,
          }),
        });
        const saveData = await saveRes.json();
        if (!saveRes.ok) throw new Error(saveData.error || "Bild konnte nicht ersetzt werden.");
        await fetchPosts();
      }

      toast({ title: editingPostId ? "Bild ersetzt" : "Bild hochgeladen", description: editingPostId ? "Das Cover-Bild wurde direkt gespeichert." : "Bitte den Beitrag speichern, um das Bild zu übernehmen." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bild konnte nicht hochgeladen werden.";
      setFormError(message);
    } finally {
      setUploading(false);
    }
  };

  const clearCoverImage = async () => {
    setForm((current) => ({
      ...current,
      coverImageUrl: "",
      coverImagePath: "",
    }));
    setFileInputKey((key) => key + 1);

    if (!editingPostId) return;

    try {
      const headers = await getAdminHeaders();
      const res = await fetch(`/api/admin/blog/${editingPostId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ coverImageUrl: "", coverImagePath: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cover-Bild konnte nicht entfernt werden.");
      await fetchPosts();
      toast({ title: "Bild entfernt", description: "Das Cover-Bild wurde entfernt." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cover-Bild konnte nicht entfernt werden.";
      setFormError(message);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const headers = await getAdminHeaders();
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ isPublished: !post.is_published }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status konnte nicht geändert werden.");
      await fetchPosts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Status konnte nicht geändert werden.";
      toast({ title: "Fehler", description: message, variant: "destructive" });
    }
  };

  const deletePost = async (post: BlogPost) => {
    if (!window.confirm(`Blog-Beitrag "${post.title}" wirklich löschen?`)) return;
    try {
      const headers = await getAdminHeaders();
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Blog-Beitrag konnte nicht gelöscht werden.");
      await fetchPosts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Blog-Beitrag konnte nicht gelöscht werden.";
      toast({ title: "Fehler", description: message, variant: "destructive" });
    }
  };

  return (
    <section>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Blog</h2>
          <p className="text-sm text-gray-600">Beiträge erstellen, Bilder hochladen und Veröffentlichung steuern.</p>
        </div>
        <Button onClick={startCreatePost} className="bg-[#204878] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Beitrag erstellen
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">{editingPostId ? "Blog-Beitrag bearbeiten" : "Blog-Beitrag erstellen"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitPost} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Titel</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-900"
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setForm((current) => ({
                      ...current,
                      title,
                      slug: current.slug ? current.slug : createSlug(title),
                    }));
                  }}
                  placeholder="Lebenslauf optimieren: 7 konkrete Schritte"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Slug</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-900"
                  value={form.slug}
                  onChange={(event) => setForm({ ...form, slug: createSlug(event.target.value) })}
                  placeholder="lebenslauf-optimieren"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-900">Kurzbeschreibung</label>
                <textarea
                  className="min-h-24 w-full rounded-md border px-3 py-2 text-sm text-gray-900"
                  value={form.excerpt}
                  onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
                  placeholder="Ein kurzer Teaser für Übersicht, SEO und Social Previews."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Tags</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-900"
                  value={form.tags}
                  onChange={(event) => setForm({ ...form, tags: event.target.value })}
                  placeholder="Lebenslauf, Bewerbung, Schweiz"
                />
              </div>
              <label className="flex items-center gap-2 pt-6 text-sm font-medium text-gray-900">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) => setForm({ ...form, isPublished: event.target.checked })}
                />
                Veröffentlicht
              </label>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Veröffentlichungsdatum</label>
                <input
                  type="datetime-local"
                  className="w-full rounded-md border px-3 py-2 text-sm text-gray-900"
                  value={form.publishedAt}
                  onChange={(event) => setForm({ ...form, publishedAt: event.target.value })}
                />
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-900">Cover-Bild</label>
                <div className="space-y-3 rounded-md border border-dashed border-gray-300 p-4">
                  {getCoverImageUrl({ cover_image_url: form.coverImageUrl }) && (
                    <div className="aspect-video overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      <img
                        src={getCoverImageUrl({ cover_image_url: form.coverImageUrl })}
                        alt="Cover Vorschau"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                      <ImageIcon className="h-4 w-4" />
                      {uploading ? "Lädt hoch..." : form.coverImageUrl ? "Bild ersetzen" : "Bild auswählen"}
                      <input
                        key={fileInputKey}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={uploading}
                        onChange={(event) => uploadCoverImage(event.target.files?.[0] || null)}
                      />
                    </label>
                    {form.coverImageUrl && (
                      <Button type="button" variant="outline" onClick={clearCoverImage} className="gap-2">
                        <X className="h-4 w-4" />
                        Bild entfernen
                      </Button>
                    )}
                    <span className="text-sm text-gray-500">16:9 empfohlen. JPG, PNG, WebP oder GIF bis 5 MB.</span>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">Cover Image URL</label>
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm text-gray-900"
                      value={form.coverImageUrl}
                      onChange={(event) => setForm({ ...form, coverImageUrl: event.target.value, coverImagePath: "" })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-900">Inhalt</label>
                <textarea
                  className="min-h-[360px] w-full rounded-md border px-3 py-2 font-mono text-sm leading-6 text-gray-900"
                  value={form.content}
                  onChange={(event) => setForm({ ...form, content: event.target.value })}
                  placeholder={"## Abschnitt\n\nFliesstext...\n\n- Aufzählung\n- Zweiter Punkt"}
                />
              </div>
              {formError && (
                <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700 lg:col-span-2">
                  {formError}
                </p>
              )}
              <div className="flex gap-2 lg:col-span-2">
                <Button type="submit" disabled={saving || uploading} className="bg-[#204878] text-white">
                  {saving ? "Speichert..." : "Speichern"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Abbrechen
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white">
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-gray-500">Lade Blog-Beiträge...</p>
          ) : sortedPosts.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">Noch keine Blog-Beiträge erstellt.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-700">
                  <tr>
                    <th className="p-3">Beitrag</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Publiziert</th>
                    <th className="p-3">Aktualisiert</th>
                    <th className="p-3 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPosts.map((post) => (
                    <tr key={post.id} className="border-t align-top">
                      <td className="p-3">
                        <p className="font-semibold text-gray-900">{post.title}</p>
                        <p className="text-xs text-gray-500">/blog/{post.slug}</p>
                        {post.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs text-gray-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={post.is_published ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"}>
                          {post.is_published ? "Veröffentlicht" : "Entwurf"}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-700">{formatDateTime(post.published_at)}</td>
                      <td className="p-3 text-gray-700">{formatDateTime(post.updated_at)}</td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          {post.is_published && (
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => startEditPost(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => togglePublished(post)}>
                            {post.is_published ? "Entwurf" : "Publizieren"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deletePost(post)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
