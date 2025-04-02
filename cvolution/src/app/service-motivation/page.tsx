"use client";

import Image from "next/image";

export default function ServiceMotivation() {
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
            <a
              href="/contact?subject=Motivationsschreiben"
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