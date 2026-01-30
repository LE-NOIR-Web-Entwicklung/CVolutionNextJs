import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name, firstName, lastName, email, birthDate,
      workLocation, grossAnnualSalary, fringeBenefits,
      linkedinUrl, remarks,
      serviceType, serviceLabel,
      cvFileBase64, cvFileName,
      salaryFileBase64, salaryFileName,
      couponCode, couponValid, paymentUrl
    } = body;

    if (!email || !serviceType || !serviceLabel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        name: name || null,
        first_name: firstName || null,
        last_name: lastName || null,
        email,
        birth_date: birthDate || null,
        work_location: workLocation || null,
        gross_annual_salary: grossAnnualSalary || null,
        fringe_benefits: fringeBenefits || null,
        linkedin_url: linkedinUrl || null,
        remarks: remarks || null,
        service_type: serviceType,
        service_label: serviceLabel,
        cv_file_base64: cvFileBase64 || null,
        cv_file_name: cvFileName || null,
        salary_file_base64: salaryFileBase64 || null,
        salary_file_name: salaryFileName || null,
        coupon_code: couponCode || null,
        coupon_valid: couponValid || false,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Set orderId as HttpOnly cookie
    const response = NextResponse.json({ orderId: data.id }, { status: 201 });
    response.cookies.set('orderId', data.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
