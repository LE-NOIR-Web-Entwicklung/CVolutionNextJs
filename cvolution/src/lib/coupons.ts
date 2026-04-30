import { supabaseAdmin } from "../../lib/supabase-server";
import { getServiceConfig, isServiceKey, type ServiceKey } from "./services";

export type CouponDiscountType = "percent" | "free";
export type CouponStatus = "active" | "inactive" | "scheduled" | "expired";
export type CouponInvalidReason =
  | "not_found"
  | "inactive"
  | "not_started"
  | "expired"
  | "service_not_allowed";

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: CouponDiscountType;
  discount_value: number | null;
  applicable_services: ServiceKey[];
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  redemption_count: number;
  created_at: string;
  updated_at: string;
}

export type CouponValidationResult =
  | { valid: true; coupon: Coupon }
  | { valid: false; reason: CouponInvalidReason };

export function normalizeCouponCode(code: unknown): string {
  return typeof code === "string" ? code.trim().toUpperCase() : "";
}

export function getCouponStatus(coupon: Pick<Coupon, "is_active" | "starts_at" | "ends_at">, now = new Date()): CouponStatus {
  if (!coupon.is_active) return "inactive";
  if (now < new Date(coupon.starts_at)) return "scheduled";
  if (now > new Date(coupon.ends_at)) return "expired";
  return "active";
}

export function calculateDiscountedPrice(originalPrice: number, coupon: Pick<Coupon, "discount_type" | "discount_value"> | null): number {
  if (!coupon) return originalPrice;
  if (coupon.discount_type === "free") return 0;
  const discountValue = Number(coupon.discount_value ?? 0);
  const finalPrice = originalPrice * (1 - discountValue / 100);
  return Math.max(0, Math.round(finalPrice * 100) / 100);
}

export function getDiscountPercent(coupon: Pick<Coupon, "discount_type" | "discount_value"> | null): number | null {
  if (!coupon) return null;
  if (coupon.discount_type === "free") return 100;
  return Number(coupon.discount_value ?? 0);
}

export async function validateCouponForService(code: unknown, serviceKeyOrType: unknown): Promise<CouponValidationResult> {
  const normalizedCode = normalizeCouponCode(code);
  if (!normalizedCode) return { valid: false, reason: "not_found" };

  const config = getServiceConfig(serviceKeyOrType);
  const couponServiceKey = config?.couponServiceKey ?? (isServiceKey(serviceKeyOrType) ? serviceKeyOrType : null);
  if (!couponServiceKey) return { valid: false, reason: "service_not_allowed" };

  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (error) {
    console.error("Coupon lookup failed", { code: normalizedCode, reason: error.message });
    return { valid: false, reason: "not_found" };
  }
  if (!data) {
    console.warn("Invalid coupon attempt", { code: normalizedCode, service: couponServiceKey, reason: "not_found" });
    return { valid: false, reason: "not_found" };
  }

  const coupon = data as Coupon;
  if (!coupon.applicable_services.includes(couponServiceKey)) {
    console.warn("Invalid coupon attempt", { code: normalizedCode, service: couponServiceKey, reason: "service_not_allowed" });
    return { valid: false, reason: "service_not_allowed" };
  }

  const status = getCouponStatus(coupon);
  if (status === "inactive") return { valid: false, reason: "inactive" };
  if (status === "scheduled") return { valid: false, reason: "not_started" };
  if (status === "expired") return { valid: false, reason: "expired" };
  return { valid: true, coupon };
}

export async function redeemCouponSafely(couponId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc("redeem_coupon", { coupon_id: couponId });
  if (error) {
    console.error("Coupon redemption failed", { couponId, reason: error.message });
    return false;
  }
  return data === true;
}
