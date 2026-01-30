import { NextRequest, NextResponse } from 'next/server';

/**
 * Saferpay After-Payment Callback
 * URL: https://cvolution.ch/api/afterpayment/{{{PAYMENTPAGETOKEN}}}
 *
 * Saferpay redirects here after successful payment.
 * This route redirects to /confirmation which reads localStorage
 * and calls /api/send-info + /api/send-confirmation.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: paymentToken } = await params;

  console.log('Saferpay afterpayment callback received:', {
    paymentToken,
    timestamp: new Date().toISOString()
  });

  // Send push notification via Pushcut
  try {
    await fetch("https://api.pushcut.io/5hvDj_2j6Z0VWd94p-ejG/notifications/My%20First%20Notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch (pushError) {
    console.error('Pushcut notification failed:', pushError);
  }

  return NextResponse.redirect(new URL('/confirmation', request.url));
}
