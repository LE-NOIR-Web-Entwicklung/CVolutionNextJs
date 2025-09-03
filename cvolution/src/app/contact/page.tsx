"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ContactPage() {
  const searchParams = useSearchParams();
  const subjectFromParams = searchParams?.get("subject") || ""; // Get subject from URL parameters
  const [isAgbChecked, setIsAgbChecked] = useState(false); // State for the checkbox
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: subjectFromParams, // Pre-fill subject if provided via query params
    address: "",
    postalCode: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check if all required fields are filled
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
      console.log(formData);
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
    } catch (err) {
      setSubmitError("Fehler beim Senden der Nachricht.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center">
      <div className="container max-w-lg mx-auto p-6 bg-[#f9f9f9] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#204878]">
          Kontaktieren Sie uns
        </h1>
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{submitSuccess}</div>
        )}
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{submitError}</div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-lg font-bold mb-2 text-[#204878]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="Name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-lg font-bold mb-2 text-[#204878]">
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="E-Mail Adresse"
              required
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-lg font-bold mb-2 text-[#204878]">
              Betreff
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              readOnly={!!subjectFromParams} // Make the field readonly only if `subjectFromParams` is set
              className={`w-full px-4 py-2 border rounded-lg ${
                subjectFromParams ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              } focus:outline-none focus:ring-2 focus:ring-[#204878]`}
              placeholder="Betreff"
              required
            />
          </div>

          {/* Street + Nr Field */}
          <div>
            <label htmlFor="address" className="block text-lg font-bold mb-2 text-[#204878]">
              Strasse + Nr
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="Strasse + Hausnummer"
              required
            />
          </div>

          {/* Postal Code Field */}
          <div>
            <label htmlFor="postalCode" className="block text-lg font-bold mb-2 text-[#204878]">
              PLZ + Ort
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full bg-white px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="PLZ + Ort"
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-lg font-bold mb-2 text-[#204878]">
              Nachricht
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#204878]"
              placeholder="Ihre Nachricht an uns"
              required
            ></textarea>
          </div>

          {/* AGB Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agb"
              name="agb"
              checked={isAgbChecked}
              onChange={(e) => setIsAgbChecked(e.target.checked)} // Update state on change
              className="w-5 h-5 text-[#204878] border-gray-300 mr-4 rounded focus:ring-[#204878]"
            />
            <label htmlFor="agb" className="text-sm text-gray-800">
              Ich habe die{" "}
              <a href="/agb" target="_blank" className="text-[#204878] underline">
                AGB
              </a>{" "}
              gelesen und akzeptiere sie.
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full px-6 py-3 font-bold rounded-lg transition duration-300 block text-center ${
                isFormValid && !isSubmitting
                  ? "bg-[#204878] text-white hover:bg-[#4c6c93]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
              }`}
            >
              {isSubmitting ? "Wird gesendet..." : "Senden"}
            </button>
          </div>
        </form>
      </div>
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