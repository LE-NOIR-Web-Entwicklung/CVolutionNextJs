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
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-14">
        <div className="absolute inset-x-0 top-0 -z-10 h-[25rem] bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-md border border-[#204878]/15 bg-white/70 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
                Bewerbungsservice aus der Schweiz
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-tight text-[#101828] text-balance sm:text-5xl lg:text-6xl">
                Das passende Paket für Ihren nächsten Karriereschritt.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">
                Von der Standortbestimmung bis zur fertigen Bewerbung: Wir helfen dort, wo Sie gerade stehen, persönlich und mit klarem Blick auf den Schweizer Arbeitsmarkt.
              </p>
            </div>

            <aside className="rounded-3xl bg-[#173d66] p-6 text-white shadow-2xl shadow-[#173d66]/18">
              <p className="text-sm font-medium text-white/70">Was Sie bekommen</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {[
                  ["6", "Services"],
                  ["2 Arbeitstage", "PDF Analyse"],
                  ["CHF 49", "Einstieg"],
                  ["1:1", "Beratung"],
                ].map(([value, label]) => (
                  <div key={label} className="border-t border-white/18 pt-4">
                    <div className="text-xl font-semibold tabular-nums">{value}</div>
                    <div className="mt-1 text-sm text-white/68">{label}</div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
              <article
                key={index}
                className="group relative flex min-h-[20rem] flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_1.25rem_3.5rem_rgba(15,37,65,0.07)] ring-1 ring-[#dce5ef] transition duration-300 hover:-translate-y-1 hover:shadow-[0_1.75rem_4.5rem_rgba(15,37,65,0.12)] focus-within:ring-2 focus-within:ring-[#204878]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#204878] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="mb-7 flex items-start justify-between gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4fb] ring-1 ring-[#d8e4f1] transition duration-300 group-hover:bg-[#204878]">
                    <Image
                      src={product.image}
                      alt=""
                      width={34}
                      height={34}
                      className="transition duration-300 group-hover:invert"
                    />
                  </div>
                  <span className="rounded-md bg-[#f2f6fb] px-2.5 py-1 text-sm font-semibold text-[#204878] tabular-nums">
                    {product.price}
                  </span>
                </div>

                <div className="flex flex-1 flex-col">
                  <h2 className="text-xl font-semibold tracking-tight text-[#101828]">
                    {product.name}
                  </h2>
                  <p className="mt-3 text-[0.95rem] leading-7 text-[#607089] text-pretty">
                    {product.description}
                  </p>
                </div>

                <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#e6edf5] pt-5">
                  <Link
                    href={product.link}
                    className="text-sm font-semibold text-[#204878] transition hover:text-[#102f55] focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#204878] focus-visible:ring-offset-4"
                  >
                    Details ansehen
                    <span aria-hidden="true" className="ml-1 transition group-hover:translate-x-1">→</span>
                  </Link>
                  <div className="w-[10.5rem] max-w-[58%]">
                    <AddToCartButton serviceType={product.serviceType} className="w-full rounded-xl bg-[#204878] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#204878]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#173d66] active:translate-y-0" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
