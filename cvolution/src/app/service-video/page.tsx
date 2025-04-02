"use client";

import Image from "next/image";

export default function ServiceVideo() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#204878]">
          Videobewerbung
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
          {/* Left Section: Image */}
          <div className="flex justify-center">
            <Image
              src="/images/video.png" // Replace with the actual image path
              alt="Videobewerbung"
              width={150}
              height={150}
              className="rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }} // Responsive image
            />
          </div>

          {/* Right Section: Content */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#204878]">
              Ihre Videobewerbung, unser Fokus
            </h2>
            <p className="text-lg leading-relaxed mb-6">
            In einer zunehmend digitalen Welt gewinnt die Videobewerbung immer mehr an Bedeutung. Sie ist eine einzigartige Gelegenheit, Ihre Persönlichkeit, Ihre Kommunikationsfähigkeiten und Ihre Motivation auf direkte und ansprechende Weise zu präsentieren. Unser Team unterstützt Sie bei jedem Schritt des Prozesses. Wir helfen Ihnen, die passenden Inhalte für Ihr Video zu entwickeln, beraten Sie zu Körpersprache, Tonalität und Stil und sorgen für eine professionelle technische Umsetzung. Ob Sie ein Skript benötigen, die Aufnahme organisieren oder das fertige Video bearbeiten möchten – bei uns sind Sie in besten Händen. Mit einer Videobewerbung von CVolution setzen Sie neue Massstäbe und hinterlassen einen bleibenden Eindruck.
            </p>
            <h3 className="text-2xl font-bold mb-4 text-[#204878]">
              Unsere Leistungen:
            </h3>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
              <li>Entwicklung eines persönlichen Konzepts und Skripts</li>
              <li>Unterstützung bei der Aufnahme</li>
              <li>Professionelle Bearbeitung und Feinschliff des Videos</li>
            </ul>
            <p className="text-lg leading-relaxed mb-6">
              Mit einer professionellen Videobewerbung heben Sie sich von der
              Masse ab und erhöhen Ihre Chancen auf ein Vorstellungsgespräch.
            </p>
            <p className="text-xl font-bold mb-4 text-[#204878]">
              Preis: CHF 199
            </p>
            <a
              href="/contact?subject=Videobewerbung"
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