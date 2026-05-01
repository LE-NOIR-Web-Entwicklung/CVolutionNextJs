"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearCart, readCart, writeCart, type CartItem } from "@/lib/cart";
import { SHOP_PRODUCTS, type ShopProductKey } from "@/lib/shop";

type CouponPreview =
  | { state: "idle"; finalUnitPrice?: number }
  | { state: "checking" }
  | { state: "valid"; finalTotal: number; discountTotal: number; label: string }
  | { state: "invalid"; reason: string };

type SalaryDetails = {
  firstName: string;
  lastName: string;
  birthDate: string;
  workLocation: string;
  email: string;
  emailConfirmation: string;
  grossAnnualSalary: string;
  fringeBenefits: string;
  linkedinUrl: string;
  remarks: string;
  salaryFile: File | null;
  cvFile: File | null;
};

const emptySalaryDetails: SalaryDetails = {
  firstName: "",
  lastName: "",
  birthDate: "",
  workLocation: "",
  email: "",
  emailConfirmation: "",
  grossAnnualSalary: "",
  fringeBenefits: "",
  linkedinUrl: "",
  remarks: "",
  salaryFile: null,
  cvFile: null,
};

function formatPrice(value: number) {
  return `CHF ${value.toFixed(2)}`;
}

function isSalaryService(serviceType: ShopProductKey) {
  return serviceType === "salary_pdf" || serviceType === "salary_phone";
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponPreview, setCouponPreview] = useState<CouponPreview>({ state: "idle" });
  const [salaryDetails, setSalaryDetails] = useState<Record<string, SalaryDetails>>({});
  const [salaryOpen, setSalaryOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setItems(readCart());
  }, []);

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const product = SHOP_PRODUCTS[item.serviceType as ShopProductKey];
        if (!product) return null;
        const quantity = isSalaryService(item.serviceType as ShopProductKey) ? 1 : item.quantity;
        return {
          ...item,
          quantity,
          product,
          lineTotal: product.basePrice * quantity,
        };
      })
      .filter(Boolean) as Array<CartItem & { product: (typeof SHOP_PRODUCTS)[ShopProductKey]; lineTotal: number }>;
  }, [items]);

  const originalTotal = lines.reduce((sum, line) => sum + line.product.basePrice * line.quantity, 0);
  const total = couponPreview.state === "valid" ? couponPreview.finalTotal : originalTotal;
  const discountTotal = Math.max(0, originalTotal - total);

  useEffect(() => {
    const controllers: AbortController[] = [];
    const timeout = window.setTimeout(() => {
      const code = couponCode.trim();
      if (!code || lines.length === 0) {
        setCouponPreview({ state: "idle" });
        return;
      }

      setCouponPreview({ state: "checking" });

      Promise.all(lines.map((line) => {
        const controller = new AbortController();
        controllers.push(controller);

        return fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            serviceType: line.product.couponServiceKey,
          }),
          signal: controller.signal,
        })
          .then((res) => res.json());
      }))
        .then((results) => {
          if (results.some((result) => !result.valid)) {
            setCouponPreview({ state: "invalid", reason: "service_not_allowed" });
            return;
          }

          const coupon = results[0];
          const finalTotal = coupon.discountType === "free"
            ? 0
            : Math.max(0, Math.round(originalTotal * (1 - Number(coupon.discountValue || 0) / 100) * 100) / 100);

          setCouponPreview({
            state: "valid",
            finalTotal,
            discountTotal: Math.max(0, originalTotal - finalTotal),
            label: coupon.discountType === "free" ? "kostenlos" : `${coupon.discountValue}% Rabatt`,
          });
        })
        .catch(() => {
          if (controllers.every((controller) => !controller.signal.aborted)) {
            setCouponPreview({ state: "invalid", reason: "not_found" });
          }
        });
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controllers.forEach((controller) => controller.abort());
    };
  }, [couponCode, lines, originalTotal]);

  function updateItems(nextItems: CartItem[]) {
    setItems(nextItems);
    writeCart(nextItems);
  }

  function updateQuantity(serviceType: ShopProductKey, quantity: number) {
    updateItems(
      items.map((item) =>
        item.serviceType === serviceType
          ? { ...item, quantity: Math.min(10, Math.max(1, quantity)) }
          : item
      )
    );
  }

  function removeItem(serviceType: ShopProductKey) {
    updateItems(items.filter((item) => item.serviceType !== serviceType));
  }

  function updateSalaryDetails(serviceType: ShopProductKey, patch: Partial<SalaryDetails>) {
    setSalaryDetails((current) => ({
      ...current,
      [serviceType]: {
        ...(current[serviceType] || emptySalaryDetails),
        ...patch,
      },
    }));
  }

  function validateSalaryLine(serviceType: ShopProductKey) {
    const details = salaryDetails[serviceType] || emptySalaryDetails;
    if (!details.firstName || !details.lastName || !details.email || !details.birthDate || !details.workLocation || !details.grossAnnualSalary) {
      return "Bitte füllen Sie alle Pflichtfelder für die Lohnanalyse aus.";
    }
    if (details.email.trim().toLowerCase() !== details.emailConfirmation.trim().toLowerCase()) {
      return "Die E-Mail-Adressen der Lohnanalyse stimmen nicht überein.";
    }
    if (!details.salaryFile) {
      return "Bitte laden Sie für die Lohnanalyse die aktuelle Lohnabrechnung hoch.";
    }
    if (!details.cvFile && !details.linkedinUrl) {
      return "Bitte laden Sie für die Lohnanalyse einen CV hoch oder geben Sie Ihre LinkedIn-URL an.";
    }
    return null;
  }

  function renderSalaryFields(serviceType: ShopProductKey) {
    const details = salaryDetails[serviceType] || emptySalaryDetails;
    const isOpen = salaryOpen[serviceType] ?? false;
    const isComplete = !!(details.firstName && details.lastName && details.email && details.birthDate && details.workLocation && details.grossAnnualSalary && details.salaryFile && (details.cvFile || details.linkedinUrl));

    return (
      <div className="mt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setSalaryOpen((prev) => ({ ...prev, [serviceType]: !isOpen }))}
          className="w-full flex items-center justify-between px-0 py-3 text-left"
        >
          <span className="text-sm font-semibold text-[#111827]">Angaben für die Lohnanalyse</span>
          <div className="flex items-center gap-2">
            {isComplete ? (
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Vollständig</span>
            ) : (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Erforderlich</span>
            )}
            <svg className={`w-4 h-4 text-[#64748B] transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="pb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">Vorname *</label>
                <input value={details.firstName} onChange={(event) => updateSalaryDetails(serviceType, { firstName: event.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">Nachname *</label>
                <input value={details.lastName} onChange={(event) => updateSalaryDetails(serviceType, { lastName: event.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">Geburtsdatum *</label>
                <input value={details.birthDate} onChange={(event) => updateSalaryDetails(serviceType, { birthDate: event.target.value })} placeholder="TT.MM.JJJJ" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">Arbeitsort *</label>
                <input value={details.workLocation} onChange={(event) => updateSalaryDetails(serviceType, { workLocation: event.target.value })} placeholder="z.B. Zürich" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">E-Mail *</label>
                <input type="email" value={details.email} onChange={(event) => updateSalaryDetails(serviceType, { email: event.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">E-Mail bestätigen *</label>
                <input type="email" value={details.emailConfirmation} onChange={(event) => updateSalaryDetails(serviceType, { emailConfirmation: event.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">Bruttojahreslohn *</label>
                <input value={details.grossAnnualSalary} onChange={(event) => updateSalaryDetails(serviceType, { grossAnnualSalary: event.target.value })} placeholder="z.B. CHF 85'000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">Fringe & Benefits</label>
              <textarea value={details.fringeBenefits} onChange={(event) => updateSalaryDetails(serviceType, { fringeBenefits: event.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">Aktuelle Lohnabrechnung *</label>
                <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(event) => updateSalaryDetails(serviceType, { salaryFile: event.target.files?.[0] || null })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">Aktueller Lebenslauf</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => updateSalaryDetails(serviceType, { cvFile: event.target.files?.[0] || null })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">LinkedIn Profil</label>
              <input type="url" value={details.linkedinUrl} onChange={(event) => updateSalaryDetails(serviceType, { linkedinUrl: event.target.value })} placeholder="https://www.linkedin.com/in/..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">Bemerkungen</label>
              <textarea value={details.remarks} onChange={(event) => updateSalaryDetails(serviceType, { remarks: event.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
            </div>
          </div>
        )}
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Bitte Name und E-Mail angeben.");
      return;
    }

    if (email.trim().toLowerCase() !== emailConfirmation.trim().toLowerCase()) {
      setError("Die E-Mail-Adressen stimmen nicht überein.");
      return;
    }

    if (items.length === 0) {
      setError("Ihr Warenkorb ist leer.");
      return;
    }

    setIsSubmitting(true);

    try {
      for (const item of items) {
        if (isSalaryService(item.serviceType)) {
          const salaryError = validateSalaryLine(item.serviceType);
          if (salaryError) {
            setError(salaryError);
            setIsSubmitting(false);
            return;
          }
        }
      }

      const checkoutItems = await Promise.all(items.map(async (item) => {
        if (!isSalaryService(item.serviceType)) {
          return {
            serviceType: item.serviceType,
            quantity: item.quantity,
          };
        }

        const details = salaryDetails[item.serviceType] || emptySalaryDetails;
        const salaryFileBase64 = details.salaryFile ? await convertFileToBase64(details.salaryFile) : null;
        const cvFileBase64 = details.cvFile ? await convertFileToBase64(details.cvFile) : null;

        return {
          serviceType: item.serviceType,
          quantity: 1,
          firstName: details.firstName,
          lastName: details.lastName,
          email: details.email,
          birthDate: details.birthDate,
          workLocation: details.workLocation,
          grossAnnualSalary: details.grossAnnualSalary,
          fringeBenefits: details.fringeBenefits,
          linkedinUrl: details.linkedinUrl,
          remarks: details.remarks,
          salaryFileBase64,
          salaryFileName: details.salaryFile?.name || null,
          cvFileBase64,
          cvFileName: details.cvFile?.name || null,
        };
      }));

      const res = await fetch("/api/worldline/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          remarks,
          couponCode: couponCode || null,
          items: checkoutItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Checkout fehlgeschlagen.");
      }

      setSubmitted(true);
      clearCart();
      setItems([]);

      if (data.requiresPayment && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        window.location.href = data.redirectUrl || "/confirmation?success=true&service=warenkorb";
      }
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout fehlgeschlagen.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-4xl font-semibold text-[#111827] mb-3">Warenkorb</h1>
            <p className="text-[#64748B]">Mehrere Services gemeinsam bestellen und mit Kreditkarte oder TWINT bezahlen.</p>
          </div>

          {lines.length === 0 && !submitted ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8">
              <p className="text-[#64748B] mb-6">Ihr Warenkorb ist leer.</p>
              <Link href="/service" className="inline-flex px-6 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors text-sm">
                Angebot ansehen
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
              <div className="space-y-4">
                {lines.map((line) => (
                  <div key={line.serviceType} className="bg-white border border-gray-100 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827] truncate">{line.product.label}</p>
                        <p className="text-xs text-[#64748B] truncate">{line.product.shortDescription}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {!isSalaryService(line.serviceType) && (
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={line.quantity}
                            onChange={(event) => updateQuantity(line.serviceType, Number(event.target.value))}
                            className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                          />
                        )}
                        <span className="text-sm font-semibold text-[#204878] w-20 text-right">{formatPrice(line.product.basePrice)}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(line.serviceType)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700"
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                    {isSalaryService(line.serviceType) && renderSalaryFields(line.serviceType)}
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 h-fit">
                <h2 className="text-xl font-semibold text-[#111827] mb-5">Checkout</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Name + Vorname</label>
                    <input value={name} onChange={(event) => setName(event.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">E-Mail</label>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">E-Mail bestätigen</label>
                    <input type="email" value={emailConfirmation} onChange={(event) => setEmailConfirmation(event.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Bemerkungen</label>
                    <textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Gutscheincode</label>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                      placeholder="Optional"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                    />
                    {couponPreview.state === "checking" && (
                      <p className="text-xs text-[#64748B] mt-2">Gutscheincode wird geprüft...</p>
                    )}
                    {couponPreview.state === "valid" && (
                      <p className="text-sm text-green-700 bg-green-50 rounded-lg px-4 py-3 mt-3">
                        Coupon angewendet: {couponPreview.label}
                      </p>
                    )}
                    {couponPreview.state === "invalid" && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 mt-3">
                        Dieser Gutscheincode ist ungültig oder gilt nicht für alle Services im Warenkorb.
                      </p>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                    <span className="text-sm text-[#64748B]">Zwischentotal vor Gutscheinen</span>
                    <span className="text-xl font-semibold text-[#111827]">{formatPrice(originalTotal)}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">Gutscheine</span>
                      <span className="text-sm font-semibold text-green-700">-{formatPrice(discountTotal)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#111827]">Total</span>
                    <span className="text-xl font-semibold text-[#111827]">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-[#64748B]">Der angezeigte Totalbetrag wird an Worldline übergeben.</p>
                  {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors text-sm disabled:opacity-60"
                  >
                    {isSubmitting ? "Checkout wird erstellt..." : "Mit Worldline bezahlen"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
