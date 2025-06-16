"use client";
import { useState } from "react";
import Image from "next/image";
import { sendEmail } from "../../../lib/resend";

export default function ServiceRAV() {
    const [showForm, setShowForm] = useState(false);
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [submitted, setSubmitted] = useState(false);
      const [error, setError] = useState("");
      const [service] = useState("RAV Unterstützung");
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!name || !email) {
          setError("Bitte Name und E-Mail angeben.");
          return;
        }
        try {
          await sendEmail(name, email, service);
          setSubmitted(true);
          setShowForm(false);
          setTimeout(() => {
            setSubmitted(false);
            setName("");
            setEmail("");
            // Redirect after 3 seconds
            window.location.href =
              "https://www.saferpay.com/SecurePayGate/MultiUsePayment/364685/17772867/be8ed3d0-b265-45ad-b2ff-3e2a47707ed6";
          }, 3000);
        } catch {
          setError("Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.");
        }
    };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#204878]">
          RAV Unterstützung
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
          {/* Left Section: Image */}
          <div className="flex justify-center">
            <Image
              src="/images/customer-service.png" // Replace with the actual image path
              alt="Unterstützung beim RAV"
              width={150}
              height={150}
              className="rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }} // Responsive image
            />
          </div>

          {/* Right Section: Content */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#204878]">
              Ihre Unterstützung bei RAV-Angelegenheiten
            </h2>
            <p className="text-lg leading-relaxed mb-6">
            Die Zusammenarbeit mit dem RAV kann eine Herausforderung darstellen, besonders wenn Sie sich unsicher sind, wie Sie die Anforderungen korrekt umsetzen. Unser Service bietet Ihnen eine umfassende Unterstützung, um den Prozess reibungslos zu gestalten. Wir helfen Ihnen, ein vollständiges und überzeugendes Bewerbungsdossier zu erstellen, unterstützen Sie bei der Nachweisführung für Bewerbungsaktivitäten und bereiten Sie auf Gespräche und Termine mit dem RAV vor. Unser Ziel ist es, Ihnen den Rücken freizuhalten, sodass Sie sich auf die wichtigen Schritte Ihrer beruflichen Zukunft konzentrieren können. Mit unserer Expertise stellen Sie sicher, dass alle Vorgaben erfüllt werden und Ihre Bewerbungen höchsten Standards entsprechen.
            </p>
            <h3 className="text-2xl font-bold mb-4 text-[#204878]">
              Unsere Leistungen:
            </h3>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
              <li>Unterstützung bei der Erfüllung von RAV-Vorgaben</li>
              <li>Erstellung von Lebenslauf und Motivationsschreiben</li>
              <li>Vorbereitung auf Bewerbungsgespräche</li>
            </ul>
            <p className="text-lg leading-relaxed mb-6">
              Mit unserer Hilfe meistern Sie die Herausforderungen des RAV und
              können sich auf Ihre berufliche Zukunft konzentrieren.
            </p>
            <p className="text-xl font-bold mb-4 text-[#204878]">
              Preis: ab CHF 99
            </p>
                        {!showForm && !submitted && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-block px-4 py-3 mt-4 text-white font-bold bg-[#204878] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
              >
                Anfrage senden
              </button>
            )}
            {showForm && !submitted && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block mb-1 font-semibold">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">E-Mail</label>
                  <input
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-600">{error}</p>}
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#204878] text-white rounded font-bold hover:bg-[#1a3a66] transition"
                >
                  Absenden
                </button>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 bg-gray-200 rounded font-bold hover:bg-gray-300 transition"
                  onClick={() => setShowForm(false)}
                >
                  Abbrechen
                </button>
              </form>
            )}
            {submitted && (
              <p className="mt-6 text-green-700 font-bold">
                Vielen Dank für Ihre Anfrage! Wir leiten Sie in Kürze zur Bezahlung weiter. Bitte warten Sie einen Moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}