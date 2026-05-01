import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "../../../../../lib/supabase-server";

const orderSelect = `
  id,
  name,
  first_name,
  last_name,
  email,
  service_type,
  service_label,
  original_price,
  final_price,
  payment_status,
  status,
  coupon_code,
  coupon_discount_type,
  coupon_discount_value,
  is_external,
  external_source,
  cv_file_name,
  salary_file_name,
  linkedin_url,
  remarks,
  created_at,
  paid_at,
  processed_at
`;

const orderSelectWithoutExternalColumns = `
  id,
  name,
  first_name,
  last_name,
  email,
  service_type,
  service_label,
  original_price,
  final_price,
  payment_status,
  status,
  coupon_code,
  coupon_discount_type,
  coupon_discount_value,
  cv_file_name,
  salary_file_name,
  linkedin_url,
  remarks,
  created_at,
  paid_at,
  processed_at
`;

function isMissingExternalOrderColumnError(error: unknown) {
  const errorText = JSON.stringify(error).toLowerCase();
  return errorText.includes("is_external") || errorText.includes("external_source");
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  let { data, error } = await supabaseAdmin
    .from("orders")
    .select(orderSelect)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error && isMissingExternalOrderColumnError(error)) {
    const fallback = await supabaseAdmin
      .from("orders")
      .select(orderSelectWithoutExternalColumns)
      .order("created_at", { ascending: false })
      .limit(200);

    data = fallback.data?.map((order) => ({
      ...order,
      is_external: typeof order.remarks === "string" && order.remarks.startsWith("[external_order]"),
      external_source: null,
    })) ?? null;
    error = fallback.error;
  }

  if (error) {
    console.error("Admin order list failed", { reason: error.message, admin: admin.email });
    return NextResponse.json({ error: "Bestellungen konnten nicht geladen werden." }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
