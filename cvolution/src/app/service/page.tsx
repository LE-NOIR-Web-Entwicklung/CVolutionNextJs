"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SERVICE_OFFERS } from "@/lib/service-offers";

export default function Service() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-14">
        <div className="absolute inset-x-0 top-0 -z-10 h-[25rem] bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-md border border-[#204878]/15 bg-white/70 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
                CVolution Bewerbungsservice
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-tight text-[#101828] text-balance sm:text-5xl lg:text-6xl">
                Das passende Paket für Ihren nächsten Karriereschritt.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">
                Von der Standortbestimmung bis zur fertigen Bewerbung: Wir helfen dort, wo Sie gerade stehen,
                persönlich und mit klarem Blick auf den Schweizer Arbeitsmarkt.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SERVICE_OFFERS.map((product) =>
              product.isPremium ? (
                <article
                  key={product.name}
                  className="relative overflow-hidden rounded-3xl border border-[#bfd2e8] bg-white p-6 shadow-[0_2rem_4rem_rgba(15,37,65,0.12)] ring-1 ring-[#dce5ef] lg:col-span-2"
                >
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-[#204878]" />
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-md bg-[#204878] px-3 py-1.5 text-sm font-semibold text-white">
                      {product.premiumBadge}
                    </span>
                    <span className="rounded-md bg-[#eef4fb] px-3 py-1.5 text-sm font-semibold text-[#204878]">
                      {product.price}
                    </span>
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-[#101828]">{product.name}</h2>
                  <h3 className="mt-3 text-xl font-semibold text-[#204878]">{product.premiumHeadline}</h3>
                  <p className="mt-4 text-base leading-7 text-[#4f6078]">{product.premiumLongDescription}</p>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-[#204878]">Leistungen</h4>
                      <ul className="mt-3 space-y-2.5">
                        {product.premiumServices?.map((service) => (
                          <li key={service} className="flex items-start gap-2 text-sm leading-6 text-[#2b3d57]">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#204878]" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-[#204878]">Ihre Vorteile</h4>
                      <ul className="mt-3 space-y-2.5">
                        {product.premiumBenefits?.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2 text-sm leading-6 text-[#2b3d57]">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#204878]" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-8 text-lg font-semibold text-[#101828]">{product.price}</p>
                  <p className="mt-3 text-base leading-7 text-[#4f6078]">
                    Bereit für deinen nächsten Karriereschritt, mit Unterlagen, Strategie und Verhandlungsargumenten aus einer Hand.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href={product.link} className="inline-flex items-center justify-center rounded-xl bg-[#204878] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#204878]/20 transition hover:bg-[#173d66]">
                      {product.primaryCtaLabel}
                    </Link>
                    <Link href={product.secondaryLink ?? "/service"} className="inline-flex items-center justify-center rounded-xl border border-[#c7d8ea] bg-white px-5 py-3 text-sm font-semibold text-[#204878] transition hover:bg-[#eef4fb]">
                      {product.secondaryCtaLabel}
                    </Link>
                  </div>
                  <p className="mt-4 text-sm text-[#607089]">{product.premiumTrustText}</p>
                </article>
              ) : (
                <article
                  key={product.name}
                  className="group relative flex min-h-[20rem] flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_1.25rem_3.5rem_rgba(15,37,65,0.07)] ring-1 ring-[#dce5ef] transition duration-300 hover:-translate-y-1 hover:shadow-[0_1.75rem_4.5rem_rgba(15,37,65,0.12)] focus-within:ring-2 focus-within:ring-[#204878]"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#204878] opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="mb-7 flex items-start justify-between gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4fb] ring-1 ring-[#d8e4f1] transition duration-300 group-hover:bg-[#204878]">
                      <Image src={product.image} alt="" width={34} height={34} className="transition duration-300 group-hover:invert" />
                    </div>
                    <span className="rounded-md bg-[#f2f6fb] px-2.5 py-1 text-sm font-semibold text-[#204878] tabular-nums">{product.price}</span>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h2 className="text-xl font-semibold tracking-tight text-[#101828]">{product.name}</h2>
                    <p className="mt-3 text-[0.95rem] leading-7 text-[#607089] text-pretty">{product.description}</p>
                  </div>

                  <div className="mt-7 grid grid-cols-1 gap-3 border-t border-[#e6edf5] pt-5 sm:grid-cols-[minmax(0,1fr)_4.5rem]">
                    <Link
                      href={product.link}
                      className="sm:col-span-2 inline-flex w-full items-center justify-center rounded-xl bg-[#204878] px-3 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#204878]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#173d66] active:translate-y-0"
                    >
                      <span>Angebot ansehen</span>
                    </Link>
                  </div>
                </article>
              )
            )}
          </div>

          <section className="mt-12 rounded-3xl border border-[#d7e2ef] bg-white p-6 shadow-[0_1rem_2.5rem_rgba(15,37,65,0.06)] sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[#101828]">Nicht nur ein Lebenslauf. Ein kompletter Bewerbungsauftritt.</h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-[#52637a]">Ein einzelner Lebenslauf hilft dir beim Start. Ein kompletter Bewerbungsauftritt hilft dir, im ganzen Prozess überzeugend zu wirken, von der ersten Bewerbung über LinkedIn bis zum Gespräch und zur Lohnverhandlung.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#dce5ef] bg-[#f9fbfe] p-5">
                <h3 className="text-lg font-semibold text-[#101828]">Einzelservice</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#4f6078]">
                  <li>• Fokus auf ein Dokument</li>
                  <li>• Weniger strategische Begleitung</li>
                  <li>• Ideal für kleine Anpassungen</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[#c5d8eb] bg-[#eef4fb] p-5">
                <h3 className="text-lg font-semibold text-[#101828]">Jobwechsel Komplett</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#2b3d57]">
                  <li>• Unterlagen, LinkedIn, Lohnanalyse und Strategie kombiniert</li>
                  <li>• Persönliche Begleitung während 30 Tagen</li>
                  <li>• Ideal für aktive Jobwechsel und bessere Chancen</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
