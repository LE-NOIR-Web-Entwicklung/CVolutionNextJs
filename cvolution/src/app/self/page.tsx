"use client";

import { useState } from "react";
import Link from "next/link";

const features = [
  {
    title: "CV Self-Service",
    label: "Lebenslauf",
    description: "Profil, Erfahrung, Ausbildung und Fähigkeiten strukturiert erfassen und als professionellen CV exportieren.",
  },
  {
    title: "AI Motivations-Schreiben",
    label: "Schreibtool",
    description: "Separates Formular für Stelle, Unternehmen, Adresse und Inserat mit formatiertem DOCX-Download.",
  },
  {
    title: "3 Designs",
    label: "professionell",
    description: "Klassisch, modern und zeitlos für unterschiedliche Bewerbungen.",
  },
  {
    title: "Sofort nutzbar",
    label: "Self-Service",
    description: "Lebenslauf online erstellen, bearbeiten und jederzeit herunterladen.",
  },
];

const benefits = [
  "Einfache Benutzeroberfläche",
  "Professioneller CV-Export",
  "Word Download für Motivationsschreiben",
  "Anpassung an konkrete Stellenanzeigen",
  "Unbegrenzt veränderbar",
  "Unbegrenzte Downloads",
  "Sichere Datenspeicherung",
  "Zugriff von überall",
];

const designs = [
  {
    title: "Klassisch",
    image: "/images/cv-designs/cv-design-klassisch.png",
  },
  {
    title: "Modern",
    image: "/images/cv-designs/cv-design-modern.png",
  },
  {
    title: "Zeitlos",
    image: "/images/cv-designs/cv-design-zeitlos.png",
  },
];

function DesignShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div>
          <h2 className="text-xl font-semibold text-[#111827]">Unsere 3 professionellen Designs</h2>
          <p className="mt-1 text-sm text-[#64748B]">Wählen Sie den Stil, der zu Ihrer Bewerbung passt.</p>
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-[#64748B] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[4200px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="grid gap-5 border-t border-gray-100 p-6 md:grid-cols-3">
          {designs.map((design) => (
            <div key={design.title} className="overflow-hidden rounded-xl border border-gray-100 bg-[#F8FAFC]">
              <div className="aspect-[1/1.38]">
                <img src={design.image} alt={`Lebenslauf Design ${design.title}`} className="h-full w-full object-cover" />
              </div>
              <div className="border-t border-gray-100 bg-white px-4 py-3">
                <h3 className="text-center text-sm font-semibold text-[#111827]">{design.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Self() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#204878]">Self-Service</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
              CV Self-Service und AI Motivationsschreiben, klar getrennt.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#64748B]">
              Pflegen Sie zuerst Ihren Lebenslauf im Self-Service. Danach erstellen Sie im separaten AI-Bereich ein passendes Motivationsschreiben mit Stellenanzeige und Unternehmensadresse.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/self/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#204878] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#1a3a66]"
            >
              Jetzt Self-Service starten
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#204878]">{feature.label}</p>
                <h2 className="mt-3 text-3xl font-semibold text-[#111827]">{feature.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[#64748B]">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#204878]">CV Self-Service</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#111827]">Lebenslauf selbst erstellen und pflegen</h2>
              <p className="mt-4 text-base leading-relaxed text-[#64748B]">
                Erfassen Sie Profil, Berufserfahrung, Ausbildung, Sprachen und Fähigkeiten an einem Ort. Der CV-Bereich bleibt bewusst auf Lebenslauf und Export fokussiert.
              </p>
            </section>
            <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#204878]">AI Motivationsschreiben</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#111827]">Schreiben pro Stelle generieren</h2>
              <p className="mt-4 text-base leading-relaxed text-[#64748B]">
                Das Motivationsschreiben ist ein eigenes Werkzeug: Stelle, Unternehmen, Adresse und Inserat einfügen, Entwurf prüfen und als Word-Datei herunterladen.
              </p>
            </section>
          </div>

          <div className="mt-8 space-y-8">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#111827]">Alles für Ihre Bewerbung</h2>
              <p className="mt-4 text-base leading-relaxed text-[#64748B]">
                Der Self-Service ist ideal, wenn Sie Ihre Bewerbungsunterlagen selbst pflegen möchten, aber trotzdem eine professionelle Struktur und Formulierung wünschen.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-[#64748B]">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#204878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <DesignShowcase />
          </div>
        </div>
      </section>
    </main>
  );
}
