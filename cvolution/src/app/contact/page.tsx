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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#111827] mb-4">
              Kontaktieren Sie uns
            </h1>
            <p className="text-lg text-[#64748B] max-w-xl mx-auto">
              Wir freuen uns, von Ihnen zu hören.
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm">
                {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                {submitError}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#111827] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                  placeholder="Name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#111827] mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                  placeholder="E-Mail Adresse"
                  required
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-[#111827] mb-2">
                  Betreff
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  readOnly={!!subjectFromParams}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition ${
                    subjectFromParams ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="Betreff"
                  required
                />
              </div>

              {/* Street + Nr Field */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-[#111827] mb-2">
                  Strasse + Nr
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                  placeholder="Strasse + Hausnummer"
                  required
                />
              </div>

              {/* Postal Code Field */}
              <div>
                <label htmlFor="postalCode" className="block text-sm font-semibold text-[#111827] mb-2">
                  PLZ + Ort
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                  placeholder="PLZ + Ort"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-[#111827] mb-2">
                  Nachricht
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                  placeholder="Ihre Nachricht an uns"
                  required
                ></textarea>
              </div>

              {/* AGB Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agb"
                  name="agb"
                  checked={isAgbChecked}
                  onChange={(e) => setIsAgbChecked(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-[#204878] border-gray-300 rounded focus:ring-[#204878] flex-shrink-0"
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
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full px-6 py-3 font-semibold rounded-xl text-sm transition-colors duration-200 ${
                    isFormValid && !isSubmitting
                      ? "bg-[#0F172A] text-white hover:bg-[#1e293b]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Wird gesendet..." : "Senden"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Contact() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
