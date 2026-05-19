import { CHECK_SERVICE_UNIT_PRICE } from "@/lib/check-service";

export const COUPON_SERVICE_KEYS = [
  "service-career",
  "service-check",
  "service-cv",
  "service-motivation",
  "service-rav",
  "service-salary",
] as const;

export type ServiceKey = (typeof COUPON_SERVICE_KEYS)[number];

export type OrderPaymentStatus = "pending" | "paid" | "free_coupon" | "failed";

export interface ServiceConfig {
  orderType: string;
  couponServiceKey: ServiceKey;
  label: string;
  basePrice: number;
  paymentUrls: {
    normal: string;
    percent30?: string;
    free?: null;
  };
}

const SAFERPAY_BASE = "https://www.saferpay.com/SecurePayGate/MultiUsePayment/364685/17772867";

export const SERVICE_CONFIGS: Record<string, ServiceConfig> = {
  career: {
    orderType: "career",
    couponServiceKey: "service-career",
    label: "Laufbahnberatung",
    basePrice: 149,
    paymentUrls: { 
      normal: `${SAFERPAY_BASE}/1d20d6ab-f1bd-4981-b0af-eada47e6ec9e`, 
      percent30: `${SAFERPAY_BASE}/8069730c-7b44-41b0-adfb-837655c52085` 
    },
  },
  check: {
    orderType: "check",
    couponServiceKey: "service-check",
    label: "Bewerbungsunterlagen-Check",
    basePrice: CHECK_SERVICE_UNIT_PRICE,
    paymentUrls: { 
      normal: `${SAFERPAY_BASE}/ec04d072-37de-4a15-81ec-8c62a28234e1`,
      percent30: `${SAFERPAY_BASE}/5171ac53-621c-4b4d-8d64-16d7d8e87834`,
      free: null,
    },

  },
  cv: {
    orderType: "cv",
    couponServiceKey: "service-cv",
    label: "Lebenslauf",
    basePrice: 99,
    paymentUrls: { 
      normal: `${SAFERPAY_BASE}/c1b94ab8-a0bf-4852-94dd-8c49a820373b`, 
      percent30: `${SAFERPAY_BASE}/2bdf1a12-6ce9-4cec-a327-bf6631bbc1da` 
    },
  },
  motivation: {
    orderType: "motivation",
    couponServiceKey: "service-motivation",
    label: "Motivationsschreiben",
    basePrice: 99,
    paymentUrls: { 
      normal: `${SAFERPAY_BASE}/6eb3a802-4145-43f1-9782-91013a6a43cc`, 
      percent30: `${SAFERPAY_BASE}/0b720bcd-fc7b-4040-b31c-b0c7f909dfd0` 
    },
  },
  rav: {
    orderType: "rav",
    couponServiceKey: "service-rav",
    label: "RAV Unterstützung",
    basePrice: 99,
    paymentUrls: {
      normal: `${SAFERPAY_BASE}/be8ed3d0-b265-45ad-b2ff-3e2a47707ed6`,
      percent30: `${SAFERPAY_BASE}/9280c482-a090-49e0-80cc-b29f180d870f`,
    },
  },
  salary_phone: {
    orderType: "salary_phone",
    couponServiceKey: "service-salary",
    label: "Lohnanalyse Telefon",
    basePrice: 119,
    paymentUrls: {
      normal: `${SAFERPAY_BASE}/e91db818-e534-4eca-848d-70caf1fa6be7`,
      percent30: `${SAFERPAY_BASE}/169e66af-8529-428c-b545-707a497c009c`,
      free: null,
    },
  },
  salary_pdf: {
    orderType: "salary_pdf",
    couponServiceKey: "service-salary",
    label: "Lohnanalyse PDF",
    basePrice: 69,
    paymentUrls: {
      normal: `${SAFERPAY_BASE}/8cf44459-8bf1-4dca-a741-3ad3ce89e104`,
      percent30: `${SAFERPAY_BASE}/ce545182-affa-4b52-bb5d-768c6a9e2860`,
      free: null,
    },
  },
  self: {
    orderType: "self",
    couponServiceKey: "service-cv",
    label: "self",
    basePrice: 13.9,
    paymentUrls: { normal: `${SAFERPAY_BASE}/95543d79-3a8d-4502-a8a1-aee08db29925` },
  },
};

const SERVICE_ALIASES: Record<string, string> = {
  "service-career": "career",
  "service-check": "check",
  "service-cv": "cv",
  "service-motivation": "motivation",
  "service-rav": "rav",
  "service-salary": "salary_pdf",
  phone: "salary_phone",
  pdf: "salary_pdf",
};

export function getServiceConfig(input: unknown): ServiceConfig | null {
  if (typeof input !== "string") return null;
  const key = SERVICE_ALIASES[input] ?? input;
  return SERVICE_CONFIGS[key] ?? null;
}

export function isServiceKey(value: unknown): value is ServiceKey {
  return typeof value === "string" && COUPON_SERVICE_KEYS.includes(value as ServiceKey);
}

export function getPaymentUrl(config: ServiceConfig, finalPrice: number, discountPercent: number | null): string | null {
  if (finalPrice <= 0) return null;
  if (discountPercent === 30 && config.paymentUrls.percent30) {
    return config.paymentUrls.percent30;
  }
  return config.paymentUrls.normal;
}
