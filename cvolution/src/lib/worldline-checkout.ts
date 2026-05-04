import { supabaseAdmin } from "../../lib/supabase-server";
import {
  getSaferpayConfig,
  getSaferpayRequestHeader,
  isSaferpayCaptureSuccessful,
  isSaferpayTransactionSuccessful,
  saferpayRequest,
  SAFERPAY_SHOP,
  toSaferpayAmount,
} from "@/lib/saferpay";

export async function initializeWorldlineCheckout(params: {
  amount: number;
  orderIds: string[];
  reference: string;
  description: string;
  returnUrl: string;
  payer?: { id?: string; email?: string };
}) {
  const saferpayConfig = getSaferpayConfig();
  const primaryOrderId = params.orderIds[0];

  const initializeRequest = {
    RequestHeader: getSaferpayRequestHeader(`${params.reference}-init`),
    TerminalId: saferpayConfig.terminalId,
    Payment: {
      Amount: {
        Value: String(toSaferpayAmount(params.amount)),
        CurrencyCode: SAFERPAY_SHOP.currencyCode,
      },
      OrderId: params.reference,
      Description: params.description.slice(0, 100),
    },
    Payer: {
      Id: params.payer?.id || primaryOrderId,
      ...(params.payer?.email ? { Email: params.payer.email } : {}),
      LanguageCode: "de",
    },
    ReturnUrl: {
      Url: params.returnUrl,
    },
    ...(SAFERPAY_SHOP.paymentMethods.length > 0 ? { PaymentMethods: SAFERPAY_SHOP.paymentMethods } : {}),
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
      .in("id", params.orderIds);

    return {
      ok: false as const,
      status: initializeResponse.status,
      body: initializeResponse.body,
    };
  }

  const checkout = initializeResponse.body as any;
  const redirectUrl = checkout?.RedirectUrl;
  const saferpayToken = checkout?.Token;

  if (!redirectUrl || !saferpayToken) {
    console.error("Saferpay initialize response incomplete", checkout);
    return {
      ok: false as const,
      status: 502,
      body: checkout,
    };
  }

  await supabaseAdmin
    .from("orders")
    .update({
      payment_url: redirectUrl,
      payment_token: saferpayToken,
      saferpay_token: saferpayToken,
      saferpay_merchant_reference: params.reference,
    })
    .in("id", params.orderIds);

  return {
    ok: true as const,
    paymentUrl: redirectUrl as string,
    saferpayToken: saferpayToken as string,
  };
}

export async function assertAndCaptureWorldlinePayment(params: {
  saferpayToken: string;
  requestId: string;
}) {
  const assertResponse = await saferpayRequest("/Payment/v1/PaymentPage/Assert", {
    RequestHeader: getSaferpayRequestHeader(`${params.requestId}-assert`),
    Token: params.saferpayToken,
  });

  if (!assertResponse.isSuccess) {
    return {
      ok: false as const,
      status: `ASSERT_HTTP_${assertResponse.status}`,
      transactionId: null,
      captureId: null,
    };
  }

  const asserted = assertResponse.body as any;
  const transaction = asserted?.Transaction;
  const transactionId = transaction?.Id || null;
  const transactionStatus = transaction?.Status || null;

  if (!isSaferpayTransactionSuccessful(transaction)) {
    return {
      ok: false as const,
      status: transactionStatus,
      transactionId,
      captureId: null,
    };
  }

  let captureId = transaction?.CaptureId || null;
  let captureStatus = transaction?.Status === "CAPTURED" ? "CAPTURED" : null;

  if (transaction?.Status === "AUTHORIZED") {
    const captureResponse = await saferpayRequest("/Payment/v1/Transaction/Capture", {
      RequestHeader: getSaferpayRequestHeader(`${params.requestId}-capture`),
      TransactionReference: {
        TransactionId: transactionId,
      },
    });

    if (!captureResponse.isSuccess || !isSaferpayCaptureSuccessful(captureResponse.body)) {
      return {
        ok: false as const,
        status: transactionStatus,
        transactionId,
        captureId: null,
      };
    }

    captureId = (captureResponse.body as any)?.CaptureId || captureId;
    captureStatus = (captureResponse.body as any)?.Status || captureStatus;
  }

  return {
    ok: true as const,
    status: captureStatus || transactionStatus,
    transactionId,
    captureId,
  };
}
