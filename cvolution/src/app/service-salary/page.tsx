"use client";

import Image from "next/image";

export default function ServiceSalary() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#204878]">
          Lohnanalyse
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
          {/* Left Section: Image */}
          <div className="flex justify-center">
            <Image
              src="/images/search.png" // Replace with the actual image path
              alt="Lohnanalyse"
              width={150}
              height={150}
              className="rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }} // Responsive image
            />
          </div>

          {/* Right Section: Content */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#204878]">
              Ihr Gehalt, unsere Expertise
            </h2>
            <p className="text-lg leading-relaxed mb-6">
            Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit unserer Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards. Wir analysieren Ihr Gehalt auf Basis von Marktbenchmarks und identifizieren mögliche Ungleichgewichte. So können Sie fundierte Argumente für Ihre nächste Gehaltsverhandlung sammeln und Ihre finanzielle Zukunft aktiv gestalten.
            </p>
            <h3 className="text-2xl font-bold mb-4 text-[#204878]">
              Unsere Leistungen:
            </h3>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
              <li>Transparenter Vergleich mit branchenüblichen Gehältern</li>
              <li>Individuelle Einschätzung basierend auf Ihrer Position und Erfahrung</li>
              <li>Wertvolle Argumente für Ihre Gehaltsverhandlung</li>
            </ul>
            <p className="text-lg leading-relaxed mb-6">
              Mit unserer Lohnanalyse erhalten Sie Klarheit und können Ihre
              berufliche Zukunft besser planen.
            </p>
            <p className="text-xl font-bold mb-4 text-[#204878]">
              Preis: ab CHF 79
            </p>
            <a
              href="/contact?subject=Lohnanalyse"
              className="inline-block px-4 py-3 mt-4 text-white font-bold bg-[#204878] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
            >
              Anfrage senden
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}