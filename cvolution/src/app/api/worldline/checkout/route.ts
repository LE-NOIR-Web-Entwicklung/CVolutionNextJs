import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase-server";
import {
  calculateDiscountedPrice,
  getDiscountPercent,
  redeemCouponSafely,
  validateCouponForService,
  type Coupon,
} from "@/lib/coupons";
import {
  getCheckDocumentLabels,
  normalizeCheckDocumentSelections,
} from "@/lib/check-service";
import { getSaferpayShopReference } from "@/lib/saferpay";
import { getShopProduct } from "@/lib/shop";
import { initializeWorldlineCheckout } from "@/lib/worldline-checkout";
import { processPaidCart } from "@/lib/order-processing";

const CONTACT_PHONE_REMARKS_PREFIX = "[contact_phone]";

type CheckoutItemInput = {
  serviceType?: unknown;
  quantity?: unknown;
  remarks?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  birthDate?: unknown;
  workLocation?: unknown;
  grossAnnualSalary?: unknown;
  fringeBenefits?: unknown;
  linkedinUrl?: unknown;
  salaryFileBase64?: unknown;
  salaryFileName?: unknown;
  cvFileBase64?: unknown;
  cvFileName?: unknown;
  checkSelections?: unknown;
  checkFiles?: unknown;
};

type UploadedFileInput = {
  fileName: string;
  fileBase64: string;
};

function normalizeQuantity(value: unknown) {
  const quantity = Number(value ?? 1);
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(10, Math.max(1, Math.floor(quantity)));
}

function getText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeUploadedFiles(value: unknown): UploadedFileInput[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((file) => {
      if (!file || typeof file !== "object") return null;

      const candidate = file as Record<string, unknown>;
      const fileName = getText(candidate.fileName);
      const fileBase64 = getText(candidate.fileBase64);
      if (!fileName || !fileBase64) return null;

      return { fileName, fileBase64 };
    })
    .filter((file): file is UploadedFileInput => Boolean(file))
    .slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = getText(body.name);
    const email = getText(body.email)?.toLowerCase();
    const phone = getText(body.phone);
    const remarks = getText(body.remarks);
    const cartCouponCode = getText(body.couponCode);
    const items = Array.isArray(body.items) ? body.items as CheckoutItemInput[] : [];

    if (!name || !email || !phone || items.length === 0) {
      return NextResponse.json({ error: "Name, E-Mail, Telefonnummer und Warenkorb sind erforderlich." }, { status: 400 });
    }

    const preparedItems: Array<any> = [];
    let cartCoupon: Coupon | null = null;
    let cartCouponValidForAllItems = false;

    if (cartCouponCode) {
      cartCouponValidForAllItems = true;
    }

    for (const item of items) {
      const product = getShopProduct(item.serviceType);
      if (!product) {
        return NextResponse.json({ error: "Unbekannter Service im Warenkorb." }, { status: 400 });
      }

      const checkDocumentLabels = product.orderType === "check"
        ? getCheckDocumentLabels(item.checkSelections)
        : [];
      const quantity = product.orderType === "check"
        ? normalizeCheckDocumentSelections(item.checkSelections).length
        : normalizeQuantity(item.quantity);
      if (cartCouponCode) {
        const validation = await validateCouponForService(cartCouponCode, product.orderType);
        if (validation.valid) {
          cartCoupon = validation.coupon;
        } else {
          cartCouponValidForAllItems = false;
        }
      }

      preparedItems.push({
        product,
        quantity: product.orderType === "salary_pdf" || product.orderType === "salary_phone" ? 1 : quantity,
        checkDocumentLabels,
        coupon: null,
        originalUnitPrice: product.basePrice,
        finalUnitPrice: product.basePrice,
        remarks: getText(item.remarks),
        firstName: getText(item.firstName),
        lastName: getText(item.lastName),
        email: getText(item.email)?.toLowerCase(),
        birthDate: getText(item.birthDate),
        workLocation: getText(item.workLocation),
        grossAnnualSalary: getText(item.grossAnnualSalary),
        fringeBenefits: getText(item.fringeBenefits),
        linkedinUrl: getText(item.linkedinUrl),
        salaryFileBase64: getText(item.salaryFileBase64),
        salaryFileName: getText(item.salaryFileName),
        cvFileBase64: getText(item.cvFileBase64),
        cvFileName: getText(item.cvFileName),
        checkFiles: product.orderType === "check" ? normalizeUploadedFiles(item.checkFiles) : [],
      });
    }

    if (cartCouponCode && !cartCouponValidForAllItems) {
      return NextResponse.json({
        error: "Dieser Gutscheincode gilt nicht für alle Services im Warenkorb.",
      }, { status: 400 });
    }

    preparedItems.forEach((item) => {
      Object.assign(item, {
        coupon: cartCoupon,
        finalUnitPrice: calculateDiscountedPrice(item.originalUnitPrice, cartCoupon),
      });
    });

    const total = preparedItems.reduce((sum, item) => sum + item.finalUnitPrice * item.quantity, 0);
    const checkoutPositionCount = preparedItems.length;
    const initialPaymentStatus = total <= 0 ? "free_coupon" : "pending";
    const orderRows = preparedItems.flatMap((item) => {
      return Array.from({ length: item.quantity }, (_, index) => {
        const checkDocumentLabel = item.product.orderType === "check"
          ? item.checkDocumentLabels[index]
          : null;

        return {
          name,
          first_name: item.firstName,
          last_name: item.lastName,
          email: item.email || email,
          birth_date: item.birthDate,
          work_location: item.workLocation,
          gross_annual_salary: item.grossAnnualSalary,
          fringe_benefits: item.fringeBenefits,
          linkedin_url: item.linkedinUrl,
          remarks: [
            `${CONTACT_PHONE_REMARKS_PREFIX} ${phone}`,
            remarks,
            item.remarks,
            checkDocumentLabel ? `Unterlage: ${checkDocumentLabel}` : null,
            item.product.orderType !== "check" && item.quantity > 1 ? `Position ${index + 1} von ${item.quantity}` : null,
          ]
            .filter(Boolean)
            .join("\n") || null,
          service_type: item.product.orderType,
          service_label: checkDocumentLabel ? `${item.product.label}: ${checkDocumentLabel}` : item.product.label,
          cv_file_base64: item.cvFileBase64,
          cv_file_name: item.cvFileName,
          salary_file_base64: item.salaryFileBase64,
          salary_file_name: item.salaryFileName,
          check_files: item.product.orderType === "check" && index === 0 && item.checkFiles.length > 0
            ? item.checkFiles
            : null,
          coupon_id: item.coupon?.id ?? null,
          coupon_code: item.coupon?.code ?? null,
          coupon_discount_type: item.coupon?.discount_type ?? null,
          coupon_discount_value: item.coupon ? getDiscountPercent(item.coupon) : null,
          original_price: item.originalUnitPrice,
          final_price: item.finalUnitPrice,
          payment_status: initialPaymentStatus,
          payment_url: null,
          coupon_valid: Boolean(item.coupon),
          status: initialPaymentStatus === "free_coupon" ? "paid" : "pending",
        };
      });
    });

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .insert(orderRows)
      .select("*");

    if (error || !orders?.length) {
      console.error("Cart order insert failed", error);
      return NextResponse.json({ error: "Bestellung konnte nicht erstellt werden." }, { status: 500 });
    }

    if (cartCoupon) {
      await redeemCouponSafely(cartCoupon.id);
    }

    if (total <= 0) {
      await processPaidCart(orders);

      return NextResponse.json({
        success: true,
        requiresPayment: false,
        orderIds: orders.map((order) => order.id),
        redirectUrl: "/confirmation?success=true&service=warenkorb",
      }, { status: 201 });
    }

    const payableOrderIds = orders
      .filter((order) => order.payment_status === "pending")
      .map((order) => order.id);
    const reference = getSaferpayShopReference("shop", payableOrderIds[0]);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const checkout = await initializeWorldlineCheckout({
      amount: total,
      orderIds: payableOrderIds,
      reference,
      description: `CVolution Warenkorb (${checkoutPositionCount} ${checkoutPositionCount === 1 ? "Position" : "Positionen"})`,
      returnUrl: `${origin}/api/worldline/checkout/return?groupId=${encodeURIComponent(reference)}`,
      payer: {
        id: reference,
        email,
      },
    });

    if (!checkout.ok) {
      console.error("Cart Worldline checkout initialize failed", checkout);
      return NextResponse.json({ error: "Worldline Checkout konnte nicht erstellt werden." }, { status: 502 });
    }

    const response = NextResponse.json({
      success: true,
      requiresPayment: true,
      orderIds: orders.map((order) => order.id),
      paymentUrl: checkout.paymentUrl,
      saferpayToken: checkout.saferpayToken,
    }, { status: 201 });

    response.cookies.set("checkoutGroupId", reference, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Cart checkout failed", error);
    return NextResponse.json({ error: "Interner Fehler beim Checkout." }, { status: 500 });
  }
}
