import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";
import {
  addSubscriptionMonth,
  getSaferpayConfig,
  getSaferpayMerchantReference,
  getSaferpayRequestHeader,
  isSaferpayCaptureSuccessful,
  isSaferpayTransactionSuccessful,
  saferpayRequest,
  SAFERPAY_SELF_SUBSCRIPTION,
} from "@/lib/saferpay";

type ChargeResult = {
  userId: string;
  success: boolean;
  orderId?: string;
  transactionId?: string | null;
  paymentStatus?: string | null;
  skipped?: boolean;
  error?: string;
};

function authorizeRecurringRequest(request: NextRequest) {
  const expectedSecret = process.env.SAFERPAY_RECURRING_SECRET || process.env.CRON_SECRET;
  const providedSecret = request.headers.get("x-recurring-secret");
  const authorization = request.headers.get("authorization");
  return Boolean(
    expectedSecret &&
      (providedSecret === expectedSecret || authorization === `Bearer ${expectedSecret}`)
  );
}

function isDue(periodEnd: string | null | undefined, now = new Date()) {
  if (!periodEnd) return true;
  const periodEndDate = new Date(periodEnd);
  return (
    new Date(
      periodEndDate.getFullYear(),
      periodEndDate.getMonth(),
      periodEndDate.getDate()
    ).getTime() <= new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  );
}

async function markOrderFailed(orderId: string, transactionId?: string | null, paymentStatus?: string | null) {
  await supabaseAdmin
    .from("orders")
    .update({
      payment_status: "failed",
      status: "failed",
      saferpay_transaction_id: transactionId || null,
      saferpay_payment_status: paymentStatus || null,
    })
    .eq("id", orderId);
}

async function captureTransaction(orderId: string, transactionId: string) {
  return saferpayRequest("/Payment/v1/Transaction/Capture", {
    RequestHeader: getSaferpayRequestHeader(`${orderId}-capture`),
    TransactionReference: {
      TransactionId: transactionId,
    },
  });
}

async function chargeSubscription(userId: string, force = false): Promise<ChargeResult> {
  const now = new Date();
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (
    profileError ||
    !profile?.saferpay_initial_transaction_id ||
    profile.subscription_provider !== "saferpay" ||
    profile.subscription_status !== "active"
  ) {
    return { userId, success: false, error: "Aktive Saferpay-Subscription wurde nicht gefunden." };
  }

  if (!force && !isDue(profile.subscription_current_period_end, now)) {
    return { userId, success: true, skipped: true, error: "Subscription ist noch nicht faellig." };
  }

  const billingPeriodStart = profile.subscription_current_period_end
    ? new Date(profile.subscription_current_period_end)
    : now;
  const billingPeriodEnd = addSubscriptionMonth(billingPeriodStart);
  const merchantReference = getSaferpayMerchantReference("self-recurring", userId, billingPeriodStart);

  const { data: existingOrder } = await supabaseAdmin
    .from("orders")
    .select("id,payment_status,saferpay_transaction_id,saferpay_payment_status")
    .eq("name", userId)
    .eq("service_type", "self")
    .eq("saferpay_billing_period_start", billingPeriodStart.toISOString())
    .maybeSingle();

  if (existingOrder) {
    if (existingOrder.payment_status === "paid") {
      return {
        userId,
        success: true,
        skipped: true,
        orderId: existingOrder.id,
        transactionId: existingOrder.saferpay_transaction_id,
        paymentStatus: existingOrder.saferpay_payment_status,
      };
    }

    return {
      userId,
      success: false,
      skipped: true,
      orderId: existingOrder.id,
      error: "Fuer diese Aboperiode existiert bereits eine Folgebuchung.",
    };
  }

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = userData.user?.email;

  if (!email) {
    return { userId, success: false, error: "User-E-Mail wurde nicht gefunden." };
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      name: userId,
      email,
      service_type: "self",
      service_label: "Self-Service Abo",
      original_price: SAFERPAY_SELF_SUBSCRIPTION.amount / 100,
      final_price: SAFERPAY_SELF_SUBSCRIPTION.amount / 100,
      payment_status: "pending",
      payment_url: null,
      status: "pending",
      saferpay_merchant_reference: merchantReference,
      saferpay_billing_period_start: billingPeriodStart.toISOString(),
      saferpay_billing_period_end: billingPeriodEnd.toISOString(),
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Saferpay recurring order insert failed", orderError);
    return { userId, success: false, error: "Folgebuchung konnte nicht erstellt werden." };
  }

  try {
    const config = getSaferpayConfig();
    const authorizeResponse = await saferpayRequest("/Payment/v1/Transaction/AuthorizeReferenced", {
      RequestHeader: getSaferpayRequestHeader(`${order.id}-authref`),
      TerminalId: config.terminalId,
      Payment: {
        Amount: {
          Value: String(SAFERPAY_SELF_SUBSCRIPTION.amount),
          CurrencyCode: SAFERPAY_SELF_SUBSCRIPTION.currencyCode,
        },
        OrderId: order.id,
        Description: "CVolution Self-Service Abo",
        PayerNote: merchantReference,
      },
      TransactionReference: {
        TransactionId: profile.saferpay_initial_transaction_id,
      },
    });

    if (!authorizeResponse.isSuccess) {
      await markOrderFailed(order.id, null, `AUTHREF_HTTP_${authorizeResponse.status}`);
      return { userId, success: false, orderId: order.id, error: "Saferpay-Folgebuchung fehlgeschlagen." };
    }

    const transaction = (authorizeResponse.body as any)?.Transaction;
    const transactionId = transaction?.Id || null;
    const transactionStatus = transaction?.Status || null;

    if (!transactionId || !isSaferpayTransactionSuccessful(transaction)) {
      await markOrderFailed(order.id, transactionId, transactionStatus);
      return {
        userId,
        success: false,
        orderId: order.id,
        transactionId,
        paymentStatus: transactionStatus,
        error: "Saferpay-Folgebuchung wurde nicht autorisiert.",
      };
    }

    let captureId = transaction?.CaptureId || null;
    let captureStatus = transaction?.Status === "CAPTURED" ? "CAPTURED" : null;

    if (transaction.Status === "AUTHORIZED") {
      const captureResponse = await captureTransaction(order.id, transactionId);

      if (!captureResponse.isSuccess || !isSaferpayCaptureSuccessful(captureResponse.body)) {
        await markOrderFailed(order.id, transactionId, transactionStatus);
        return {
          userId,
          success: false,
          orderId: order.id,
          transactionId,
          paymentStatus: transactionStatus,
          error: "Saferpay-Folgebuchung konnte nicht finalisiert werden.",
        };
      }

      captureId = (captureResponse.body as any)?.CaptureId || captureId;
      captureStatus = (captureResponse.body as any)?.Status || captureStatus;
    }

    await supabaseAdmin
      .from("orders")
      .update({
        status: "processed",
        payment_status: "paid",
        payment_token: transactionId,
        paid_at: now.toISOString(),
        processed_at: now.toISOString(),
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
        subscription_status: "active",
        subscription_current_period_end: billingPeriodEnd.toISOString(),
      })
      .eq("user_id", userId);

    return { userId, success: true, orderId: order.id, transactionId, paymentStatus: captureStatus || transactionStatus };
  } catch (error) {
    console.error("Saferpay recurring payment error", error);
    await markOrderFailed(order.id);
    return { userId, success: false, orderId: order.id, error: "Interner Fehler bei der Folgebuchung." };
  }
}

async function chargeDueSubscriptions() {
  const now = new Date().toISOString();
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("subscription_provider", "saferpay")
    .eq("subscription_status", "active")
    .not("saferpay_initial_transaction_id", "is", null)
    .lte("subscription_current_period_end", now)
    .order("subscription_current_period_end", { ascending: true })
    .limit(SAFERPAY_SELF_SUBSCRIPTION.recurringBatchSize);

  if (error) {
    console.error("Saferpay due subscription lookup failed", error);
    return { success: false, error: "Faellige Subscriptions konnten nicht geladen werden.", results: [] };
  }

  const results: ChargeResult[] = [];
  for (const profile of profiles || []) {
    results.push(await chargeSubscription(profile.user_id));
  }

  return { success: results.every((result) => result.success), results };
}

export async function GET(request: NextRequest) {
  if (!authorizeRecurringRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await chargeDueSubscriptions();
  return NextResponse.json(result, { status: result.success ? 200 : 207 });
}

export async function POST(request: NextRequest) {
  if (!authorizeRecurringRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const userId = body?.userId;

  if (!userId) {
    const result = await chargeDueSubscriptions();
    return NextResponse.json(result, { status: result.success ? 200 : 207 });
  }

  if (typeof userId !== "string") {
    return NextResponse.json({ error: "userId must be a string" }, { status: 400 });
  }

  const result = await chargeSubscription(userId, body?.force === true);
  return NextResponse.json(result, { status: result.success ? 200 : 402 });
}
