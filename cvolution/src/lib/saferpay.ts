const DEFAULT_SAFERPAY_BASE_URL = "https://www.saferpay.com/Api";
const DEFAULT_SAFERPAY_SPEC_VERSION = "1.51";
const DEFAULT_SUBSCRIPTION_AMOUNT = 1390;
const DEFAULT_RECURRING_BATCH_SIZE = 25;

export const SAFERPAY_SELF_SUBSCRIPTION = {
  currencyCode: "CHF",
  amount: Number(process.env.SAFERPAY_SELF_SUBSCRIPTION_AMOUNT_CENTS || DEFAULT_SUBSCRIPTION_AMOUNT),
  recurringBatchSize: Number(process.env.SAFERPAY_RECURRING_BATCH_SIZE || DEFAULT_RECURRING_BATCH_SIZE),
};

export function getSaferpayConfig() {
  const customerId = process.env.SAFERPAY_CUSTOMER_ID;
  const terminalId = process.env.SAFERPAY_TERMINAL_ID;
  const username = process.env.SAFERPAY_API_USERNAME;
  const password = process.env.SAFERPAY_API_PASSWORD;

  if (!customerId || !terminalId || !username || !password) {
    throw new Error(
      "Saferpay is not configured. Set SAFERPAY_CUSTOMER_ID, SAFERPAY_TERMINAL_ID, SAFERPAY_API_USERNAME and SAFERPAY_API_PASSWORD."
    );
  }

  return {
    customerId,
    terminalId,
    username,
    password,
    baseUrl: (process.env.SAFERPAY_API_BASE_URL || DEFAULT_SAFERPAY_BASE_URL).replace(/\/$/, ""),
    specVersion: process.env.SAFERPAY_SPEC_VERSION || DEFAULT_SAFERPAY_SPEC_VERSION,
    paymentPageConfigSet: process.env.SAFERPAY_PAYMENT_PAGE_CONFIG_SET || null,
  };
}

function getBasicAuthorization(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

export function getSaferpayRequestHeader(requestId: string, retryIndicator = 0) {
  const config = getSaferpayConfig();
  return {
    SpecVersion: config.specVersion,
    CustomerId: config.customerId,
    RequestId: requestId.slice(0, 80),
    RetryIndicator: retryIndicator,
  };
}

export async function saferpayRequest<TResponse = any>(path: string, body: Record<string, unknown>) {
  const config = getSaferpayConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthorization(config.username, config.password),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Saferpay request failed", {
      path,
      status: response.status,
      responseBody,
    });
  }

  return {
    isSuccess: response.ok,
    status: response.status,
    body: responseBody as TResponse,
  };
}

export function addSubscriptionMonth(date: Date) {
  const next = new Date(date);
  const day = next.getDate();
  next.setMonth(next.getMonth() + 1);

  if (next.getDate() < day) {
    next.setDate(0);
  }

  return next;
}

export function getSaferpayMerchantReference(prefix: "self" | "self-recurring", userId: string, date = new Date()) {
  const compactDate = date.toISOString().slice(0, 10).replace(/-/g, "");
  const shortUserId = userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 18);
  return `${prefix}-${shortUserId}-${compactDate}`;
}

export function isSaferpayTransactionSuccessful(transaction: any) {
  return transaction?.Status === "AUTHORIZED" || transaction?.Status === "CAPTURED";
}

export function isSaferpayCaptureSuccessful(capture: any) {
  return capture?.Status === "CAPTURED" || capture?.Status === "PENDING";
}
