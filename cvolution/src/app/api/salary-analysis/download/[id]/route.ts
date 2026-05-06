import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const token = request.nextUrl.searchParams.get("token");

  const { data } = await supabaseAdmin
    .from("salary_analyses")
    .select("pdf_url,download_token")
    .eq("id", id)
    .single();

  if (!data || !token || token !== data.download_token) {
    return NextResponse.json({ error: "Ungültiger Download-Token." }, { status: 403 });
  }

  if (!data.pdf_url) {
    return NextResponse.json({ error: "PDF noch nicht verfügbar." }, { status: 404 });
  }

  return NextResponse.redirect(data.pdf_url);
}
