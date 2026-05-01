import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";
import {
  getCartSuccessRedirectUrl,
  getOrderSuccessRedirectUrl,
  processPaidCart,
  processPaidOrder,
  sendPushNotifications,
} from "@/lib/order-processing";
import { assertAndCaptureWorldlinePayment } from "@/lib/worldline-checkout";

async function loadPendingOrders(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId") || request.cookies.get("orderId")?.value;
  const groupId = request.nextUrl.searchParams.get("groupId") || request.cookies.get("checkoutGroupId")?.value;

  if (groupId) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("saferpay_merchant_reference", groupId)
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    return {
      lookup: groupId,
      isCart: true,
      orders: error ? [] : data || [],
      error,
    };
  }

  if (orderId) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("status", "pending")
      .limit(1);

    return {
      lookup: orderId,
      isCart: false,
      orders: error ? [] : data || [],
      error,
    };
  }

  return {
    lookup: null,
    isCart: false,
    orders: [],
    error: null,
  };
}

export async function GET(request: NextRequest) {
  const loaded = await loadPendingOrders(request);
  const orders = loaded.orders;

  if (loaded.error || orders.length === 0) {
    console.error("Worldline checkout return order not found", {
      lookup: loaded.lookup,
      reason: loaded.error?.message,
    });
    return NextResponse.redirect(new URL("/confirmation?error=order_not_found", request.url));
  }

  const token = orders[0]?.saferpay_token;
  if (!token) {
    console.error("Worldline checkout return missing token", { lookup: loaded.lookup });
    return NextResponse.redirect(new URL("/confirmation?error=order_not_found", request.url));
  }

  const payment = await assertAndCaptureWorldlinePayment({
    saferpayToken: token,
    requestId: String(loaded.lookup || orders[0].id),
  });

  if (!payment.ok) {
    await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "failed",
        status: "failed",
        saferpay_transaction_id: payment.transactionId,
        saferpay_payment_status: payment.status,
      })
      .in("id", orders.map((order) => order.id));

    return NextResponse.redirect(new URL("/confirmation?error=payment_failed", request.url));
  }

  const now = new Date().toISOString();
  const { data: paidOrders, error: paidError } = await supabaseAdmin
    .from("orders")
    .update({
      status: "paid",
      payment_status: "paid",
      payment_token: payment.transactionId || token,
      paid_at: now,
      saferpay_transaction_id: payment.transactionId,
      saferpay_capture_id: payment.captureId,
      saferpay_payment_status: payment.status,
    })
    .in("id", orders.map((order) => order.id))
    .eq("status", "pending")
    .select("*");

  if (paidError || !paidOrders?.length) {
    console.warn("Worldline checkout already handled or could not mark paid", {
      lookup: loaded.lookup,
      reason: paidError?.message,
    });
    const response = NextResponse.redirect(
      loaded.isCart ? getCartSuccessRedirectUrl(request.url) : getOrderSuccessRedirectUrl(orders[0], request.url)
    );
    response.cookies.delete("orderId");
    response.cookies.delete("checkoutGroupId");
    return response;
  }

  if (loaded.isCart) {
    await processPaidCart(paidOrders);
  } else {
    for (const order of paidOrders) {
      await processPaidOrder(order);
    }
  }

  await sendPushNotifications();

  const response = NextResponse.redirect(
    loaded.isCart ? getCartSuccessRedirectUrl(request.url) : getOrderSuccessRedirectUrl(paidOrders[0], request.url)
  );
  response.cookies.delete("orderId");
  response.cookies.delete("checkoutGroupId");
  return response;
}
