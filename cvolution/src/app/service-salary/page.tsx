"use client";
import { useState } from "react";
import Image from "next/image";

export default function ServiceSalary() {
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [service, setService] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [salaryFile, setSalaryFile] = useState<File | null>(null);
    const [selectedService, setSelectedService] = useState<"phone" | "pdf" | null>(null);

    // Form fields for both services
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [workLocation, setWorkLocation] = useState("");
    const [grossAnnualSalary, setGrossAnnualSalary] = useState("");
    const [fringeBenefits, setFringeBenefits] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [remarks, setRemarks] = useState("");
  
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
        // Save data to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("confirmationEmail", email);
          localStorage.setItem("confirmationService", service);

          // Save all form data for both phone and PDF service
          if (selectedService === "phone" || selectedService === "pdf") {
            localStorage.setItem("firstName", firstName);
            localStorage.setItem("lastName", lastName);
            localStorage.setItem("birthDate", birthDate);
            localStorage.setItem("workLocation", workLocation);
            localStorage.setItem("grossAnnualSalary", grossAnnualSalary);
            localStorage.setItem("fringeBenefits", fringeBenefits);
            localStorage.setItem("linkedinUrl", linkedinUrl);
            localStorage.setItem("remarks", remarks);

            // Convert and save files
            if (salaryFile) {
              const salaryBase64 = await convertFileToBase64(salaryFile);
              localStorage.setItem("salaryFileBase64", salaryBase64);
              localStorage.setItem("salaryFileName", salaryFile.name);
            }

            if (cvFile) {
              const cvBase64 = await convertFileToBase64(cvFile);
              localStorage.setItem("cvFileBase64", cvBase64);
              localStorage.setItem("cvFileName", cvFile.name);
            }
          }
        }
        setSubmitted(true);
        setShowForm(false);
        setTimeout(() => {
          setSubmitted(false);
          setEmail("");
          setFirstName("");
          setLastName("");
          setBirthDate("");
          setWorkLocation("");
          setGrossAnnualSalary("");
          setFringeBenefits("");
          setLinkedinUrl("");
          setRemarks("");
          setCvFile(null);
          setSalaryFile(null);
          // Redirect after 3 seconds with appropriate payment link
          const paymentUrl = selectedService === "pdf"
            ? "https://www.saferpay.com/SecurePayGate/MultiUsePayment/364685/17772867/8cf44459-8bf1-4dca-a741-3ad3ce89e104"
            : "https://www.saferpay.com/SecurePayGate/MultiUsePayment/364685/17772867/e91db818-e534-4eca-848d-70caf1fa6be7";
          window.location.href = paymentUrl;
        }, 3000);
      } catch (error) {
        console.error("Error:", error);
        setError("Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.");
      }
  };
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-6 text-[#204878]">
          Lohnanalyse
        </h1>
        {!showForm && !submitted && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 mb-8 items-center">
            {/* Left Section: Image */}
            <div className="flex justify-center">
              <Image
                src="/images/search.png"
                alt="Laufbahnberatung"
                width={150}
                height={150}
                className="rounded-lg "
                style={{ maxWidth: "100%", height: "auto" }} // Responsive image
              />
            </div>
          </div>
        )}

        {/* Two Cards Layout or Form */}
        {!showForm && !submitted && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Left Card - Lohnanalyse mit telefonischer Besprechung */}
            <div className="bg-white border-2 border-[#204878] rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4 text-[#204878]">
                  Lohnanalyse mit telefonischer Besprechung
                </h2>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Ihr Gehalt, unsere Expertise
                </h3>
                <p className="text-base leading-relaxed mb-6">
                  Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit unserer Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards. Wir analysieren Ihr Gehalt auf Basis von Marktbenchmarks und identifizieren mögliche Abweichungen. Im telefonischen Gespräch ordnen wir die Resultate gemeinsam ein und beantworten Ihre Fragen.
                </p>
                <h4 className="text-lg font-bold mb-3 text-[#204878]">
                  Unsere Leistungen:
                </h4>
                <ul className="list-disc list-inside text-base leading-relaxed mb-6 space-y-1">
                  <li>Erstellung einer individuellen Lohnanalyse</li>
                  <li>Telefonische Besprechung der Resultate in einem 15-minütigen Telefonat</li>
                  <li>Argumentationsgrundlage für Ihre weitere Planung</li>
                  <li>Beantwortung Ihrer individuellen Fragen zur Einordnung der Analyse</li>
                  <li>Vollständiges PDF-Dokument der Lohnanalyse im Anschluss</li>
                  <li>Transparenter Vergleich mit branchenüblichen Gehältern</li>
                  <li>Einschätzung basierend auf Position, Erfahrung und Markt</li>
                </ul>
                <p className="text-base leading-relaxed mb-4 font-semibold">
                  Für alle, die mehr als nur Zahlen wollen.
                </p>
                <p className="text-base leading-relaxed mb-6">
                  Mit dieser Lohnanalyse erhalten Sie Klarheit und eine fundierte Entscheidungsgrundlage für Ihre nächsten Schritte.
                </p>
              </div>
              <div className="mt-auto">
                <p className="text-2xl font-bold mb-6 text-[#204878]">
                  Preis: CHF 119
                </p>
                <button
                  onClick={() => {
                    setService("Lohnanalyse Telefon");
                    setSelectedService("phone");
                    setShowForm(true);
                  }}
                  className="w-full px-6 py-3 text-white font-bold bg-[#204878] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
                >
                  Jetzt buchen
                </button>
              </div>
            </div>

            {/* Right Card - Lohnanalyse mit PDF */}
            <div className="bg-white border-2 border-[#204878] rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4 text-[#204878]">
                  Lohnanalyse mit PDF
                </h2>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Ihr Gehalt, unsere Expertise
                </h3>
                <p className="text-base leading-relaxed mb-6">
                  Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit dieser Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards. Sie übermitteln uns Ihre Angaben und erhalten die Analyse in strukturierter Form als PDF.
                </p>
                <h4 className="text-lg font-bold mb-3 text-[#204878]">
                  Unsere Leistungen:
                </h4>
                <ul className="list-disc list-inside text-base leading-relaxed mb-6 space-y-1">
                  <li>Erstellung einer individuellen Lohnanalyse auf Basis Ihrer Angaben</li>
                  <li>Zustellung eines vollständigen PDF-Dokuments innerhalb von 1 Arbeitstag</li>
                  <li>Argumentationsgrundlage für Ihre weitere Planung</li>
                  <li>Transparenter Vergleich mit branchenüblichen Gehältern</li>
                  <li>Einschätzung basierend auf Position, Erfahrung und Markt</li>
                </ul>
                <p className="text-base leading-relaxed mb-6">
                  Mit dieser Lohnanalyse erhalten Sie eine klare Standortbestimmung für eine fundierte Entscheidungsgrundlade.
                </p>
              </div>
              <div className="mt-auto">
                <p className="text-2xl font-bold mb-6 text-[#204878]">
                  Preis: CHF 69
                </p>
                <button
                  onClick={() => {
                    setService("Lohnanalyse PDF");
                    setSelectedService("pdf");
                    setShowForm(true);
                  }}
                  className="w-full px-6 py-3 text-white font-bold bg-[#204878] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
                >
                  Jetzt buchen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Section - Replaces the card content */}
        {showForm && !submitted && (
          <div className="max-w-5xl mx-auto bg-white border-2 border-[#204878] rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-[#204878]">Bestellung</h3>
            <p className="mb-6 font-semibold">{service}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {(selectedService === "phone" || selectedService === "pdf") && (
                <>
                  {/* Two Column Grid for Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-semibold">Vorname *</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Nachname *</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-semibold">Geburtsdatum *</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="TT.MM.JJJJ"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                        pattern="\d{2}\.\d{2}\.\d{4}"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Arbeitsort *</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="z.B. Zürich"
                        value={workLocation}
                        onChange={e => setWorkLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-semibold">E-Mail Adresse *</label>
                      <input
                        type="email"
                        className="w-full border rounded px-3 py-2"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Bruttojahreslohn *</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="z.B. CHF 85'000"
                        value={grossAnnualSalary}
                        onChange={e => setGrossAnnualSalary(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Full Width Textarea */}
                  <div>
                    <label className="block mb-1 font-semibold">Fringe & Benefits</label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      placeholder="z.B. Firmenwagen, Bonuszahlungen, etc."
                      value={fringeBenefits}
                      onChange={e => setFringeBenefits(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* File Uploads in Two Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-semibold">Aktuelle Lohnabrechnung *</label>
                      <input
                        type="file"
                        className="w-full border rounded px-3 py-2"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={e => setSalaryFile(e.target.files?.[0] || null)}
                        required
                      />
                      {salaryFile && (
                        <p className="text-sm text-gray-600 mt-1">
                          Ausgewählt: {salaryFile.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Aktueller Lebenslauf</label>
                      <input
                        type="file"
                        className="w-full border rounded px-3 py-2"
                        accept=".pdf,.doc,.docx"
                        onChange={e => setCvFile(e.target.files?.[0] || null)}
                      />
                      {cvFile && (
                        <p className="text-sm text-gray-600 mt-1">
                          CV ausgewählt: {cvFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn URL Full Width */}
                  <div>
                    <label className="block mb-1 font-semibold">
                      Link zu LinkedIn Profil
                    </label>
                    <p className="text-sm text-gray-600 mb-2">
                      Bitte geben Sie Ihre LinkedIn-URL an, falls Sie keinen CV hochgeladen haben
                    </p>
                    <input
                      type="url"
                      className="w-full border rounded px-3 py-2"
                      placeholder="https://www.linkedin.com/in/..."
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                    />
                  </div>

                  {/* Remarks Full Width */}
                  <div>
                    <label className="block mb-1 font-semibold">Bemerkungen</label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      placeholder="Weitere Informationen oder spezielle Anforderungen"
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      rows={4}
                    />
                  </div>
                </>
              )}

              {error && <p className="text-red-600 mb-4">{error}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#204878] text-white rounded font-bold hover:bg-[#1a3a66] transition"
                >
                  Bestellung abschliessen
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-gray-200 rounded font-bold hover:bg-gray-300 transition"
                  onClick={() => setShowForm(false)}
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {submitted && (
          <div className="max-w-md mx-auto bg-green-50 p-8 rounded-lg shadow-lg">
            <p className="text-green-700 font-bold text-center">
              Vielen Dank für Ihre Anfrage! Wir leiten Sie in Kürze zur Bezahlung weiter. Bitte warten Sie einen Moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
