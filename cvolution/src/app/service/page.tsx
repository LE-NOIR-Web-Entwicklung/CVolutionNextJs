"use client";

import Image from "next/image";

export default function Service() {
  const products = [
    {
      name: "Laufbahnberatung",
      description: "Analyse Ihrer Stärken, Interessen und Ziele. Erarbeitung individueller Karriere-Strategien. Beratung zu Weiterbildung und beruflicher Neuorientierung",
      image: "/images/talk.png",
      price: "CHF 149 / Stunde",
      link: "/service-career",
    },
    {
      name: "Lebenslauf",
      description: "Analyse Ihrer bisherigen beruflichen Laufbahn. Individuelle Gestaltung eines professionellen Lebenslaufs. Anpassung an die gewünschte Position und Branche",
      image: "/images/resume.png",
      price: "CHF 99",
      link: "/service-cv",
    },
    {
      name: "Lohnanalyse",
      description: "Transparenter Vergleich mit branchenüblichen Gehältern. Individuelle Einschätzung basierend auf Ihrer Position und Erfahrung. Wertvolle Argumente für Ihre Gehaltsverhandlung",
      image: "/images/search.png",
      price: "ab CHF 79",
      link: "/service-salary",
    },
    
    
    {
      name: "Motivationsschreiben",
      description: "Gemeinsames Erarbeiten Ihrer individuellen Argumente. Formulierung eines überzeugenden Motivationsschreibens. Angepasst an spezifische Stellenanforderungen",
      image: "/images/copy-writing.png",
      price: "CHF 99",
      link: "/service-motivation",
    },
    {
      name: "RAV Unterstützung",
      description: "Unterstützung bei der Erfüllung von RAV-Vorgaben. Erstellung von Lebenslauf und Motivationsschreiben. Vorbereitung auf Bewerbungsgespräche",
      image: "/images/customer-service.png",
      price: "ab CHF 99",
      link: "/service-rav",
    },
    {
      name: "Videobewerbung",
      description: "Entwicklung eines persönlichen Konzepts und Skripts. Unterstützung bei der Aufnahme. Professionelle Bearbeitung und Feinschliff des Videos",
      image: "/images/video.png",
      price: "CHF 199",
      link: "/service-video",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Unser <span className="text-blue-300">Angebot</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={75}
                  height={75}
                  className="mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-600 mt-2">Preis: {product.price}</p>
                <a
                    href={products[index].link}
                    className="inline-block px-6 py-3 mt-4 text-white font-bold bg-[#4c6c93] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
                  >
                    Angebot
                  </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}