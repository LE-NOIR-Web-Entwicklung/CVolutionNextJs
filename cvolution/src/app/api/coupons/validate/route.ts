import { NextRequest, NextResponse } from "next/server";
import { getDiscountPercent, validateCouponForService } from "@/lib/coupons";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await validateCouponForService(body.code, body.serviceType);

    if (!result.valid) {
      return NextResponse.json({ valid: false, reason: result.reason });
    }

    return NextResponse.json({
      valid: true,
      code: result.coupon.code,
      discountType: result.coupon.discount_type,
      discountValue: getDiscountPercent(result.coupon),
    });
  } catch (error) {
    console.error("Coupon validation route failed", error);
    return NextResponse.json({ valid: false, reason: "not_found" }, { status: 400 });
  }
}
