import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-server';
import { sendConfirmationEmail, sendEmail } from '../../../../lib/resend';
import {
  calculateDiscountedPrice,
  getDiscountPercent,
  redeemCouponSafely,
  validateCouponForService,
  type Coupon,
} from '@/lib/coupons';
import { getPaymentUrl, getServiceConfig } from '@/lib/services';

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
      couponCode
    } = body;

    const serviceConfig = getServiceConfig(serviceType);

    if (!email || !serviceType || !serviceConfig) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const originalPrice = serviceConfig.basePrice;
    let coupon: Coupon | null = null;
    let finalPrice = originalPrice;
    let redemptionRequired = false;

    if (typeof couponCode === 'string' && couponCode.trim()) {
      const validation = await validateCouponForService(couponCode, serviceConfig.orderType);
      if (validation.valid) {
        coupon = validation.coupon;
        finalPrice = calculateDiscountedPrice(originalPrice, coupon);
        redemptionRequired = true;
      } else {
        console.warn('Order coupon rejected', {
          serviceType: serviceConfig.orderType,
          reason: validation.reason,
        });
      }
    }

    if (coupon && redemptionRequired) {
      const redeemed = await redeemCouponSafely(coupon.id);
      if (!redeemed) {
        console.warn('Order coupon redemption count failed', {
          serviceType: serviceConfig.orderType,
          couponId: coupon.id,
        });
      }
    }

    const discountPercent = getDiscountPercent(coupon);
    const paymentUrl = getPaymentUrl(serviceConfig, finalPrice, discountPercent);
    const paymentStatus = finalPrice <= 0 ? 'free_coupon' : 'pending';

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
        service_type: serviceConfig.orderType,
        service_label: serviceConfig.label || serviceLabel,
        cv_file_base64: cvFileBase64 || null,
        cv_file_name: cvFileName || null,
        salary_file_base64: salaryFileBase64 || null,
        salary_file_name: salaryFileName || null,
        coupon_id: coupon?.id ?? null,
        coupon_code: coupon?.code ?? null,
        coupon_discount_type: coupon?.discount_type ?? null,
        coupon_discount_value: coupon ? getDiscountPercent(coupon) : null,
        original_price: originalPrice,
        final_price: finalPrice,
        payment_status: paymentStatus,
        payment_url: paymentUrl,
        coupon_valid: Boolean(coupon),
        status: paymentStatus === 'free_coupon' ? 'paid' : 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    if (paymentStatus === 'free_coupon' && serviceConfig.orderType !== 'self') {
      try {
        const attachments = [];
        if (cvFileBase64 && cvFileName) {
          const base64Content = String(cvFileBase64).split(',')[1] || String(cvFileBase64);
          attachments.push({ filename: cvFileName, content: base64Content });
        }
        if (salaryFileBase64 && salaryFileName) {
          const base64Content = String(salaryFileBase64).split(',')[1] || String(salaryFileBase64);
          attachments.push({ filename: salaryFileName, content: base64Content });
        }

        const displayName = firstName && lastName ? `${firstName} ${lastName}` : name || 'Unbekannt';
        await Promise.allSettled([
          sendEmail(
            displayName,
            email,
            serviceConfig.label,
            undefined, undefined, undefined,
            attachments.length > 0 ? attachments : undefined,
            firstName || undefined,
            lastName || undefined,
            birthDate || undefined,
            workLocation || undefined,
            grossAnnualSalary || undefined,
            fringeBenefits || undefined,
            linkedinUrl || undefined,
            remarks || undefined,
            coupon?.code ?? null
          ),
          sendConfirmationEmail(email, serviceConfig.label),
        ]);

        await supabaseAdmin
          .from('orders')
          .update({ status: 'processed', processed_at: new Date().toISOString() })
          .eq('id', data.id);
      } catch (freeOrderError) {
        console.error('Free coupon order processing failed', { orderId: data.id, error: freeOrderError });
      }
    }

    // Set orderId as HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      orderId: data.id,
      requiresPayment: paymentStatus === 'pending',
      paymentUrl,
    }, { status: 201 });
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
