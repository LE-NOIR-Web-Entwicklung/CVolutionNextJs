"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { ShopProductKey } from "@/lib/shop";

const salaryServices = [
  {
    title: "Lohnanalyse mit telefonischer Besprechung",
    description:
      "Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit unserer Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards. Im telefonischen Gespräch ordnen wir die Resultate gemeinsam ein und beantworten Ihre Fragen.",
    services: [
      "Individuelle Lohnanalyse auf Basis Ihrer Angaben",
      "15-minütige telefonische Besprechung",
      "PDF-Dokument der Lohnanalyse im Anschluss",
      "Argumentationsgrundlage für Verhandlungen oder Planung",
    ],
    price: "CHF 119",
    serviceType: "salary_phone" as ShopProductKey,
    badge: "Mit Gespräch",
  },
  {
    title: "Lohnanalyse als PDF",
    description:
      "Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit dieser Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards. Sie übermitteln uns Ihre Angaben und erhalten die Analyse in strukturierter Form als PDF.",
    services: [
      "Individuelle Lohnanalyse auf Basis Ihrer Angaben",
      "Zustellung als vollständiges PDF",
      "Lieferung innerhalb von 2 Arbeitstagen",
      "Transparenter Branchenvergleich",
    ],
    price: "CHF 69",
    serviceType: "salary_pdf" as ShopProductKey,
    badge: "PDF Analyse",
  },
];

export default function ServiceSalary() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-14">
        <div className="absolute inset-x-0 top-0 -z-10 h-[25rem] bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
            <div>
              <Link
                href="/service"
                className="mb-5 inline-flex rounded-md border border-[#204878]/15 bg-white/75 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#204878]"
              >
                Angebot ansehen
              </Link>
              <p className="mb-4 text-sm font-semibold text-[#204878]">Lohnanalyse</p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-tight text-[#101828] text-balance sm:text-5xl lg:text-6xl">
                Wissen, wo Ihr Lohn im Markt steht.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">
                Wir ordnen Ihre Vergütung im Branchenvergleich ein und liefern Ihnen eine klare Grundlage für Planung, Bewerbung oder Verhandlung.
              </p>
            </div>

            <aside className="rounded-3xl bg-[#173d66] p-6 text-white shadow-2xl shadow-[#173d66]/18">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/18">
                  <Image src="/images/search.png" alt="Lohnanalyse" width={36} height={36} className="invert" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/68">Optionen ab</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">CHF 69</p>
                </div>
              </div>
              <p className="mt-6 border-t border-white/18 pt-5 text-sm leading-6 text-white/72">
                PDF innerhalb von 2 Arbeitstagen oder mit persönlicher telefonischer Einordnung.
              </p>
            </aside>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-2">
            {salaryServices.map((salaryService) => (
              <article
                key={salaryService.serviceType}
                className="relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_1.25rem_3.5rem_rgba(15,37,65,0.07)] ring-1 ring-[#dce5ef] transition duration-300 hover:-translate-y-1 hover:shadow-[0_1.75rem_4.5rem_rgba(15,37,65,0.12)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="rounded-md bg-[#eef4fb] px-3 py-1.5 text-sm font-semibold text-[#204878]">
                    {salaryService.badge}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#607089]">Preis</p>
                    <p className="mt-1 text-2xl font-semibold text-[#101828] tabular-nums">{salaryService.price}</p>
                  </div>
                </div>

                <h2 className="mt-7 text-2xl font-semibold tracking-tight text-[#101828] text-balance sm:text-3xl">
                  {salaryService.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-[#607089] text-pretty">
                  {salaryService.description}
                </p>

                <ul className="mt-7 flex-1 space-y-4">
                  {salaryService.services.map((item) => (
                    <li key={item} className="flex gap-3 text-[#40516a]">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-sm font-semibold text-[#204878] ring-1 ring-[#cbd9e8]">
                        ✓
                      </span>
                      <span className="text-base leading-7">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 border-t border-[#e6edf5] pt-5">
                  <AddToCartButton
                    serviceType={salaryService.serviceType}
                    className="w-full rounded-xl bg-[#204878] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#204878]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#173d66] active:translate-y-0"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
