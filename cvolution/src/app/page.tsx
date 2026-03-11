"use client"

import { useState } from "react";
import Image from "next/image";
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  const slides = [
    {
      title: "Lebenslauf",
      description: "Ein professioneller Lebenslauf ist der Schlüssel zu einem erfolgreichen Bewerbungsprozess.",
      link: "/service-cv"
    },
    {
      title: "Lohnanalyse",
      description: "Erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards.",
      link: "/service-salary"
    },
    {
      title: "Laufbahn-Beratung",
      description: "Unsere Laufbahnberatung bietet Ihnen Orientierung und Unterstützung.",
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
      price: "CHF 69",
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
      name: "Check",
      description: "Wir prüfen deinen Lebenslauf, deine Arbeitszeugnisse und weitere Bewerbungsdokumente auf Inhalt, Aufbau, Gestaltung und Formulierungen",
      image: "/images/checked.png",
      price: "CHF 49",
      link: "/service-check",
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Hero Section */}
      {/* <section className="relative min-h-[88vh] flex flex-col items-center justify-center bg-[#0F172A] overflow-hidden">
        {/* Base gradient 
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e3a5f_0%,_#0F172A_70%)]" />
        {/* Ambient glow behind content 
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#204878]/30 blur-3xl pointer-events-none" />
        {/* Subtle top edge highlight 
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-32">
          {/* Icon 
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-white/10 blur-xl scale-110" />
              <Image
                src={`/images/slider-${currentSlide + 1}.png`}
                alt={`Extra Image ${currentSlide + 1}`}
                width={96}
                height={96}
                className="relative rounded-2xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)] animate-float"
              />
            </div>
          </div>

          {/* Headline
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white leading-tight tracking-tight mb-6">
            {slides[currentSlide].title}
          </h1>

          {/* Description
          <p className="text-lg text-blue-100/80 leading-relaxed max-w-xl mx-auto mb-10">
            {slides[currentSlide].description}
          </p>

          {/* CTA Buttons
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={slides[currentSlide].link}
              className="px-7 py-3.5 bg-white text-[#204878] font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm"
            >
              Jetzt buchen
            </a>
            <a
              href="/service"
              className="px-7 py-3.5 border border-white/20 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 text-sm backdrop-blur-sm"
            >
              Alle Leistungen →
            </a>
          </div>
        </div>

        {/* Slider Controls
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-6 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm border border-white/10"
          aria-label="Vorheriger Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-6 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm border border-white/10"
          aria-label="Nächster Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator 
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section> */}
      <section className="relative min-h-[75vh] flex items-center bg-[#0F172A] text-white overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-[#193961]" />

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#2563EB]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-[#204878]/20 blur-3xl pointer-events-none" />

        {/* Top edge highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center flex flex-col items-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/8 rounded-full text-xs font-medium text-blue-200 mb-10 border border-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              10&apos;000+ analysierte Bewerbungen
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight mb-6 max-w-3xl">
              Unsere Bewerbung,{" "}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">
                deine Entwicklung
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-blue-100/70 leading-relaxed max-w-xl mb-10">
              Unsere Experten unterstützen Sie bei Lebenslauf, Lohnanalyse und Laufbahnberatung – basierend auf über 10&apos;000 analysierten Bewerbungen.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                href="/service-sala"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#0F172A] font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm"
              >
                Lohnanalyse buchen
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/service"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200 border border-white/15 text-sm backdrop-blur-sm"
              >
                Alle Angebote ansehen
              </Link>
            </div>

            {/* Service Highlights */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              {[
                { label: "Lohnanalyse", href: "/service-salary" },
                { label: "Laufbahnberatung", href: "/service-career" },
                { label: "Lebenslauf", href: "/service-cv" },
                { label: "Motivationsschreiben", href: "/service-motivation" },
                { label: "CV Check", href: "/service-check" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-blue-200/70 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all duration-150"
                >
                  <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0F172A]/60 to-transparent pointer-events-none" />
      </section>

      {/* Products Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#111827] mb-4">
              Unser Angebot
            </h2>
            <p className="text-lg text-[#64748B] max-w-xl mx-auto">
              Professionelle Unterstützung für jeden Schritt Ihrer Karriere.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <a
                key={index}
                href={product.link}
                className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
              >
                <div className="mb-5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{product.name}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed flex-1">{product.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#204878]">{product.price}</span>
                  <span className="text-sm font-medium text-[#204878]">
                    Details →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#0F172A] bg-[#193961]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              Unser Team
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Erfahrene Experten, die Ihre Karriere voranbringen.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                name: "Armend Mustafa",
                position: "CEO | Managing Partner",
                image: "/images/team-1.jpg",
                phone: "+41764405151",
                email: "armend@cvolution.ch",
                linkedin: "https://www.linkedin.com/in/armend-mustafa/",
              },
              {
                name: "Jan Eggenberger",
                position: "CTO | Software Engineer",
                image: "/images/team-2.jpg",
                phone: "+41796654892",
                email: "jan@cvolution.ch",
                linkedin: "https://www.linkedin.com/in/jan-eggenberger-903517179",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors duration-200"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="rounded-full mx-auto mb-5 object-cover"
                />
                <h3 className="text-lg font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-400 mb-5">{member.position}</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={`tel:${member.phone}`}
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="Telefon"
                  >
                    <FaPhone size={16} />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="E-Mail"
                  >
                    <FaEnvelope size={16} />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={16} />
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

