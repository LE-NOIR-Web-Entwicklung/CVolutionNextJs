"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { ShopProductKey } from "@/lib/shop";
 
export default function Service() {
  const products = [
    {
      name: "Laufbahnberatung",
      description: "Analyse Ihrer Stärken, Interessen und Ziele. Erarbeitung individueller Karriere-Strategien. Beratung zu Weiterbildung und beruflicher Neuorientierung",
      image: "/images/talk.png",
      price: "CHF 149 / Stunde",
      link: "/service-career",
      serviceType: "career" as ShopProductKey,
    },
    {
      name: "Lebenslauf",
      description: "Analyse Ihrer bisherigen beruflichen Laufbahn. Individuelle Gestaltung eines professionellen Lebenslaufs. Anpassung an die gewünschte Position und Branche",
      image: "/images/resume.png",
      price: "CHF 99",
      link: "/service-cv",
      serviceType: "cv" as ShopProductKey,
    },
    {
      name: "Lohnanalyse",
      description: "Transparenter Vergleich mit branchenüblichen Gehältern. Individuelle Einschätzung basierend auf Ihrer Position und Erfahrung. Wertvolle Argumente für Ihre Gehaltsverhandlung",
      image: "/images/search.png",
      price: "CHF 69",
      link: "/service-salary",
      serviceType: "salary_pdf" as ShopProductKey,
    },
    {
      name: "Motivationsschreiben",
      description: "Gemeinsames Erarbeiten Ihrer individuellen Argumente. Formulierung eines überzeugenden Motivationsschreibens. Angepasst an spezifische Stellenanforderungen",
      image: "/images/copy-writing.png",
      price: "CHF 99",
      link: "/service-motivation",
      serviceType: "motivation" as ShopProductKey,
    },
    {
      name: "RAV Unterstützung",
      description: "Unterstützung bei der Erfüllung von RAV-Vorgaben. Erstellung von Lebenslauf und Motivationsschreiben. Vorbereitung auf Bewerbungsgespräche",
      image: "/images/customer-service.png",
      price: "ab CHF 99",
      link: "/service-rav",
      serviceType: "rav" as ShopProductKey,
    },
    {
      name: "Check",
      description: "Wir prüfen deinen Lebenslauf, deine Arbeitszeugnisse und weitere Bewerbungsdokumente auf Inhalt, Aufbau, Gestaltung und Formulierungen",
      image: "/images/checked.png",
      price: "CHF 49",
      link: "/service-check",
      serviceType: "check" as ShopProductKey,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#111827] mb-4">
              Unser Angebot
            </h1>
            <p className="text-lg text-[#64748B] max-w-xl mx-auto">
              Professionelle Unterstützung für jeden Schritt Ihrer Karriere.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
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
                  <Link href={product.link} className="text-sm font-medium text-[#204878]">
                    Angebot →
                  </Link>
                </div>
                <AddToCartButton serviceType={product.serviceType} className="mt-5 w-full px-6 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors text-sm text-center" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
