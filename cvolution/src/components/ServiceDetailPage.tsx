"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { ShopProductKey } from "@/lib/shop";

type ServiceDetailPageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  introTitle: string;
  description: string;
  servicesTitle?: string;
  services: string[];
  closingText: string;
  price: string;
  priceSuffix?: string;
  serviceType: ShopProductKey;
};

export function ServiceDetailPage({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  introTitle,
  description,
  servicesTitle = "Unsere Leistungen",
  services,
  closingText,
  price,
  priceSuffix,
  serviceType,
}: ServiceDetailPageProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[20rem] bg-[radial-gradient(circle_at_28%_0%,rgba(32,72,120,0.14),transparent_30%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)]" />

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
            <div>
              <p
                className="mb-4 inline-flex rounded-md border border-[#204878]/15 bg-white/80 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#204878]"
              >
                CVolution Bewerbungsservice
              </p>
              <p className="mb-3 text-sm font-semibold text-[#204878]">{eyebrow}</p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-[#101828] text-balance sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty">
                {subtitle}
              </p>
            </div>

            <aside className="rounded-2xl bg-[#173d66] p-5 text-white shadow-xl shadow-[#173d66]/16">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/18">
                  <Image src={image} alt={imageAlt} width={32} height={32} className="invert" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/68">Preis</p>
                  <p className="mt-0.5 text-2xl font-semibold tabular-nums">
                    {price}
                    {priceSuffix ? <span className="text-base font-normal text-white/68"> {priceSuffix}</span> : null}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-white/18 pt-4">
                <AddToCartButton
                  serviceType={serviceType}
                  className="w-full rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-[#173d66] shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#eef4fb] active:translate-y-0"
                />
              </div>
            </aside>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <article className="rounded-2xl bg-white p-6 shadow-[0_1rem_2.75rem_rgba(15,37,65,0.06)] ring-1 ring-[#dce5ef] sm:p-7">
              <h2 className="text-2xl font-semibold tracking-tight text-[#101828] text-balance">
                {introTitle}
              </h2>
              <p className="mt-4 max-w-3xl text-[0.95rem] leading-8 text-[#607089] text-pretty">
                {description}
              </p>
              <p className="mt-5 max-w-3xl text-[0.95rem] leading-8 text-[#607089] text-pretty">
                {closingText}
              </p>
            </article>

            <aside className="rounded-2xl bg-[#e9f0f8] p-6 ring-1 ring-[#d5e1ee]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#204878]">
                {servicesTitle}
              </h2>
              <ul className="mt-5 space-y-3.5">
                {services.map((item) => (
                  <li key={item} className="flex gap-3 text-[#40516a]">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#204878] ring-1 ring-[#cbd9e8]">
                      ✓
                    </span>
                    <span className="text-sm leading-6">{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
