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
import { getServiceConfig } from '@/lib/services';
import { getSaferpayShopReference } from '@/lib/saferpay';
import { initializeWorldlineCheckout } from '@/lib/worldline-checkout';

const EXTERNAL_ORDER_REMARKS_PREFIX = '[external_order]';
const EXTERNAL_ORDER_REDIRECT_URL =
  process.env.EXTERNAL_ORDER_REDIRECT_URL || 'https://analyse.cvolution.ch/danke/';

function getOrderRemarks(remarks: unknown, externalOrder: boolean, externalSource: string | null) {
  const cleanRemarks = typeof remarks === 'string' && remarks.trim() ? remarks.trim() : null;

  if (!externalOrder) {
    return cleanRemarks;
  }

  const externalMarker = `${EXTERNAL_ORDER_REMARKS_PREFIX}${externalSource ? ` source=${externalSource}` : ''}`;
  return cleanRemarks ? `${externalMarker}\n${cleanRemarks}` : externalMarker;
}

function isMissingExternalOrderColumnError(error: unknown) {
  const errorText = JSON.stringify(error).toLowerCase();
  return errorText.includes('is_external') || errorText.includes('external_source');
}

function normalizeExternalSource(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;

  const trimmedValue = value.trim();
  const lowerValue = trimmedValue.toLowerCase();

  if (lowerValue === 'analyse' || lowerValue === 'analyse.cvolution.ch') {
    return 'analyse.cvolution.ch';
  }

  try {
    const url = new URL(trimmedValue);
    if (url.hostname === 'analyse.cvolution.ch') {
      return url.hostname;
    }
  } catch {
    return lowerValue.includes('analyse.cvolution.ch') ? 'analyse.cvolution.ch' : trimmedValue;
  }

  return trimmedValue;
}

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
      couponCode,
      isExternal,
      externalSource
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

    const paymentStatus = finalPrice <= 0 ? 'free_coupon' : 'pending';
    const externalOrder = isExternal === true || isExternal === 'true';
    const normalizedExternalSource = externalOrder
      ? (normalizeExternalSource(externalSource) || 'analyse.cvolution.ch').slice(0, 255)
      : null;
    const orderRemarks = getOrderRemarks(remarks, externalOrder, normalizedExternalSource);
    const redirectUrl = externalOrder && paymentStatus === 'free_coupon'
      ? EXTERNAL_ORDER_REDIRECT_URL
      : null;

    const baseOrderInsert = {
      name: name || null,
      first_name: firstName || null,
      last_name: lastName || null,
      email,
      birth_date: birthDate || null,
      work_location: workLocation || null,
      gross_annual_salary: grossAnnualSalary || null,
      fringe_benefits: fringeBenefits || null,
      linkedin_url: linkedinUrl || null,
      remarks: orderRemarks,
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
      payment_url: null,
      coupon_valid: Boolean(coupon),
      status: paymentStatus === 'free_coupon' ? 'paid' : 'pending',
    };

    let { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        ...baseOrderInsert,
        is_external: externalOrder,
        external_source: externalOrder ? normalizedExternalSource : null,
      })
      .select('id')
      .single();

    if (error && isMissingExternalOrderColumnError(error)) {
      console.warn('External order columns missing, retrying order insert with remarks fallback:', error);
      const fallbackInsert = await supabaseAdmin
        .from('orders')
        .insert(baseOrderInsert)
        .select('id')
        .single();
      data = fallbackInsert.data;
      error = fallbackInsert.error;
    }

    if (error || !data) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    let paymentUrl: string | null = null;
    let saferpayToken: string | null = null;

    if (paymentStatus === 'pending') {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
      const orderReference = getSaferpayShopReference('order', data.id);
      const checkout = await initializeWorldlineCheckout({
        amount: finalPrice,
        orderIds: [data.id],
        reference: orderReference,
        description: `CVolution ${serviceConfig.label}`,
        returnUrl: `${origin}/api/worldline/checkout/return?orderId=${data.id}`,
        payer: {
          id: data.id,
          email,
        },
      });

      if (!checkout.ok) {
        console.error('Worldline checkout initialize failed for order', {
          orderId: data.id,
          status: checkout.status,
          body: checkout.body,
        });
        return NextResponse.json({ error: 'Worldline Checkout konnte nicht erstellt werden.' }, { status: 502 });
      }

      paymentUrl = checkout.paymentUrl;
      saferpayToken = checkout.saferpayToken;
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
      saferpayToken,
      redirectUrl,
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
