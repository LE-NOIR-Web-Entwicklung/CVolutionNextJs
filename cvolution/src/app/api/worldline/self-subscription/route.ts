import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase-server";
import {
  getSaferpayConfig,
  getSaferpayMerchantReference,
  getSaferpayRequestHeader,
  saferpayRequest,
  SAFERPAY_SELF_SUBSCRIPTION,
} from "@/lib/saferpay";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    const user = userData.user;

    if (userError || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saferpayConfig = getSaferpayConfig();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const orderReference = getSaferpayMerchantReference("self", user.id);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        name: user.id,
        email: user.email,
        service_type: "self",
        service_label: "Self-Service Abo",
        original_price: SAFERPAY_SELF_SUBSCRIPTION.amount / 100,
        final_price: SAFERPAY_SELF_SUBSCRIPTION.amount / 100,
        payment_status: "pending",
        payment_url: null,
        saferpay_merchant_reference: orderReference,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Saferpay self subscription order insert failed", orderError);
      return NextResponse.json({ error: "Bestellung konnte nicht erstellt werden." }, { status: 500 });
    }

    const returnUrl = `${origin}/api/saferpay/self-subscription/return?orderId=${order.id}`;
    const initializeRequest = {
      RequestHeader: getSaferpayRequestHeader(`${order.id}-init`),
      TerminalId: saferpayConfig.terminalId,
      Payment: {
        Amount: {
          Value: String(SAFERPAY_SELF_SUBSCRIPTION.amount),
          CurrencyCode: SAFERPAY_SELF_SUBSCRIPTION.currencyCode,
        },
        OrderId: order.id,
        Description: "CVolution Self-Service Abo",
        Recurring: {
          Initial: true,
        },
      },
      Payer: {
        Id: user.id,
        LanguageCode: "de",
      },
      ReturnUrl: {
        Url: returnUrl,
      },
      ...(saferpayConfig.paymentPageConfigSet ? { ConfigSet: saferpayConfig.paymentPageConfigSet } : {}),
    };

    const initializeResponse = await saferpayRequest("/Payment/v1/PaymentPage/Initialize", initializeRequest);

    if (!initializeResponse.isSuccess) {
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "failed",
          status: "failed",
          saferpay_payment_status: `HTTP_${initializeResponse.status}`,
        })
        .eq("id", order.id);

      return NextResponse.json({ error: "Saferpay Checkout konnte nicht erstellt werden." }, { status: 502 });
    }

    const checkout = initializeResponse.body as any;
    const redirectUrl = checkout?.RedirectUrl;
    const saferpayToken = checkout?.Token;

    if (!redirectUrl || !saferpayToken) {
      console.error("Saferpay initialize response incomplete", checkout);
      return NextResponse.json({ error: "Saferpay Checkout-Antwort ist unvollständig." }, { status: 502 });
    }

    await supabaseAdmin
      .from("orders")
      .update({
        payment_url: redirectUrl,
        payment_token: saferpayToken,
        saferpay_token: saferpayToken,
      })
      .eq("id", order.id);

    const response = NextResponse.json({
      success: true,
      orderId: order.id,
      requiresPayment: true,
      paymentUrl: redirectUrl,
      saferpayToken,
    });

    response.cookies.set("orderId", order.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Saferpay self subscription checkout failed", error);
    return NextResponse.json({ error: "Interner Fehler beim Starten des Abos." }, { status: 500 });
  }
}
