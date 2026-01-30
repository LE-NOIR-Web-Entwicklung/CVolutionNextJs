import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

/**
 * Saferpay After-Payment Callback
 * URL: https://cvolution.ch/api/afterpayment/{{{PAYMENTPAGETOKEN}}}
 *
 * Saferpay redirects here after successful payment.
 * Saves transaction to Vercel Blob, sends push notification,
 * then sets paymentSuccessful in localStorage and navigates to /confirmation.
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

  // Save transaction to Vercel Blob
  try {
    await put(`transactions/successful.json`, JSON.stringify({
      paymentToken,
      paymentSuccessful: true,
      timestamp: new Date().toISOString(),
    }), {
      contentType: 'application/json',
      access: 'public',
    });
    console.log('Transaction saved to Vercel Blob:', paymentToken);
  } catch (blobError) {
    console.error('Vercel Blob save failed:', blobError);
  }

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
