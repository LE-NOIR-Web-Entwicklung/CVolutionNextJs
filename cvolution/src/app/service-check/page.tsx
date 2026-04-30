"use client";
import { useState } from "react";
import Image from "next/image";
import { CouponCodeField } from "@/components/CouponCodeField";

export default function ServiceCheck() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requiresPayment, setRequiresPayment] = useState(true);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [service] = useState("Bewerbungsunterlagen-Check");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email) {
      setError("Bitte Name und E-Mail angeben.");
      return;
    }
    if (email.trim().toLowerCase() !== emailConfirmation.trim().toLowerCase()) {
      setError("Die E-Mail-Adressen stimmen nicht überein.");
      return;
    }
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          serviceType: "check",
          serviceLabel: service,
          couponCode: couponCode || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const orderResult = await res.json();
      setRequiresPayment(orderResult.requiresPayment);
      setSubmitted(true);
      setShowForm(false);
      if (orderResult.requiresPayment && orderResult.paymentUrl) {
        setTimeout(() => {
          window.location.href = orderResult.paymentUrl;
        }, 3000);
      }
    } catch {
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
                src="/images/checked.png"
                alt="Check"
                width={72}
                height={72}
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#111827] mb-4">
              Check
            </h1>
            <p className="text-lg text-[#64748B] max-w-xl mx-auto">
              Professionelles Feedback für Ihr Bewerbungsdossier.
            </p>
          </div>

          {/* Content Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-[#111827] mb-6">
              Bewerbungsunterlagen-Check
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed mb-8">
              Ein überzeugendes Bewerbungsdossier ist oft der Schlüssel zum Vorstellungsgespräch. Personalverantwortliche entscheiden innert Sekunden, ob eine Bewerbung weiter geprüft wird – oder eben nicht. Deshalb ist es entscheidend, dass deine Unterlagen inhaltlich wie formal überzeugen. Wir prüfen Aufbau, Inhalt, Formulierungen, Gestaltung sowie die Gesamtaussage deines Dossiers. Du erhältst von uns ein verständliches Feedback mit konkreten Empfehlungen.
              Wir analysieren deine Bewerbungsdokumente sorgfältig und zeigen dir auf, wo du optimieren kannst.
            </p>

            <h3 className="text-base font-semibold text-[#111827] mb-4 uppercase tracking-wide">
              Dabei berücksichtigen wir insbesondere
            </h3>
            <ul className="space-y-3 mb-8">
              {[
                "Lebenlauf / CV",
                "Arbeitszeugnisse",
                "Weitere Unterlagen wie Motivationsschreiben oder Deckblatt",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#64748B]">
                  <svg className="w-5 h-5 text-[#204878] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-base text-[#64748B] leading-relaxed mb-8">
              Mit optimierten Bewerbungsunterlagen erhöhen Sie Ihre Chancen auf ein Vorstellungsgespräch und den nächsten Karriereschritt.
            </p>

            <div className="border-t border-gray-100 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="text-sm text-[#64748B] mb-1">Preis</p>
                  <p className="text-3xl font-semibold text-[#111827]">CHF 49</p>
                </div>

                {!showForm && !submitted && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-8 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors duration-200 text-sm"
                  >
                    Jetzt buchen
                  </button>
                )}
              </div>

              {showForm && !submitted && (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Name + Vorname</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">E-Mail</label>
                    <input
                      type="email"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">E-Mail bestätigen</label>
                    <input
                      type="email"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#204878] focus:border-transparent transition"
                      value={emailConfirmation}
                      onChange={e => setEmailConfirmation(e.target.value)}
                      required
                    />
                  </div>
                  <CouponCodeField value={couponCode} onChange={setCouponCode} serviceType="service-check" />
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
              )}
              {submitted && (
                <div className="mt-8 bg-green-50 border border-green-100 rounded-xl px-6 py-4">
                  <p className="text-sm text-green-700 font-medium">
                    {requiresPayment
                      ? "Vielen Dank für Ihre Anfrage! Wir leiten Sie in Kürze zur Bezahlung weiter. Bitte warten Sie einen Moment."
                      : "Vielen Dank für Ihre Anfrage! Ihr Gutschein wurde angewendet, eine Zahlung ist nicht erforderlich."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
