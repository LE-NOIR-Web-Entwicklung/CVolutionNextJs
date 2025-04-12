"use client";

import Image from "next/image";

export default function ServiceCheck() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#204878]">
          Check
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
          {/* Left Section: Image */}
          <div className="flex justify-center">
            <Image
              src="/images/checked.png" // Replace with the actual image path
              alt="Check"
              width={150}
              height={150}
              className="rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }} // Responsive image
            />
          </div>

          {/* Right Section: Content */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#204878]">
            Bewerbungsunterlagen-Check
            </h2>
            <p className="text-lg leading-relaxed mb-6">
            Ein überzeugendes Bewerbungsdossier ist oft der Schlüssel zum Vorstellungsgespräch. Personalverantwortliche entscheiden innert Sekunden, ob eine Bewerbung weiter geprüft wird – oder eben nicht. Deshalb ist es entscheidend, dass deine Unterlagen inhaltlich wie formal überzeugen. Wir prüfen Aufbau, Inhalt, Formulierungen, Gestaltung sowie die Gesamtaussage deines Dossiers. Du erhältst von uns ein verständliches Feedback mit konkreten Empfehlungen.
            Wir analysieren deine Bewerbungsdokumente sorgfältig und zeigen dir auf, wo du optimieren kannst.         </p>
            <h3 className="text-2xl font-bold mb-4 text-[#204878]">
            Dabei berücksichtigen wir insbesondere:    
            </h3>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
              <li>Lebenlauf / CV</li>
              <li>Arbeitszeugnisse</li>
            <li>Weitere Unterlagen wie Motivationsschreiben oder Deckblatt</li>
            </ul>
            <p className="text-lg leading-relaxed mb-6">
            Mit optimierten Bewerbungsunterlagen erhöhen Sie Ihre Chancen auf ein Vorstellungsgespräch und den nächsten Karriereschritt.

            </p>
            <p className="text-xl font-bold mb-4 text-[#204878]">
              Preis: CHF 49
            </p>
            <a
              href="/contact?subject=Check"
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