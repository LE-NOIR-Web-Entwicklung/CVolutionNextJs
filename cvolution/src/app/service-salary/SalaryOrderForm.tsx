"use client";

import { useEffect, useState } from "react";

type SalaryOrderVariant = "phone" | "pdf";

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

const salaryOrderConfig: Record<SalaryOrderVariant, { label: string; title: string; lead: string; price: string }> = {
  phone: {
    label: "Lohnanalyse Telefon",
    title: "Lohnanalyse mit telefonischer Besprechung",
    lead: "Übermitteln Sie Ihre Angaben für die Lohnanalyse inklusive telefonischer Einordnung.",
    price: "CHF 119",
  },
  pdf: {
    label: "Lohnanalyse PDF",
    title: "Lohnanalyse mit PDF",
    lead: "Übermitteln Sie Ihre Angaben und erhalten Sie Ihre Lohnanalyse als strukturiertes PDF.",
    price: "CHF 69",
  },
};

function isExternalOrderPage() {
  const params = new URLSearchParams(window.location.search);
  const externalParam = params.get("external");
  if (!externalParam) return true;
  return ["1", "true", "yes", "ja"].includes(externalParam.trim().toLowerCase());
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

function navigateTopLevel(url: string) {
  try {
    if (window.top && window.top !== window.self) {
      window.parent.postMessage({ type: "CVOLUTION_NAVIGATE_TOP", url }, "https://analyse.cvolution.ch");
      window.top.location.href = url;
      return;
    }
  } catch (error) {
    window.parent.postMessage({ type: "CVOLUTION_NAVIGATE_TOP", url }, "https://analyse.cvolution.ch");
  }

  window.location.href = url;
}

export function SalaryOrderForm({ variant }: { variant: SalaryOrderVariant }) {
  const config = salaryOrderConfig[variant];
  const [email, setEmail] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [salaryFile, setSalaryFile] = useState<File | null>(null);
  const [requiresPayment, setRequiresPayment] = useState(true);
  const [isExternalOrder, setIsExternalOrder] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [grossAnnualSalary, setGrossAnnualSalary] = useState("");
  const [fringeBenefits, setFringeBenefits] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponPreview, setCouponPreview] = useState<CouponPreview>({ state: "idle" });

  useEffect(() => {
    setIsExternalOrder(isExternalOrderPage());
  }, []);

  useEffect(() => {
    const trimmedCode = couponCode.trim();
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
            serviceType: "service-salary",
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
  }, [couponCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !phone || !birthDate || !workLocation || !grossAnnualSalary) {
      setError("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }
    if (email.trim().toLowerCase() !== emailConfirmation.trim().toLowerCase()) {
      setError("Die E-Mail-Adressen stimmen nicht überein.");
      return;
    }
    if (!salaryFile) {
      setError("Bitte laden Sie die aktuelle Lohnabrechnung hoch.");
      return;
    }
    if (!cvFile && !linkedinUrl) {
      setError("Bitte laden Sie entweder einen CV hoch oder geben Sie Ihre LinkedIn-URL an.");
      return;
    }

    try {
      let salaryBase64 = "";
      let salaryName = "";
      let cvBase64 = "";
      let cvName = "";

      if (salaryFile) {
        salaryBase64 = await convertFileToBase64(salaryFile);
        salaryName = salaryFile.name;
      }
      if (cvFile) {
        cvBase64 = await convertFileToBase64(cvFile);
        cvName = cvFile.name;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          birthDate,
          workLocation,
          grossAnnualSalary,
          fringeBenefits,
          linkedinUrl,
          remarks,
          serviceType: variant === "phone" ? "salary_phone" : "salary_pdf",
          cvFileBase64: cvBase64 || null,
          cvFileName: cvName || null,
          salaryFileBase64: salaryBase64,
          salaryFileName: salaryName,
          couponCode: couponCode || null,
          isExternal: isExternalOrder,
          externalSource: isExternalOrder ? "analyse.cvolution.ch" : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const orderResult: {
        requiresPayment: boolean;
        paymentUrl: string | null;
        redirectUrl?: string | null;
      } = await res.json();
      setRequiresPayment(orderResult.requiresPayment);
      setSubmitted(true);

      if (orderResult.requiresPayment && orderResult.paymentUrl) {
        setTimeout(() => {
          navigateTopLevel(orderResult.paymentUrl as string);
        }, 3000);
      } else if (orderResult.redirectUrl || isExternalOrder) {
        setTimeout(() => {
          navigateTopLevel(orderResult.redirectUrl || "https://analyse.cvolution.ch/danke/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {!submitted && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-[#111827] mb-2">Bestellung</h2>
                  <p className="text-sm text-[#64748B]">{config.label}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-[#64748B] mb-1">Preis</p>
                  <p className="text-2xl font-semibold text-[#111827]">{config.price}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Vorname *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Nachname *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Geburtsdatum *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      placeholder="TT.MM.JJJJ"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      pattern="\d{2}\.\d{2}\.\d{4}"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Arbeitsort *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      placeholder="z.B. Zürich"
                      value={workLocation}
                      onChange={e => setWorkLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">E-Mail Adresse *</label>
                    <input
                      type="email"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">E-Mail Adresse bestätigen *</label>
                    <input
                      type="email"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      value={emailConfirmation}
                      onChange={e => setEmailConfirmation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Bruttojahreslohn *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      placeholder="z.B. CHF 85'000"
                      value={grossAnnualSalary}
                      onChange={e => setGrossAnnualSalary(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Telefonnummer *</label>
                    <input
                      type="tel"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">Fringe & Benefits</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                    placeholder="z.B. Firmenwagen, Bonuszahlungen, etc."
                    value={fringeBenefits}
                    onChange={e => setFringeBenefits(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Aktuelle Lohnabrechnung *</label>
                    <input
                      type="file"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={e => setSalaryFile(e.target.files?.[0] || null)}
                      required
                    />
                    {salaryFile && (
                      <p className="text-xs text-[#64748B] mt-1">
                        Ausgewählt: {salaryFile.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Aktueller Lebenslauf</label>
                    <input
                      type="file"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      accept=".pdf,.doc,.docx"
                      onChange={e => setCvFile(e.target.files?.[0] || null)}
                    />
                    {cvFile && (
                      <p className="text-xs text-[#64748B] mt-1">
                        CV ausgewählt: {cvFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Link zu LinkedIn Profil
                  </label>
                  <p className="text-xs text-[#64748B] mb-2">
                    Bitte geben Sie Ihre LinkedIn-URL an, falls Sie keinen CV hochgeladen haben
                  </p>
                  <input
                    type="url"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                    placeholder="https://www.linkedin.com/in/..."
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">Bemerkungen</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                    placeholder="Weitere Informationen oder spezielle Anforderungen"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">Gutscheincode</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                    placeholder="Gutscheincode eingeben"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
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

                {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors text-sm"
                  >
                    Bestellung abschliessen
                  </button>
                </div>
              </form>
            </div>
          )}

          {submitted && (
            <div className="max-w-md mx-auto bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
              <p className="text-sm text-green-700 font-medium">
                {requiresPayment
                  ? "Vielen Dank für Ihre Anfrage! Wir leiten Sie in Kürze zur Bezahlung weiter. Bitte warten Sie einen Moment."
                  : "Vielen Dank für Ihre Anfrage! Ihr Gutschein wurde angewendet, eine Zahlung ist nicht erforderlich."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
