import { NextRequest } from "next/server";
import { supabaseAdmin } from "../../lib/supabase-server";

const ADMIN_EMAILS = ["jan@cvolution.ch", "armend@cvolution.ch"];

export async function requireAdmin(request: NextRequest): Promise<{ ok: true; email: string } | { ok: false; status: number; error: string }> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  if (!token) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  const email = data.user?.email?.toLowerCase();

  if (error || !email) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  if (!ADMIN_EMAILS.includes(email)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, email };
}
