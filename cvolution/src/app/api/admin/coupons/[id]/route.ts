import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeCouponCode } from "@/lib/coupons";
import { isServiceKey } from "@/lib/services";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";

type Params = { params: Promise<{ id: string }> };

function getCouponDatabaseErrorMessage(error: { code?: string; message?: string }) {
  const message = error.message || "";
  if (error.code === "23514" && message.includes("coupons_services_check")) {
    return "Die Datenbankmigration für LinkedIn-Coupons fehlt. Bitte Migration 20260529_add_linkedin_service_coupon.sql anwenden.";
  }
  if (error.code === "23505") {
    return "Dieser Coupon Code existiert bereits.";
  }
  return "Coupon konnte nicht aktualisiert werden.";
}

function parsePatchPayload(payload: Record<string, unknown>) {
  const update: Record<string, unknown> = {};

  if ("code" in payload) {
    const code = normalizeCouponCode(payload.code);
    if (!code) return { error: "Coupon Code ist erforderlich." };
    update.code = code;
  }
  if ("description" in payload) {
    update.description = typeof payload.description === "string" && payload.description.trim() ? payload.description.trim() : null;
  }
  if ("discountType" in payload) {
    if (payload.discountType !== "percent" && payload.discountType !== "free") return { error: "Ungültige Rabatt-Art." };
    update.discount_type = payload.discountType;
    if (payload.discountType === "free") update.discount_value = 100;
  }
  if ("discountValue" in payload) {
    if (update.discount_type === "percent") {
      const discountValue = Number(payload.discountValue);
      if (!Number.isFinite(discountValue) || discountValue <= 0 || discountValue > 100) return { error: "Rabattwert muss zwischen 1 und 100 liegen." };
      update.discount_value = discountValue;
    } else if (update.discount_type === "free") {
      update.discount_value = 100;
    }
  }
  if ("applicableServices" in payload) {
    const services = Array.isArray(payload.applicableServices) ? payload.applicableServices.filter(isServiceKey) : [];
    if (services.length === 0 || services.length !== new Set(services).size) {
      return { error: "Bitte mindestens einen gültigen Service auswählen." };
    }
    update.applicable_services = services;
  }
  if ("startsAt" in payload) {
    const startsAt = typeof payload.startsAt === "string" ? new Date(payload.startsAt) : new Date("invalid");
    if (Number.isNaN(startsAt.getTime())) return { error: "Ungültiges Startdatum." };
    update.starts_at = startsAt.toISOString();
  }
  if ("endsAt" in payload) {
    const endsAt = typeof payload.endsAt === "string" ? new Date(payload.endsAt) : new Date("invalid");
    if (Number.isNaN(endsAt.getTime())) return { error: "Ungültiges Enddatum." };
    update.ends_at = endsAt.toISOString();
  }
  if ("isActive" in payload) {
    update.is_active = payload.isActive === true;
  }
  if ("maxRedemptions" in payload) update.max_redemptions = Number.isFinite(Number(payload.maxRedemptions)) ? Number(payload.maxRedemptions) : null;
  if ("maxRedemptionsPerUser" in payload) update.max_redemptions_per_user = Number.isFinite(Number(payload.maxRedemptionsPerUser)) ? Number(payload.maxRedemptionsPerUser) : null;
  if ("minOrderAmount" in payload) update.min_order_amount = Number.isFinite(Number(payload.minOrderAmount)) ? Number(payload.minOrderAmount) : null;
  if ("campaignTag" in payload) update.campaign_tag = typeof payload.campaignTag === "string" && payload.campaignTag.trim() ? payload.campaignTag.trim() : null;
  update.updated_at = new Date().toISOString();
  return { data: update };
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { id } = await params;
  const parsed = parsePatchPayload(await request.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("coupons")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Admin coupon update failed", { id, reason: error.message, admin: admin.email });
    return NextResponse.json({ error: getCouponDatabaseErrorMessage(error) }, { status: 500 });
  }

  return NextResponse.json({ coupon: data });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { id } = await params;
  const { error: unlinkError } = await supabaseAdmin
    .from("orders")
    .update({ coupon_id: null })
    .eq("coupon_id", id);

  if (unlinkError) {
    console.error("Admin coupon unlink failed", { id, reason: unlinkError.message, admin: admin.email });
    return NextResponse.json({ error: "Coupon konnte nicht von bestehenden Bestellungen gelöst werden." }, { status: 500 });
  }

  const { error } = await supabaseAdmin.from("coupons").delete().eq("id", id);

  if (error) {
    console.error("Admin coupon delete failed", { id, reason: error.message, admin: admin.email });
    return NextResponse.json({ error: "Coupon konnte nicht gelöscht werden." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
