"use client";

import { useEffect, useState } from "react";
import type { ServiceKey } from "@/lib/services";

type CouponPreview =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "valid"; code: string; discountType: "percent" | "free"; discountValue: number }
  | { state: "invalid"; reason: string };

const couponErrorMessages: Record<string, string> = {
  expired: "Dieser Gutscheincode ist abgelaufen.",
  not_started: "Dieser Gutscheincode ist noch nicht gültig.",
  inactive: "Dieser Gutscheincode ist nicht aktiv.",
  service_not_allowed: "Dieser Gutscheincode gilt nicht für diesen Service.",
  not_found: "Dieser Gutscheincode ist ungültig.",
};

interface CouponCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  serviceType: ServiceKey;
}

export function CouponCodeField({ value, onChange, serviceType }: CouponCodeFieldProps) {
  const [couponPreview, setCouponPreview] = useState<CouponPreview>({ state: "idle" });

  useEffect(() => {
    const trimmedCode = value.trim();
    if (!trimmedCode) {
      setCouponPreview({ state: "idle" });
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setCouponPreview({ state: "checking" });
      try {
        const res = await fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: trimmedCode,
            serviceType,
          }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (data.valid) {
          setCouponPreview({
            state: "valid",
            code: data.code,
            discountType: data.discountType,
            discountValue: data.discountValue,
          });
        } else {
          setCouponPreview({ state: "invalid", reason: data.reason || "not_found" });
        }
      } catch {
        if (!controller.signal.aborted) {
          setCouponPreview({ state: "invalid", reason: "not_found" });
        }
      }
    }, 400);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [value, serviceType]);

  return (
    <div>
      <label className="block text-sm font-semibold text-[#111827] mb-2">Gutscheincode</label>
      <input
        type="text"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
        placeholder="Gutscheincode eingeben"
        value={value}
        onChange={(event) => onChange(event.target.value.toUpperCase())}
      />
      <p className="text-xs text-[#64748B] mt-1">
        Falls Sie einen Gutscheincode haben, geben Sie ihn hier ein
      </p>
      {couponPreview.state === "checking" && (
        <p className="text-xs text-[#64748B] mt-2">Gutscheincode wird geprüft...</p>
      )}
      {couponPreview.state === "valid" && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-4 py-3 mt-3">
          Coupon angewendet: {couponPreview.discountType === "free" ? "kostenlos" : `${couponPreview.discountValue}% Rabatt`}
        </p>
      )}
      {couponPreview.state === "invalid" && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 mt-3">
          {couponErrorMessages[couponPreview.reason] || "Dieser Gutscheincode ist ungültig."}
        </p>
      )}
    </div>
  );
}
