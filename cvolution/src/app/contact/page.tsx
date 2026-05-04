"use client";

import { useSearchParams } from "next/navigation";
 import { Suspense, useState } from "react";

function ContactPage() {
  const searchParams = useSearchParams();
  const subjectFromParams = searchParams?.get("subject") || "";
  const [isAgbChecked, setIsAgbChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: subjectFromParams,
    address: "",
    postalCode: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.subject.trim() !== "" &&
    formData.address.trim() !== "" &&
    formData.postalCode.trim() !== "" &&
    formData.message.trim() !== "" &&
    isAgbChecked;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.subject,
          address: formData.address,
          postalCode: formData.postalCode,
          message: formData.message,
        }),
      });
      if (res.ok) {
        setSubmitSuccess("Ihre Nachricht wurde erfolgreich versendet.");
        setFormData({
          name: "",
          email: "",
          subject: subjectFromParams,
          address: "",
          postalCode: "",
          message: "",
        });
        setIsAgbChecked(false);
      } else {
        const data = await res.json();
        setSubmitError(data.message || "Fehler beim Senden der Nachricht.");
      }
    } catch (error) {
      console.log(error);
      setSubmitError("Fehler beim Senden der Nachricht." );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#d5e1ee] bg-white px-4 py-3 text-sm text-[#111827] shadow-sm shadow-[#173d66]/[0.02] transition placeholder:text-[#94a3b8] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#204878]";
  const labelClass = "mb-2 block text-sm font-semibold text-[#101828]";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_50%_0%,rgba(32,72,120,0.14),transparent_34%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-4 inline-flex rounded-md border border-[#204878]/15 bg-white/75 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
              Kontakt
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#101828] text-balance sm:text-5xl">
              Kontaktieren Sie uns
            </h1>
            <p className="mt-4 text-base leading-7 text-[#5d6b7f] text-pretty">
              Wir freuen uns, von Ihnen zu hören.
            </p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-[0_1.5rem_4rem_rgba(15,37,65,0.09)] ring-1 ring-[#dce5ef]">
            <div className="h-1.5 bg-[#204878]" />
            <div className="p-7 sm:p-9">
            {submitSuccess && (
              <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">
                {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
                {submitError}
              </div>
            )}

            <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="E-Mail Adresse"
                  required
                />
              </div>

              {/* Street + Nr Field */}
              <div>
                <label htmlFor="address" className={labelClass}>
                  Strasse + Nr
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Strasse + Hausnummer"
                  required
                />
              </div>

              {/* Postal Code Field */}
              <div>
                <label htmlFor="postalCode" className={labelClass}>
                  PLZ + Ort
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="PLZ + Ort"
                  required
                />
              </div>

              {/* Subject Field */}
              <div className="md:col-span-2">
                <label htmlFor="subject" className={labelClass}>
                  Betreff
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  readOnly={!!subjectFromParams}
                  className={`${inputClass} ${
                    subjectFromParams ? "cursor-not-allowed bg-[#f8fafc]" : ""
                  }`}
                  placeholder="Betreff"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="md:col-span-2">
                <label htmlFor="message" className={labelClass}>
                  Nachricht
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`${inputClass} min-h-32 resize-y`}
                  placeholder="Ihre Nachricht an uns"
                  required
                ></textarea>
              </div>

              {/* AGB Checkbox */}
              <div className="flex items-start gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  id="agb"
                  name="agb"
                  checked={isAgbChecked}
                  onChange={(e) => setIsAgbChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-[#cbd9e8] text-[#204878] focus:ring-[#204878]"
                />
                <label htmlFor="agb" className="text-sm text-[#64748B]">
                  Ich habe die{" "}
                  <a href="/agb" target="_blank" className="text-[#204878] hover:underline">
                    AGB
                  </a>{" "}
                  gelesen und akzeptiere sie.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition duration-200 ${
                    isFormValid && !isSubmitting
                      ? "bg-[#204878] text-white shadow-lg shadow-[#204878]/20 hover:-translate-y-0.5 hover:bg-[#173d66] active:translate-y-0"
                      : "cursor-not-allowed bg-[#eef2f7] text-[#94a3b8]"
                  }`}
                >
                  {isSubmitting ? "Wird gesendet..." : "Senden"}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Contact() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
