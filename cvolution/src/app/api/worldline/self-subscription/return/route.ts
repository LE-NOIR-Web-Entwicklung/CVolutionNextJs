import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";
import {
  addSubscriptionMonth,
  getSaferpayRequestHeader,
  isSaferpayCaptureSuccessful,
  isSaferpayTransactionSuccessful,
  saferpayRequest,
} from "@/lib/saferpay";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId") || request.cookies.get("orderId")?.value;

  if (!orderId) {
    return NextResponse.redirect(new URL("/confirmation?error=order_not_found", request.url));
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("service_type", "self")
    .single();

  if (orderError || !order?.saferpay_token) {
    console.error("Saferpay return order not found", { orderId, reason: orderError?.message });
    return NextResponse.redirect(new URL("/confirmation?error=order_not_found", request.url));
  }

  try {
    const assertResponse = await saferpayRequest("/Payment/v1/PaymentPage/Assert", {
      RequestHeader: getSaferpayRequestHeader(`${order.id}-assert`),
      Token: order.saferpay_token,
    });

    if (!assertResponse.isSuccess) {
      console.error("Saferpay payment page assert failed", assertResponse.body);
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "failed",
          status: "failed",
          saferpay_payment_status: `ASSERT_HTTP_${assertResponse.status}`,
        })
        .eq("id", order.id);

      return NextResponse.redirect(new URL("/confirmation?error=payment_failed", request.url));
    }

    const asserted = assertResponse.body as any;
    const transaction = asserted?.Transaction;
    const transactionId = transaction?.Id || null;
    const transactionStatus = transaction?.Status || null;

    if (!isSaferpayTransactionSuccessful(transaction)) {
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "failed",
          status: "failed",
          saferpay_transaction_id: transactionId,
          saferpay_payment_status: transactionStatus,
        })
        .eq("id", order.id);

      return NextResponse.redirect(new URL("/confirmation?error=payment_failed", request.url));
    }

    let captureId = transaction?.CaptureId || null;
    let captureStatus = transaction?.Status === "CAPTURED" ? "CAPTURED" : null;

    if (transaction?.Status === "AUTHORIZED") {
      const captureResponse = await saferpayRequest("/Payment/v1/Transaction/Capture", {
        RequestHeader: getSaferpayRequestHeader(`${order.id}-capture`),
        TransactionReference: {
          TransactionId: transactionId,
        },
      });

      if (!captureResponse.isSuccess || !isSaferpayCaptureSuccessful(captureResponse.body)) {
        console.error("Saferpay initial capture failed", captureResponse.body);
        await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "failed",
            status: "failed",
            saferpay_transaction_id: transactionId,
            saferpay_payment_status: transactionStatus,
          })
          .eq("id", order.id);

        return NextResponse.redirect(new URL("/confirmation?error=payment_failed", request.url));
      }

      captureId = (captureResponse.body as any)?.CaptureId || captureId;
      captureStatus = (captureResponse.body as any)?.Status || captureStatus;
    }

    const now = new Date();
    const currentPeriodEnd = addSubscriptionMonth(now);

    await supabaseAdmin
      .from("orders")
      .update({
        status: "processed",
        payment_status: "paid",
        paid_at: now.toISOString(),
        processed_at: now.toISOString(),
        payment_token: transactionId || order.saferpay_token,
        saferpay_transaction_id: transactionId,
        saferpay_capture_id: captureId,
        saferpay_payment_status: captureStatus || transactionStatus,
      })
      .eq("id", order.id);

    await supabaseAdmin
      .from("profiles")
      .update({
        paid: true,
        paydate: now.toISOString(),
        subscription_provider: "saferpay",
        subscription_status: "active",
        subscription_started_at: now.toISOString(),
        subscription_current_period_end: currentPeriodEnd.toISOString(),
        saferpay_initial_transaction_id: transactionId,
      })
      .eq("user_id", order.name);

    const response = NextResponse.redirect(new URL("/confirmation?success=true&service=self", request.url));
    response.cookies.delete("orderId");
    return response;
  } catch (error) {
    console.error("Saferpay self subscription return failed", error);
    return NextResponse.redirect(new URL("/confirmation?error=payment_failed", request.url));
  }
}
