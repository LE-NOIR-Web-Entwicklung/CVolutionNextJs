import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeCouponCode } from "@/lib/coupons";
import { COUPON_SERVICE_KEYS, isServiceKey } from "@/lib/services";
import { supabaseAdmin } from "../../../../../lib/supabase-server";

type CouponPayload = {
  code?: unknown;
  description?: unknown;
  discountType?: unknown;
  discountValue?: unknown;
  applicableServices?: unknown;
  startsAt?: unknown;
  endsAt?: unknown;
  isActive?: unknown;
  maxRedemptions?: unknown;
  maxRedemptionsPerUser?: unknown;
  minOrderAmount?: unknown;
  campaignTag?: unknown;
};

function getCouponDatabaseErrorMessage(error: { code?: string; message?: string }) {
  const message = error.message || "";
  if (error.code === "23514" && message.includes("coupons_services_check")) {
    return "Die Datenbankmigration für LinkedIn-Coupons fehlt. Bitte Migration 20260529_add_linkedin_service_coupon.sql anwenden.";
  }
  if (error.code === "23505") {
    return "Dieser Coupon Code existiert bereits.";
  }
  return "Coupon konnte nicht erstellt werden.";
}

function parseCouponPayload(payload: CouponPayload) {
  const code = normalizeCouponCode(payload.code);
  const discountType = payload.discountType;
  const applicableServices = Array.isArray(payload.applicableServices)
    ? payload.applicableServices.filter(isServiceKey)
    : [];
  const startsAt = typeof payload.startsAt === "string" ? payload.startsAt : "";
  const endsAt = typeof payload.endsAt === "string" ? payload.endsAt : "";
  const startsDate = new Date(startsAt);
  const endsDate = new Date(endsAt);

  if (!code) return { error: "Coupon Code ist erforderlich." };
  if (discountType !== "percent" && discountType !== "free") return { error: "Ungültige Rabatt-Art." };
  let discountValue = 100;
  if (discountType === "percent") {
    const parsedDiscount = Number(payload.discountValue);
    if (!Number.isFinite(parsedDiscount) || parsedDiscount <= 0 || parsedDiscount > 100) return { error: "Rabattwert muss zwischen 1 und 100 liegen." };
    discountValue = parsedDiscount;
  }
  if (applicableServices.length === 0 || applicableServices.length !== new Set(applicableServices).size) {
    return { error: "Bitte mindestens einen gültigen Service auswählen." };
  }
  if (applicableServices.some((service) => !COUPON_SERVICE_KEYS.includes(service))) {
    return { error: "Ungültige Service-Auswahl." };
  }
  if (Number.isNaN(startsDate.getTime()) || Number.isNaN(endsDate.getTime()) || endsDate <= startsDate) {
    return { error: "Endzeitpunkt muss nach dem Startzeitpunkt liegen." };
  }
  return {
    data: {
      code,
      description: typeof payload.description === "string" && payload.description.trim() ? payload.description.trim() : null,
      discount_type: discountType,
      discount_value: discountValue,
      applicable_services: applicableServices,
      starts_at: startsDate.toISOString(),
      ends_at: endsDate.toISOString(),
      is_active: typeof payload.isActive === "boolean" ? payload.isActive : true,
      max_redemptions: Number.isFinite(Number(payload.maxRedemptions)) ? Number(payload.maxRedemptions) : null,
      max_redemptions_per_user: Number.isFinite(Number(payload.maxRedemptionsPerUser)) ? Number(payload.maxRedemptionsPerUser) : null,
      min_order_amount: Number.isFinite(Number(payload.minOrderAmount)) ? Number(payload.minOrderAmount) : null,
      campaign_tag: typeof payload.campaignTag === "string" && payload.campaignTag.trim() ? payload.campaignTag.trim() : null,
    },
  };
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin coupon list failed", { reason: error.message });
    return NextResponse.json({ error: "Coupons konnten nicht geladen werden." }, { status: 500 });
  }

  return NextResponse.json({ coupons: data ?? [] });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const parsed = parseCouponPayload(await request.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("coupons")
    .insert(parsed.data)
    .select("*")
    .single();

  if (error) {
    console.error("Admin coupon create failed", { reason: error.message, admin: admin.email });
    return NextResponse.json({ error: getCouponDatabaseErrorMessage(error) }, { status: 500 });
  }

  return NextResponse.json({ coupon: data }, { status: 201 });
}
