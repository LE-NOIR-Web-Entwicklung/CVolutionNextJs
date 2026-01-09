"use client";
import { useState } from "react";
import Image from "next/image";

export default function ServiceMotivation() {

    const [showForm, setShowForm] = useState(false);
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [submitted, setSubmitted] = useState(false);
      const [error, setError] = useState("");
      const [service] = useState("Motivationsschreiben");
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!name || !email) {
          setError("Bitte Name und E-Mail angeben.");
          return;
        }
        try {
          // Save email to sessionStorage for confirmation page
          if (typeof window !== "undefined") {
            localStorage.setItem("confirmationEmail", email);
            localStorage.setItem("confirmationService", service);
            localStorage.setItem("confirmationName", name);
          }
          setSubmitted(true);
          setShowForm(false);
          setTimeout(() => {
            setSubmitted(false);
            setName("");
            setEmail("");
            // Redirect after 3 seconds
            window.location.href =
              "https://www.saferpay.com/SecurePayGate/MultiUsePayment/364685/17772867/6eb3a802-4145-43f1-9782-91013a6a43cc";
          }, 3000);
        } catch {
          setError("Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.");
        }
    };
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#204878]">
          Motivationsschreiben
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
          {/* Left Section: Image */}
          <div className="flex justify-center">
            <Image
              src="/images/copy-writing.png" // Replace with the actual image path
              alt="Motivationsschreiben"
              width={150}
              height={150}
              className="rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }} // Responsive image
            />
          </div>

          {/* Right Section: Content */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#204878]">
              Ihr Motivationsschreiben, unser Fokus
            </h2>
            <p className="text-lg leading-relaxed mb-6">
            Das Motivationsschreiben bietet Ihnen die Möglichkeit, Ihre Persönlichkeit und Ihre Begeisterung für die gewünschte Stelle zu zeigen. Doch oft fällt es schwer, die richtigen Worte zu finden und sich von anderen Bewerbern abzuheben. Genau hier setzen wir an. Wir entwickeln gemeinsam mit Ihnen ein massgeschneidertes Motivationsschreiben, das Ihre Beweggründe überzeugend darstellt und Ihre Stärken hervorhebt. Dabei achten wir darauf, dass der Text authentisch bleibt und zu Ihrer individuellen Situation passt. Unsere Erfahrung hilft Ihnen, die richtige Balance zwischen Professionalität und Persönlichkeit zu finden, sodass Ihr Schreiben nicht nur die Aufmerksamkeit der Personalabteilung weckt, sondern auch nachhaltig in Erinnerung bleibt.
            </p>
            <h3 className="text-2xl font-bold mb-4 text-[#204878]">
              Unsere Leistungen:
            </h3>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
              <li>Gemeinsames Erarbeiten Ihrer individuellen Argumente</li>
              <li>Formulierung eines überzeugenden Motivationsschreibens</li>
              <li>Anpassen an spezifische Stellenanforderungen</li>
            </ul>
            <p className="text-lg leading-relaxed mb-6">
              Mit einem professionellen Motivationsschreiben erhöhen Sie Ihre
              Chancen auf ein Vorstellungsgespräch und den nächsten
              Karriereschritt.
            </p>
            <p className="text-xl font-bold mb-4 text-[#204878]">
              Preis: CHF 99
            </p>
                        {!showForm && !submitted && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-block px-4 py-3 mt-4 text-white font-bold bg-[#204878] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
              >
                Jetzt buchen
              </button>
            )}
            {showForm && !submitted && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block mb-1 font-semibold">Name + Vorname</label>
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
                  Bestellung abschliessen
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