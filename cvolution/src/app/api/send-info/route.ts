import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '../../../../lib/resend';

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      service,
      firstName,
      lastName,
      birthDate,
      workLocation,
      grossAnnualSalary,
      fringeBenefits,
      linkedinUrl,
      remarks,
      couponCode,
      attachments
    } = await request.json();

    if (!email || !service) {
      return NextResponse.json({ message: 'Email and service are required' }, { status: 400 });
    }

    await sendEmail(
      name,
      email,
      service,
      undefined,
      undefined,
      undefined,
      attachments,
      firstName,
      lastName,
      birthDate,
      workLocation,
      grossAnnualSalary,
      fringeBenefits,
      linkedinUrl,
      remarks,
      couponCode || null
    );
    return NextResponse.json({ message: 'Info email sent' }, { status: 200 });
  } catch (error) {
    console.error('Error sending info email:', error);
    return NextResponse.json({ message: 'Failed to send info email', error }, { status: 500 });
  }
}
