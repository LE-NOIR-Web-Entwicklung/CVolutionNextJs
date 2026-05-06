import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const token = new URL(request.url).searchParams.get("token");
  const { data } = await supabaseAdmin.from("salary_analyses").select("pdf_url,download_token").eq("id", params.id).single();
  if (!data || !token || token !== data.download_token) return NextResponse.json({ error: "Ungültiger Download-Token." }, { status: 403 });
  if (!data.pdf_url) return NextResponse.json({ error: "PDF noch nicht verfügbar." }, { status: 404 });
  return NextResponse.redirect(data.pdf_url);
}
