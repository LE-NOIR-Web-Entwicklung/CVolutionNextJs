"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

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

export default function ServiceSalary() {
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState("");
    const [emailConfirmation, setEmailConfirmation] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [service, setService] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [salaryFile, setSalaryFile] = useState<File | null>(null);
    const [selectedService, setSelectedService] = useState<"phone" | "pdf" | null>(null);
    const [requiresPayment, setRequiresPayment] = useState(true);

    // Form fields for both services
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
      const trimmedCode = couponCode.trim();
      if (!trimmedCode || !selectedService) {
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
        } catch (error) {
          if (!controller.signal.aborted) {
            setCouponPreview({ state: "invalid", reason: "not_found" });
          }
        }
      }, 400);

      return () => {
        window.clearTimeout(timeout);
        controller.abort();
      };
    }, [couponCode, selectedService]);

    const convertFileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (selectedService === "phone") {
        if (!firstName || !lastName || !email || !birthDate || !workLocation || !grossAnnualSalary) {
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
      }

      // Validate fields for PDF service
      if (selectedService === "pdf") {
        if (!firstName || !lastName || !email || !birthDate || !workLocation || !grossAnnualSalary) {
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
      }

      try {
        // Convert files to base64
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

        // Save order to Supabase via API (sets orderId cookie)
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName, lastName, email, birthDate,
            workLocation, grossAnnualSalary, fringeBenefits,
            linkedinUrl, remarks,
            serviceType: selectedService === "phone" ? "salary_phone" : "salary_pdf",
            cvFileBase64: cvBase64 || null,
            cvFileName: cvName || null,
            salaryFileBase64: salaryBase64,
            salaryFileName: salaryName,
            couponCode: couponCode || null,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to create order");
        }

        const orderResult: { requiresPayment: boolean; paymentUrl: string | null } = await res.json();
        setRequiresPayment(orderResult.requiresPayment);
        setSubmitted(true);
        setShowForm(false);

        if (orderResult.requiresPayment && orderResult.paymentUrl) {
          setTimeout(() => {
            window.location.href = orderResult.paymentUrl as string;
          }, 3000);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.");
      }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/search.png"
                alt="Lohnanalyse"
                width={72}
                height={72}
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#111827] mb-4">
              Lohnanalyse
            </h1>
            <p className="text-lg text-[#64748B] max-w-xl mx-auto">
              Fundierte Einschätzung Ihrer Vergütung im Branchenvergleich.
            </p>
          </div>

          {/* Two Cards Layout or Form */}
          {!showForm && !submitted && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Left Card - Lohnanalyse mit telefonischer Besprechung */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all duration-200 flex flex-col">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-[#111827] mb-2">
                    Lohnanalyse mit telefonischer Besprechung
                  </h2>
                  <h3 className="text-base text-[#64748B] mb-5">
                    Ihr Gehalt, unsere Expertise
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                    Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit unserer Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards. Wir analysieren Ihr Gehalt auf Basis von Marktbenchmarks und identifizieren mögliche Abweichungen. Im telefonischen Gespräch ordnen wir die Resultate gemeinsam ein und beantworten Ihre Fragen.
                  </p>
                  <h4 className="text-xs font-semibold text-[#111827] mb-3 uppercase tracking-wide">
                    Unsere Leistungen
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {[
                      "Erstellung einer individuellen Lohnanalyse",
                      "Telefonische Besprechung der Resultate in einem 15-minütigen Telefonat",
                      "Argumentationsgrundlage für Ihre weitere Planung",
                      "Beantwortung Ihrer individuellen Fragen zur Einordnung der Analyse",
                      "Vollständiges PDF-Dokument der Lohnanalyse im Anschluss",
                      "Transparenter Vergleich mit branchenüblichen Gehältern",
                      "Einschätzung basierend auf Position, Erfahrung und Markt",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[#64748B]">
                        <svg className="w-4 h-4 text-[#204878] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-[#111827] font-medium mb-2">
                    Für alle, die mehr als nur Zahlen wollen.
                  </p>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                    Mit dieser Lohnanalyse erhalten Sie Klarheit und eine fundierte Entscheidungsgrundlage für Ihre nächsten Schritte.
                  </p>
                </div>
                <div className="mt-auto border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-[#64748B] mb-1">Preis</p>
                      <p className="text-2xl font-semibold text-[#111827]">CHF 119</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setService("Lohnanalyse Telefon");
                      setSelectedService("phone");
                      setShowForm(true);
                    }}
                    className="w-full px-6 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors duration-200 text-sm"
                  >
                    Jetzt buchen
                  </button>
                </div>
              </div>

              {/* Right Card - Lohnanalyse mit PDF */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all duration-200 flex flex-col">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-[#111827] mb-2">
                    Lohnanalyse mit PDF
                  </h2>
                  <h3 className="text-base text-[#64748B] mb-5">
                    Ihr Gehalt, unsere Expertise
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                    Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit dieser Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards. Sie übermitteln uns Ihre Angaben und erhalten die Analyse in strukturierter Form als PDF.
                  </p>
                  <h4 className="text-xs font-semibold text-[#111827] mb-3 uppercase tracking-wide">
                    Unsere Leistungen
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {[
                      "Erstellung einer individuellen Lohnanalyse auf Basis Ihrer Angaben",
                      "Zustellung eines vollständigen PDF-Dokuments innerhalb von 2 Arbeitstagen",
                      "Argumentationsgrundlage für Ihre weitere Planung",
                      "Transparenter Vergleich mit branchenüblichen Gehältern",
                      "Einschätzung basierend auf Position, Erfahrung und Markt",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[#64748B]">
                        <svg className="w-4 h-4 text-[#204878] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                    Mit dieser Lohnanalyse erhalten Sie eine klare Standortbestimmung für eine fundierte Entscheidungsgrundlade.
                  </p>
                </div>
                <div className="mt-auto border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-[#64748B] mb-1">Preis</p>
                      <p className="text-2xl font-semibold text-[#111827]">CHF 69</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setService("Lohnanalyse PDF");
                      setSelectedService("pdf");
                      setShowForm(true);
                    }}
                    className="w-full px-6 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors duration-200 text-sm"
                  >
                    Jetzt buchen
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Section */}
          {showForm && !submitted && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
              <h3 className="text-2xl font-semibold text-[#111827] mb-2">Bestellung</h3>
              <p className="text-sm text-[#64748B] mb-8">{service}</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                {(selectedService === "phone" || selectedService === "pdf") && (
                  <>
                    {/* Two Column Grid for Personal Info */}
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

                    {/* Coupon Code Field */}
                    {(selectedService === "pdf" || selectedService === "phone") && (
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
                    )}
                  </>
                )}

                {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors text-sm"
                  >
                    Bestellung abschliessen
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-100 text-[#64748B] font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm"
                    onClick={() => setShowForm(false)}
                  >
                    Abbrechen
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
