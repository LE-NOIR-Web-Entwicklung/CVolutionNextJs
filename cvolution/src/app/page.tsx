"use client"

import { useState } from "react";
import Image from "next/image";
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Coins,
  Compass,
  Download,
  FileCheck,
  FileText,
  FileUser,
  MonitorSmartphone,
  PenLine,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { OFFER_CARDS } from "@/lib/service-offers";
import { SERVICE_DOWNLOADS_PATH } from "@/lib/service-downloads";

const OFFER_ICONS: Record<string, LucideIcon> = {
  "/self": MonitorSmartphone,
  "/service-salary": Coins,
  "/service-cv": FileUser,
  "/service-motivation": PenLine,
  "/service-career": Compass,
  "/service-check": FileCheck,
  [SERVICE_DOWNLOADS_PATH]: Download,
  "/service-linkedin": UserRound,
  "/service-rav": Briefcase,
};

const TEAM = [
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
];

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
      <section className="relative min-h-[calc(100svh-4rem)] flex items-center text-white overflow-hidden bg-[#102a45]">
        {/* Hero background image */}
        <Image
          src="/images/hero2.png"
          alt="Hero background"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover object-center scale-[1.03] saturate-[0.92] contrast-[1.08]"
          priority
        />
        {/* Dark overlay to keep text readable */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,28,48,0.70)_0%,rgba(18,49,82,0.66)_50%,rgba(20,42,66,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_21%,rgba(255,255,255,0.13),transparent_36%),linear-gradient(180deg,rgba(8,21,36,0.18)_0%,rgba(8,21,36,0.02)_72%,rgba(8,21,36,0.12)_100%)]" />
        <div className="absolute inset-0 opacity-[0.16] mix-blend-soft-light [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:72px_72px]" />

        {/* Top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.09] px-3.5 py-2 text-xs font-semibold text-white/82 shadow-[0_1rem_3rem_rgba(0,0,0,0.16)] backdrop-blur-md mb-7">
              <span className="h-1.5 w-1.5 rounded-full bg-white/78" />
              1000+ Kunden bereits erfolgreich unterstützt
            </div>

            {/* Headline */}
            <h1 className="max-w-5xl text-[clamp(2.5rem,7vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.035em] mb-6 text-white [text-wrap:balance]">
              Unsere Bewerbung,{" "}
              <br className="hidden sm:block" />
              <span className="relative inline-block">
                Ihre Entwicklung.
                <span aria-hidden="true" className="absolute -bottom-1 left-0 right-0 h-[0.08em] rounded-full bg-white/35 sm:-bottom-2" />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-2xl text-base leading-8 text-white/74 sm:text-lg mb-8">
              Mit über 10 Jahren Recruiting-Erfahrung unterstützen wir Sie bei Lebenslauf,
              Lohnanalyse und Laufbahnberatung. Oder Sie erstellen Ihre Bewerbung
              selbst, mit Self-Service und Downloads.
            </p>

            {/* CTA Buttons */}
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center mb-6">
              <Link
                href="/self"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] shadow-[0_1rem_2.5rem_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f4f7fb]"
              >
                Self-Service starten
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/service-salary"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/[0.12]"
              >
                Lohnanalyse buchen
              </Link>
            </div>
            <Link
              href="/service"
              className="group mb-10 inline-flex items-center gap-1.5 text-sm font-medium text-white/75 underline-offset-4 transition hover:text-white hover:underline sm:mb-14"
            >
              Alle Angebote ansehen
              <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
            </Link>

            {/* Service Highlights */}
            {/* <div className="grid w-full max-w-[18.5rem] grid-cols-2 justify-items-stretch gap-2 text-xs sm:flex sm:max-w-6xl sm:flex-wrap sm:justify-center sm:text-sm lg:flex-nowrap">
              {[
                { label: "Lohnanalyse", href: "/service-salary" },
                { label: "Laufbahnberatung", href: "/service-career" },
                { label: "Lebenslauf", href: "/service-cv" },
                { label: "LinkedIn Profil", href: "/service-linkedin" },
                { label: "Motivationsschreiben", href: "/service-motivation" },
                { label: "CV Check", href: "/service-check" },
                { label: "Self-Service", href: "/self" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-white/14 bg-white/[0.08] px-3 py-2 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_0.75rem_2rem_rgba(4,18,34,0.10)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/28 hover:bg-white/[0.15] hover:text-white sm:min-h-10 sm:justify-start sm:gap-2 sm:px-4"
                >
                  <svg className="h-2.5 w-2.5 flex-shrink-0 text-white/48 transition duration-300 group-hover:text-white/88 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </div> */}

          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="angebote" className="relative isolate overflow-hidden bg-[#f4f7fb] px-5 py-20 text-[#142033] sm:px-6 sm:py-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(32,72,120,0.12),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f4f7fb_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold leading-tight text-[#101828] text-balance sm:text-5xl">
              Unser Angebot
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4f5d72] text-pretty">
              Professionelle Unterstützung für jeden Schritt Ihrer Karriere.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {OFFER_CARDS.map((product) => {
              const Icon = OFFER_ICONS[product.link] ?? FileText;
              return (
                <Link
                  key={product.name}
                  href={product.link}
                  className="group relative flex flex-col rounded-2xl bg-white p-6 shadow-[0_1rem_3rem_rgba(15,37,65,0.06)] ring-1 ring-[#dce5ef] transition duration-300 hover:-translate-y-1 hover:shadow-[0_1.5rem_4rem_rgba(15,37,65,0.12)] hover:ring-[#204878]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878]"
                >
                  <div className="mb-6 flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4fb] text-[#204878] transition duration-300 group-hover:bg-[#204878] group-hover:text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-[#f2f6fb] px-3 py-1 text-sm font-semibold text-[#204878] tabular-nums">
                      {product.price}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#101828]">
                    {product.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-7 text-[#4f5d72] text-pretty">
                    {product.description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#204878]">
                    Angebot ansehen
                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-4xl font-bold text-[#101828] text-balance sm:text-5xl">
              Unser Team
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4f5d72] text-pretty">
              Erfahrene Experten, die Ihre Karriere voranbringen.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {TEAM.map((member) => (
              <article
                key={member.email}
                className="group overflow-hidden rounded-2xl bg-white shadow-[0_1.5rem_4rem_rgba(15,37,65,0.09)] ring-1 ring-[#dce5ef]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e9f0f8]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 768px) 28rem, 100vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#173d66]/90 to-transparent p-6 pt-20 text-white">
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="mt-1 text-sm text-white/80">{member.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-5">
                  {[
                    { href: `tel:${member.phone}`, label: "Telefon", icon: FaPhone },
                    { href: `mailto:${member.email}`, label: "E-Mail", icon: FaEnvelope },
                    { href: member.linkedin, label: "LinkedIn", icon: FaLinkedin, external: true },
                  ].map(({ href, label, icon: ContactIcon, external }) => (
                    <a
                      key={label}
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef4fb] text-[#204878] transition hover:bg-[#204878] hover:text-white"
                      aria-label={`${label} ${member.name}`}
                    >
                      <ContactIcon size={16} />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
