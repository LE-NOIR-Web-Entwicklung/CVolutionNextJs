import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSlug } from "@/lib/blog-utils";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Bitte ein Bild auswählen." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Erlaubt sind JPG, PNG, WebP oder GIF." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Das Bild darf maximal 5 MB gross sein." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = createSlug(file.name.replace(/\.[^.]+$/, "")) || "blog-bild";
  const path = `${new Date().toISOString().slice(0, 10)}/${baseName}-${crypto.randomUUID()}.${extension}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from("blog-images")
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Admin blog image upload failed", { reason: error.message, admin: admin.email });
    return NextResponse.json({ error: "Bild konnte nicht hochgeladen werden." }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from("blog-images").getPublicUrl(path);

  return NextResponse.json({ path, publicUrl: data.publicUrl });
}
