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

  const paymentStatus = request.nextUrl.searchParams.get("paymentStatus");
  const isExternal = request.nextUrl.searchParams.get("isExternal");

  const buildBaseQuery = (selectColumns: string) => {
    let query = supabaseAdmin
      .from("orders")
      .select(selectColumns)
      .order("created_at", { ascending: false });

    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus);
    }

    if (isExternal === "true") {
      query = query.eq("is_external", true);
    } else if (isExternal === "false") {
      query = query.or("is_external.is.null,is_external.eq.false");
    }

    return query;
  };

  let initialResult = await buildBaseQuery(orderSelect);
  let data = initialResult.data as Record<string, unknown>[] | null;
  let error = initialResult.error;

  if (error && isMissingExternalOrderColumnError(error)) {
    const fallback = await buildBaseQuery(orderSelectWithoutExternalColumns);
    const fallbackData = fallback.data as Record<string, unknown>[] | null;

    data = fallbackData?.map((order) => {
      const normalizedOrder = (order ?? {}) as Record<string, unknown> & { remarks?: unknown };
      return {
        ...normalizedOrder,
        is_external: typeof normalizedOrder.remarks === "string" && normalizedOrder.remarks.startsWith("[external_order]"),
        external_source: null,
      };
    }) ?? null;
    error = fallback.error;
  }

  if (error) {
    console.error("Admin order list failed", { reason: error.message, admin: admin.email });
    return NextResponse.json({ error: "Bestellungen konnten nicht geladen werden." }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
