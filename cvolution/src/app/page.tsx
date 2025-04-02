"use client"

import { useState } from "react";
import Image from "next/image";
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Home() {
  const slides = [
    {
      title: "Lebenslauf",
      description: "Ein professioneller Lebenslauf ist der Schlüssel zu einem erfolgreichen Bewerbungsprozess.",
      link: "/service-cv"
    },
    {
      title: "Lohnanalyse",
      description: "Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit unserer Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards.",
      link: "/service-salary"
    },
    {
      title: "Laufbahnberatung",
      description: "Die Berufswelt verändert sich rasant, und manchmal ist es schwierig, den richtigen Weg zu finden. Ob Sie in Ihrer aktuellen Position unzufrieden sind, nach neuen Herausforderungen suchen oder Ihre Karriere strategisch weiterentwickeln möchten – unsere Laufbahnberatung bietet Ihnen Orientierung und Unterstützung.",
      link: "/service-career"
    },
  ];

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
      link: "/service-cover-letter",
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

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-[#204878] text-white">
          {/* Slide Content */}
          <div className="text-left w-1/2 ml-50">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg sm:text-xl">{slides[currentSlide].description}</p>
            <a
              href={slides[currentSlide].link}
              className="inline-block px-6 py-3 mt-4 text-white font-bold bg-[#4c6c93] rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
            >
              Angebot
            </a>
          </div>
          {/* Extra Image */}
          <div className="w-1/2 flex justify-start">
            <Image
              src={`/images/slider-${currentSlide + 1}.png`} 
              alt={`Extra Image ${currentSlide + 1}`}
              width={400}
              height={300}
              className="rounded-lg animate-float"
            />
          </div>
        {/* Slider Controls */}
        <div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0.5 transform -translate-y-1/2 bg-white text-blue-950 p-2 rounded-full shadow hover:bg-gray-200 ml-4"
          >
            &#8249;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-blue-950 p-2 rounded-full shadow hover:bg-gray-200"
          >
            &#8250;
          </button>
        </div>
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </section>

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

      {/* Team Section */}
      <section className="py-16 bg-[#0a396b] bg-opacity-90">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Unser <span className="text-blue-300">Team</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              {
                name: "Armend Mustafa",
                position: "CEO / Managing Partner",
                image: "/images/team-1.jpg",
                phone: "+41764405151",
                email: "armend@cvolution.ch",
                linkedin: "https://www.linkedin.com/in/armend-mustafa-123456789/",
              },
              {
                name: "Jan Eggenberger",
                position: "Software Engineer",
                image: "/images/team-2.jpg",
                phone: "+41764405151",
                email: "jan@cvolution.ch",
                linkedin: "https://www.linkedin.com/in/jan-eggenberger-987654321/",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-lg text-center"
              >
                <Image
                  src={member.image} 
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.position}</p>
                <div className="flex justify-center mt-4 space-x-4">
                  <a
                    href={`tel:${member.phone}`}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaPhone size={20} />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaEnvelope size={20} />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaLinkedin size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}