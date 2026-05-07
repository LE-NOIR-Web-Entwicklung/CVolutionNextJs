import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";
import { sendSelfServiceInfoEmail } from "../../../../../../lib/resend";
import {
  addSubscriptionMonth,
  getSaferpayRequestHeader,
  isSaferpayCaptureSuccessful,
  isSaferpayTransactionSuccessful,
  saferpayRequest,
} from "@/lib/saferpay";
import { sendPushNotifications } from "@/lib/order-processing";

type SelfServiceCustomer = {
  email: string;
  fullName: string | null;
  phone: string | null;
  userId: string | null;
};

function createSuccessResponse(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/confirmation?success=true&service=self", request.url));
  response.cookies.delete("orderId");
  return response;
}

function getTrimmedString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getMetadataFullName(metadata: Record<string, unknown> | undefined) {
  const fullName = getTrimmedString(metadata?.full_name);
  if (fullName) return fullName;

  const firstName = getTrimmedString(metadata?.first_name);
  const lastName = getTrimmedString(metadata?.last_name);
  return [firstName, lastName].filter(Boolean).join(" ").trim() || null;
}

async function getSelfServiceCustomer(order: Record<string, any>): Promise<SelfServiceCustomer> {
  const fallbackEmail = getTrimmedString(order.email) || "unbekannt";
  const userId = getTrimmedString(order.name);

  if (!userId) {
    return {
      email: fallbackEmail,
      fullName: null,
      phone: null,
      userId: null,
    };
  }

  try {
    const [profileResult, userResult] = await Promise.allSettled([
      supabaseAdmin
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", userId)
        .maybeSingle(),
      supabaseAdmin.auth.admin.getUserById(userId),
    ]);

    const profile = profileResult.status === "fulfilled" ? profileResult.value.data : null;
    const profileError = profileResult.status === "fulfilled" ? profileResult.value.error : profileResult.reason;
    if (profileError) {
      console.warn("Self-service profile lookup failed", { userId, reason: profileError });
    }

    const user = userResult.status === "fulfilled" ? userResult.value.data.user : null;
    const userError = userResult.status === "fulfilled" ? userResult.value.error : userResult.reason;
    if (userError) {
      console.warn("Self-service auth user lookup failed", { userId, reason: userError });
    }

    const metadata = user?.user_metadata as Record<string, unknown> | undefined;
    const fullName = getTrimmedString(profile?.full_name) || getMetadataFullName(metadata);

    return {
      email: getTrimmedString(order.email) || getTrimmedString(user?.email) || fallbackEmail,
      fullName,
      phone: getTrimmedString(profile?.phone) || getTrimmedString(metadata?.phone),
      userId,
    };
  } catch (error) {
    console.error("Self-service customer lookup failed", { userId, error });
    return {
      email: fallbackEmail,
      fullName: null,
      phone: null,
      userId,
    };
  }
}

async function sendSelfServicePaymentNotifications({
  order,
  customer,
  paidAt,
  currentPeriodEnd,
  transactionId,
}: {
  order: Record<string, any>;
  customer: SelfServiceCustomer;
  paidAt: Date;
  currentPeriodEnd: Date;
  transactionId: string | null;
}) {
  const [emailResult] = await Promise.allSettled([
    sendSelfServiceInfoEmail({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      userId: customer.userId,
      orderId: order.id,
      service: order.service_label || "Self-Service Abo",
      amount: order.final_price,
      paidAt: paidAt.toISOString(),
      subscriptionCurrentPeriodEnd: currentPeriodEnd.toISOString(),
      transactionId,
    }),
    sendPushNotifications(),
  ]);

  if (emailResult.status === "rejected") {
    console.error("Self-service info email failed", { orderId: order.id, reason: emailResult.reason });
  }
}

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

  if (order.payment_status === "paid" || order.status === "processed") {
    return createSuccessResponse(request);
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
    const customer = await getSelfServiceCustomer(order);

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

    await sendSelfServicePaymentNotifications({
      order,
      customer,
      paidAt: now,
      currentPeriodEnd,
      transactionId,
    });

    return createSuccessResponse(request);
  } catch (error) {
    console.error("Saferpay self subscription return failed", error);
    return NextResponse.redirect(new URL("/confirmation?error=payment_failed", request.url));
  }
}
