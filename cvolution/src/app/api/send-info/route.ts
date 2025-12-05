import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '../../../../lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, service } = await request.json();

    if (!name || !email || !service) {
      return NextResponse.json({ message: 'Name, email, and service are required' }, { status: 400 });
    }

    await sendEmail(name, email, service);
    return NextResponse.json({ message: 'Info email sent' }, { status: 200 });
  } catch (error) {
    console.error('Error sending info email:', error);
    return NextResponse.json({ message: 'Failed to send info email', error }, { status: 500 });
  }
}
