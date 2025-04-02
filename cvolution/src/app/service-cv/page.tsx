"use client";

import Image from "next/image";

export default function ServiceCV() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#204878]">
          Lebenslauf
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
          {/* Left Section: Image */}
          <div className="flex justify-center">
            <Image
              src="/images/resume.png" // Replace with the actual image path
              alt="Lebenslauf Optimierung"
              width={150}
              height={150}
              className="rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }} // Responsive image
            />
          </div>

          {/* Right Section: Content */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#204878]">
              Ihr Lebenslauf, unser Fokus
            </h2>
            <p className="text-lg leading-relaxed mb-6">
            Ein professioneller Lebenslauf ist der Schlüssel zu einem erfolgreichen Bewerbungsprozess. Oft entscheidet er darüber, ob Sie zu einem Vorstellungsgespräch eingeladen werden oder nicht. Wir bei CVolution wissen, worauf es ankommt. Unser Service geht über das blosse Erstellen eines Dokuments hinaus. Wir analysieren Ihre berufliche Laufbahn, identifizieren Ihre Stärken und Kompetenzen und setzen diese gezielt in Szene. Mit einem modernen Layout und einer klaren Struktur gestalten wir einen Lebenslauf, der nicht nur professionell aussieht, sondern auch die Aufmerksamkeit von Personalverantwortlichen auf sich zieht. Egal, ob Sie sich in einer neuen Branche bewerben möchten, eine Führungskarriere anstreben oder den Berufseinstieg planen – wir passen Ihren Lebenslauf individuell an Ihre Ziele und die Anforderungen der jeweiligen Branche an.
            </p>
            <h3 className="text-2xl font-bold mb-4 text-[#204878]">
              Unsere Leistungen:
            </h3>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
              <li>Analyse Ihrer bisherigen beruflichen Laufbahn</li>
              <li>Individuelle Gestaltung eines professionellen Lebenslaufs</li>
              <li>Anpassung an die gewünschte Position und Branche</li>
            </ul>
            <p className="text-lg leading-relaxed mb-6">
              Mit einem optimierten Lebenslauf erhöhen Sie Ihre Chancen auf ein
              Vorstellungsgespräch und den nächsten Karriereschritt.
            </p>
            <p className="text-xl font-bold mb-4 text-[#204878]">
              Preis: CHF 99
            </p>
            <a
              href="/contact?subject=Lebenslauf/CV"
              className="inline-block px-4 py-3 mt-4 text-white font-bold bg-[#204878] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
            >
              Jetzt Buchen
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}