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
  const search = request.nextUrl.searchParams.get("search")?.trim();
  const dateFrom = request.nextUrl.searchParams.get("dateFrom");
  const dateTo = request.nextUrl.searchParams.get("dateTo");
  const page = Math.max(Number(request.nextUrl.searchParams.get("page") || "1"), 1);
  const pageSize = Math.min(Math.max(Number(request.nextUrl.searchParams.get("pageSize") || "20"), 1), 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const applySharedFilters = (
    query: any,
    options?: { includePaymentStatus?: boolean },
  ) => {
    const includePaymentStatus = options?.includePaymentStatus ?? true;

    if (includePaymentStatus && paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus);
    }

    if (isExternal === "true") {
      query = query.eq("is_external", true);
    } else if (isExternal === "false") {
      query = query.or("is_external.is.null,is_external.eq.false");
    }
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,coupon_code.ilike.%${search}%`);
    }
    if (dateFrom) query = query.gte("created_at", new Date(`${dateFrom}T00:00:00.000Z`).toISOString());
    if (dateTo) query = query.lte("created_at", new Date(`${dateTo}T23:59:59.999Z`).toISOString());
    return query;
  };

  const buildBaseQuery = (selectColumns: string) => {
    let query = supabaseAdmin
      .from("orders")
      .select(selectColumns, { count: "exact" })
      .order("created_at", { ascending: false });
    query = applySharedFilters(query, { includePaymentStatus: true });
    return query.range(from, to);
  };

  const initialResult = await buildBaseQuery(orderSelect);
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

  const [paidCountResult, pendingCountResult] = await Promise.all([
    applySharedFilters(
      supabaseAdmin.from("orders").select("id", { count: "exact", head: true }).in("payment_status", ["paid", "free_coupon"]),
      { includePaymentStatus: false },
    ),
    applySharedFilters(
      supabaseAdmin.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "pending"),
      { includePaymentStatus: false },
    ),
  ]);

  return NextResponse.json({
    orders: data ?? [],
    total: initialResult.count ?? (data?.length ?? 0),
    summary: {
      paid: paidCountResult.count ?? 0,
      pending: pendingCountResult.count ?? 0,
    },
    page,
    pageSize,
  });
}
