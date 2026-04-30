import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeCouponCode } from "@/lib/coupons";
import { COUPON_SERVICE_KEYS, isServiceKey } from "@/lib/services";
import { supabaseAdmin } from "../../../../../lib/supabase-server";

const FIXED_PERCENT_DISCOUNT = 30;

type CouponPayload = {
  code?: unknown;
  description?: unknown;
  discountType?: unknown;
  discountValue?: unknown;
  applicableServices?: unknown;
  startsAt?: unknown;
  endsAt?: unknown;
  isActive?: unknown;
};

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
    discountValue = FIXED_PERCENT_DISCOUNT;
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
    return NextResponse.json({ error: "Coupon konnte nicht erstellt werden." }, { status: 500 });
  }

  return NextResponse.json({ coupon: data }, { status: 201 });
}
