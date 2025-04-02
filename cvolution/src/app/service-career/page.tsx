"use client";

import Image from "next/image";
import React from "react";
import { PopupWidget } from "react-calendly";

export default function ServiceCareer() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#204878]">
          Laufbahnberatung
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
          {/* Left Section: Image */}
          <div className="flex justify-center">
            <Image
              src="/images/talk.png"
              alt="Laufbahnberatung"
              width={150}
              height={150}
              className="rounded-lg "
              style={{ maxWidth: "100%", height: "auto" }} // Responsive image
            />
          </div>

          {/* Right Section: Content */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#204878]">
              Ihre Karriere, unser Fokus
            </h2>
            <p className="text-lg leading-relaxed mb-6">
            Die Berufswelt verändert sich rasant, und manchmal ist es schwierig, 
            den richtigen Weg zu finden. Ob Sie in Ihrer aktuellen Position unzufrieden sind, 
            nach neuen Herausforderungen suchen oder Ihre Karriere strategisch weiterentwickeln möchten – 
            unsere Laufbahnberatung bietet Ihnen Orientierung und Unterstützung. In individuellen 
            Beratungsgesprächen analysieren wir Ihre beruflichen Ziele, Interessen und Kompetenzen. 
            Gemeinsam entwickeln wir Strategien, die Ihnen helfen, Ihre Karriereziele zu erreichen. 
            Wir unterstützen Sie bei der Planung von Weiterbildungen, beim Wechsel in eine neue Branche oder 
            der Vorbereitung auf Führungsaufgaben. Mit unserer Hilfe gewinnen Sie Klarheit und setzen gezielt 
            die nächsten Schritte auf Ihrem Weg zum Erfolg.
            </p>
            <h3 className="text-2xl font-bold mb-4 text-[#204878]">
              Unsere Leistungen:
            </h3>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
              <li>Analyse Ihrer Stärken, Interessen und Ziele</li>
              <li>Erarbeitung individueller Karriere-Strategien</li>
              <li>Beratung zu Weiterbildung und beruflicher Neuorientierung</li>
            </ul>
            <p className="text-lg leading-relaxed mb-6">
              Mit unserer Unterstützung finden Sie den richtigen Weg für Ihre
              berufliche Zukunft.
            </p>
            <p className="text-xl font-bold mb-4 text-[#204878]">
              Preis: CHF 149 / Stunde
            </p>
            <a
                href="https://calendly.com/armend-cvolution/kennenlern-gesprach"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-3 mt-4 text-white font-bold bg-[#204878] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
                >
                    Jetzt Termin vereinbaren
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}