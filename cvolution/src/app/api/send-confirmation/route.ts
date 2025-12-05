import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '../../../../lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { email, service } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await sendConfirmationEmail(email, service);
    return NextResponse.json({ message: 'Confirmation email sent' }, { status: 200 });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json({ message: 'Failed to send confirmation email', error }, { status: 500 });
  }
}
