"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, FileDown, FileText, LayoutTemplate, Sparkles } from "lucide-react";

const features = [
  {
    title: "CV Self-Service",
    label: "Lebenslauf",
    description: "Profil, Erfahrung, Ausbildung und Fähigkeiten strukturiert erfassen und als professionellen CV exportieren.",
    eyebrow: "01",
    icon: FileText,
    className: "lg:col-span-2",
    tone: "bg-[#204878] text-white",
    labelClassName: "text-white/70",
    descriptionClassName: "text-white/80",
    iconClassName: "bg-white/10 text-white ring-white/20",
    details: ["CV-Daten zentral pflegen", "PDF-Export mit Designs", "Import von CV oder LinkedIn-PDF"],
  },
  {
    title: "AI Motivations-Schreiben",
    label: "Schreibtool",
    description: "Separates Formular für Stelle, Unternehmen, Adresse und Inserat mit formatiertem Word-Download.",
    eyebrow: "02",
    icon: Sparkles,
    className: "lg:col-span-2",
    tone: "bg-white text-[#111827]",
    labelClassName: "text-[#204878]",
    descriptionClassName: "text-[#64748B]",
    iconClassName: "bg-[#EEF4FA] text-[#204878] ring-[#D8E4F0]",
    details: ["Eigener Bereich", "Unternehmensadresse inklusive", "Download als Word-Datei"],
  },
  {
    title: "3 Designs",
    label: "professionell",
    description: "Klassisch, modern und zeitlos für unterschiedliche Bewerbungen.",
    eyebrow: "03",
    icon: LayoutTemplate,
    className: "lg:col-span-1",
    tone: "bg-white text-[#111827]",
    labelClassName: "text-[#204878]",
    descriptionClassName: "text-[#64748B]",
    iconClassName: "bg-[#EEF4FA] text-[#204878] ring-[#D8E4F0]",
    details: ["Klassisch", "Modern", "Zeitlos"],
  },
  {
    title: "CHF 13.90",
    label: "pro Monat",
    description: "Lebenslauf, Designs, Export und KI-Motivationsschreiben im gleichen Abo. Unbegrenzte Änderungen & Unbegrenzte Downloads",
    eyebrow: "Abo",
    icon: FileDown,
    className: "lg:col-span-3",
    tone: "bg-[#EEF4FA] text-[#111827]",
    labelClassName: "text-[#204878]",
    descriptionClassName: "text-[#475569]",
    iconClassName: "bg-white text-[#204878] ring-[#D8E4F0]",
    details: ["Unbegrenzte Änderungen", "Unbegrenzte Downloads", "CV und AI-Schreiben getrennt"],
  },
];

const workflows = [
  {
    label: "CV Self-Service",
    title: "Lebenslauf selbst erstellen & pflegen",
    description:
      "Erfassen Sie Profil, Berufserfahrung, Ausbildung, Sprachen und Fähigkeiten an einem Ort. Der CV-Bereich bleibt bewusst auf Lebenslauf und Export fokussiert.",
    points: ["Strukturierte Daten", "CV-Export", "Profilpflege"],
  },
  {
    label: "AI Motivationsschreiben",
    title: "Schreiben pro Stelle generieren",
    description:
      "Das Motivationsschreiben ist ein eigenes Werkzeug: Stelle, Unternehmen, Adresse und Inserat einfügen, Entwurf prüfen und als Word-Datei herunterladen.",
    points: ["Stellenbezug", "Word-Download", "Entwurf prüfen"],
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

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className={`${feature.className} group flex min-h-64 flex-col justify-between rounded-lg border border-slate-200/80 p-6 shadow-[0_14px_45px_rgba(32,72,120,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(32,72,120,0.14)] ${feature.tone}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-md ring-1 ring-inset ${feature.iconClassName}`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wide ${feature.labelClassName}`}>{feature.eyebrow}</span>
                  </div>
                  <p className={`mt-6 text-xs font-semibold uppercase tracking-wide ${feature.labelClassName}`}>{feature.label}</p>
                  <h2 className="mt-2 max-w-sm text-2xl font-semibold leading-tight text-balance sm:text-3xl">{feature.title}</h2>
                  <p className={`mt-4 max-w-md text-sm leading-relaxed ${feature.descriptionClassName}`}>{feature.description}</p>
                </div>
                {/* <ul className="mt-7 grid gap-2 sm:grid-cols-3 lg:grid-cols-none xl:grid-cols-3">
                  {feature.details.map((detail) => (
                    <li key={detail} className={`flex items-center gap-2 text-sm ${feature.descriptionClassName}`}>
                      <Check className="h-4 w-4 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul> */}
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {workflows.map((workflow) => (
              <section key={workflow.label} className="rounded-lg border border-slate-200/80 bg-white p-7 shadow-[0_14px_45px_rgba(32,72,120,0.07)]">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#204878]">{workflow.label}</p>
                    <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#111827]">{workflow.title}</h2>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#204878]" />
                </div>
                <p className="mt-4 max-w-prose text-base leading-relaxed text-[#64748B]">{workflow.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {workflow.points.map((point) => (
                    <span key={point} className="rounded-md bg-[#EEF4FA] px-3 py-1.5 text-xs font-semibold text-[#204878]">
                      {point}
                    </span>
                  ))}
                </div>
              </section>
            ))}
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
