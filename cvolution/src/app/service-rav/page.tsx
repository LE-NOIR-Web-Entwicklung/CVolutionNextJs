"use client";

import Image from "next/image";

export default function ServiceRAV() {
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
            <a
              href="/contact?subject=RAV-Unterstuetzung"
              className="inline-block px-4 py-3 mt-4 text-white font-bold bg-[#204878] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
            >
              Kontaktformular ausfüllen
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}