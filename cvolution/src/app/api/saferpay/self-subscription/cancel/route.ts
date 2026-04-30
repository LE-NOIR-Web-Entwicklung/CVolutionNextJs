import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabase-server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  const user = userData.user;

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("subscription_provider, subscription_status, subscription_current_period_end")
    .eq("user_id", user.id)
    .single();

  if (
    profileError ||
    profile?.subscription_provider !== "saferpay" ||
    !["active", "canceled"].includes(profile?.subscription_status)
  ) {
    return NextResponse.json({ error: "Aktives Saferpay-Abo wurde nicht gefunden." }, { status: 404 });
  }

  if (profile.subscription_status === "canceled") {
    return NextResponse.json({
      success: true,
      subscriptionStatus: "canceled",
      currentPeriodEnd: profile.subscription_current_period_end,
    });
  }

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_status: "canceled",
    })
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Saferpay subscription cancel failed", updateError);
    return NextResponse.json({ error: "Abo konnte nicht gekündigt werden." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    subscriptionStatus: "canceled",
    currentPeriodEnd: profile.subscription_current_period_end,
  });
}
