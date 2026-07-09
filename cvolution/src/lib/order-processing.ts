import { supabaseAdmin } from "../../lib/supabase-server";
import { sendCartConfirmationEmail, sendCartInfoEmail, sendConfirmationEmail, sendEmail } from "../../lib/resend";

const EXTERNAL_ORDER_REDIRECT_URL =
  process.env.EXTERNAL_ORDER_REDIRECT_URL || "https://analyse.cvolution.ch/danke/";
const EXTERNAL_ORDER_REMARKS_PREFIX = "[external_order]";

type Order = Record<string, any>;

export function isExternalOrder(order: Order) {
  return Boolean(order?.is_external)
    || (typeof order?.remarks === "string" && order.remarks.startsWith(EXTERNAL_ORDER_REMARKS_PREFIX));
}

export function getCustomerRemarks(order: Order) {
  if (typeof order?.remarks !== "string") return undefined;
  if (!order.remarks.startsWith(EXTERNAL_ORDER_REMARKS_PREFIX)) return order.remarks;

  const [, ...customerRemarkLines] = order.remarks.split("\n");
  const customerRemarks = customerRemarkLines.join("\n").trim();
  return customerRemarks || undefined;
}

export function getOrderSuccessRedirectUrl(order: Order, requestUrl: string) {
  if (isExternalOrder(order)) {
    return new URL(EXTERNAL_ORDER_REDIRECT_URL, requestUrl);
  }

  const redirectUrl = order?.service_type === "self"
    ? "/confirmation?success=true&service=self"
    : `/confirmation?success=true&service=${encodeURIComponent(order?.service_label || "")}`;

  return new URL(redirectUrl, requestUrl);
}

export function getCartSuccessRedirectUrl(requestUrl: string) {
  return new URL("/confirmation?success=true&service=warenkorb", requestUrl);
}

function getAttachments(order: Order) {
  const attachments = [];
  if (order.cv_file_base64 && order.cv_file_name) {
    const base64Content = String(order.cv_file_base64).split(",")[1] || String(order.cv_file_base64);
    attachments.push({ filename: order.cv_file_name, content: base64Content });
  }
  if (order.salary_file_base64 && order.salary_file_name) {
    const base64Content = String(order.salary_file_base64).split(",")[1] || String(order.salary_file_base64);
    attachments.push({ filename: order.salary_file_name, content: base64Content });
  }
  return attachments;
}

export async function sendOrderEmails(order: Order) {
  if (order.service_type === "self") return;

  const displayName = order.first_name && order.last_name
    ? `${order.first_name} ${order.last_name}`
    : order.name || "Unbekannt";
  const attachments = getAttachments(order);

  const results = await Promise.allSettled([
    sendEmail(
      displayName,
      order.email,
      order.service_label,
      undefined,
      undefined,
      undefined,
      attachments.length > 0 ? attachments : undefined,
      order.first_name || undefined,
      order.last_name || undefined,
      order.birth_date || undefined,
      order.work_location || undefined,
      order.gross_annual_salary || undefined,
      order.fringe_benefits || undefined,
      order.linkedin_url || undefined,
      getCustomerRemarks(order),
      order.coupon_code || null,
      undefined,
      order.workload || undefined
    ),
    sendConfirmationEmail(order.email, order.service_label),
  ]);

  results.forEach((result, index) => {
    const label = index === 0 ? "Info email" : "Confirmation email";
    if (result.status === "rejected") {
      console.error(`${label} failed for order:`, order.id, result.reason);
    }
  });
}

export async function processPaidOrder(order: Order) {
  if (order.service_type === "self" && order.name) {
    await supabaseAdmin
      .from("profiles")
      .update({ paid: true, paydate: new Date().toISOString() })
      .eq("user_id", order.name);
  }

  await sendOrderEmails(order);

  await supabaseAdmin
    .from("orders")
    .update({
      status: "processed",
      processed_at: new Date().toISOString(),
    })
    .eq("id", order.id);
}

export async function processPaidCart(orders: Order[]) {
  const cartOrders = orders.filter((order) => order.service_type !== "self");
  if (cartOrders.length === 0) return;

  const customerEmail = cartOrders[0].email;
  const results = await Promise.allSettled([
    sendCartInfoEmail(cartOrders as any),
    sendCartConfirmationEmail(customerEmail, cartOrders as any),
  ]);

  results.forEach((result, index) => {
    const label = index === 0 ? "Cart info email" : "Cart confirmation email";
    if (result.status === "rejected") {
      console.error(`${label} failed`, result.reason);
    }
  });

  await supabaseAdmin
    .from("orders")
    .update({
      status: "processed",
      processed_at: new Date().toISOString(),
    })
    .in("id", cartOrders.map((order) => order.id));
}

export async function sendPushNotifications() {
  try {
    await Promise.all([
      fetch("https://api.pushcut.io/k8in1RlseA_OthMYAhmQH/notifications/CVolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
      fetch("https://api.pushcut.io/5hvDj_2j6Z0VWd94p-ejG/notifications/CVolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    ]);
  } catch (pushError) {
    console.error("Pushcut notification failed:", pushError);
  }
}
