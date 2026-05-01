import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase-server';
import { sendEmail, sendConfirmationEmail } from '../../../../../lib/resend';

const EXTERNAL_ORDER_REDIRECT_URL =
  process.env.EXTERNAL_ORDER_REDIRECT_URL || 'https://analyse.cvolution.ch/danke/';
const EXTERNAL_ORDER_REMARKS_PREFIX = '[external_order]';
const CONTACT_PHONE_REMARKS_PREFIX = '[contact_phone]';

function isExternalOrder(order: any) {
  return Boolean(order?.is_external)
    || (typeof order?.remarks === 'string' && order.remarks.startsWith(EXTERNAL_ORDER_REMARKS_PREFIX));
}

function getCustomerRemarks(order: any) {
  if (typeof order?.remarks !== 'string') return undefined;
  const customerRemarkLines = order.remarks
    .split('\n')
    .filter((line: string, index: number) => {
      if (index === 0 && line.startsWith(EXTERNAL_ORDER_REMARKS_PREFIX)) return false;
      return !line.startsWith(CONTACT_PHONE_REMARKS_PREFIX);
    });
  const customerRemarks = customerRemarkLines.join('\n').trim();
  return customerRemarks || undefined;
}

function getContactPhone(order: any) {
  if (typeof order?.phone === 'string' && order.phone.trim()) return order.phone.trim();
  if (typeof order?.contact_phone === 'string' && order.contact_phone.trim()) {
    return order.contact_phone.trim();
  }
  if (typeof order?.remarks !== 'string') return undefined;

  const phoneLine = order.remarks
    .split('\n')
    .find((line: string) => line.startsWith(CONTACT_PHONE_REMARKS_PREFIX));
  return phoneLine?.replace(CONTACT_PHONE_REMARKS_PREFIX, '').trim() || undefined;
}

function getSuccessRedirectUrl(order: any, request: NextRequest) {
  if (isExternalOrder(order)) {
    return new URL(EXTERNAL_ORDER_REDIRECT_URL, request.url);
  }

  const redirectUrl = order?.service_type === 'self'
    ? '/confirmation?success=true&service=self'
    : `/confirmation?success=true&service=${encodeURIComponent(order?.service_label || '')}`;

  return new URL(redirectUrl, request.url);
}

/**
 * Saferpay After-Payment Callback
 * URL: https://cvolution.ch/api/afterpayment/{{{PAYMENTPAGETOKEN}}}
 *
 * 1. Read orderId from cookie
 * 2. Load order from Supabase
 * 3. Mark as paid
 * 4. Send emails (sendEmail + sendConfirmationEmail)
 * 5. Mark as processed
 * 6. Push notifications
 * 7. Delete cookie
 * 8. Redirect to /confirmation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: paymentToken } = await params;
  const orderId = request.cookies.get('orderId')?.value;

  console.log('Saferpay afterpayment callback received:', {
    paymentToken,
    orderId,
    timestamp: new Date().toISOString()
  });

  // Load order from Supabase: try by cookie first, then fallback to most recent pending order
  let order: any = null;

  if (orderId) {
    const { data } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('status', 'pending')
      .single();
    order = data;
  }

  // Fallback: find the most recent pending order (e.g. if cookie was blocked/expired)
  if (!order) {
    console.warn('No order found via cookie, trying fallback with most recent pending order');
    const { data } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    order = data;
  }

  if (!order) {
    console.error('No pending order found');
    return NextResponse.redirect(new URL('/confirmation?error=order_not_found', request.url));
  }

  // Mark as paid only once. If this callback is retried or refreshed, do not send emails again.
  const { data: paidOrder, error: paidUpdateError } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      payment_status: 'paid',
      payment_token: paymentToken,
      paid_at: new Date().toISOString(),
    })
    .eq('id', order.id)
    .eq('status', 'pending')
    .select('*')
    .single();

  if (paidUpdateError || !paidOrder) {
    console.warn('Afterpayment callback already handled or could not mark order as paid', {
      orderId: order.id,
      reason: paidUpdateError?.message,
    });
    const response = NextResponse.redirect(getSuccessRedirectUrl(order, request));
    response.cookies.delete('orderId');
    return response;
  }

  order = paidOrder;

  // Handle "self" service: update profiles table
  if (order.service_type === 'self') {
    try {
      // order.name contains the user_id for "self" service
      if (order.name) {
        await supabaseAdmin
          .from('profiles')
          .update({ paid: true, paydate: new Date().toISOString() })
          .eq('user_id', order.name);
      }
    } catch (profileError) {
      console.error('Error updating profile:', profileError);
    }
  }

  // Send emails in parallel (skip for "self" service)
  if (order.service_type !== 'self') {
    // Build attachments
    const attachments = [];
    if (order.cv_file_base64 && order.cv_file_name) {
      const base64Content = order.cv_file_base64.split(',')[1] || order.cv_file_base64;
      attachments.push({ filename: order.cv_file_name, content: base64Content });
    }
    if (order.salary_file_base64 && order.salary_file_name) {
      const base64Content = order.salary_file_base64.split(',')[1] || order.salary_file_base64;
      attachments.push({ filename: order.salary_file_name, content: base64Content });
    }

    const displayName = order.first_name && order.last_name
      ? `${order.first_name} ${order.last_name}`
      : order.name || 'Unbekannt';

    console.log('Sending both emails in parallel for order:', order.id);

    const results = await Promise.allSettled([
      sendEmail(
        displayName,
        order.email,
        order.service_label,
        undefined, undefined, undefined,
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
        getContactPhone(order)
      ),
      sendConfirmationEmail(order.email, order.service_label),
    ]);

    results.forEach((result, i) => {
      const label = i === 0 ? 'Info email' : 'Confirmation email';
      if (result.status === 'fulfilled') {
        console.log(`${label} sent successfully for order:`, order.id);
      } else {
        console.error(`${label} failed for order:`, order.id, result.reason);
      }
    });
  }

  // Mark as processed
  await supabaseAdmin
    .from('orders')
    .update({
      status: 'processed',
      processed_at: new Date().toISOString(),
    })
    .eq('id', order.id);

  // Push notifications
  try {
    await Promise.all([
      // fetch("https://api.pushcut.io/5hvDj_2j6Z0VWd94p-ejG/notifications/My%20First%20Notification", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      // }),
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
    console.error('Pushcut notification failed:', pushError);
  }

  // Redirect: external orders return to the source app, "self" and normal orders stay on CVolution.
  const response = NextResponse.redirect(getSuccessRedirectUrl(order, request));
  response.cookies.delete('orderId');
  return response;
}
