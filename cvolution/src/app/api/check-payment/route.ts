import { NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';

/**
 * Check if payment was successful by reading from Vercel Blob
 * If successful, deletes the blob entry
 */
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'transactions/successful' });

    if (blobs.length > 0) {
      // Read the blob content
      const response = await fetch(blobs[0].url);
      const data = await response.json();

      if (data.paymentSuccessful === true) {
        // Delete the blob after reading
        await del(blobs[0].url);
        return NextResponse.json({ paymentSuccessful: true, paymentToken: data.paymentToken }, { status: 200 });
      }
    }

    return NextResponse.json({ paymentSuccessful: false }, { status: 200 });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json({ paymentSuccessful: false, error: 'Failed to check payment status' }, { status: 500 });
  }
}
