import Link from "next/link";
import type { ReactNode } from "react";

/** Shared building blocks for the salary Ratgeber pages, matching /lohnrechner-schweiz and /lohn-nach-beruf. */
export function GuidePage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-16 pt-10 sm:px-6 sm:pt-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[22rem] bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)]" />
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold text-[#204878]">{eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#101828] text-balance sm:text-5xl">{title}</h1>
          <div className="mt-4 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">{intro}</div>
          {children}
        </div>
      </section>
    </main>
  );
}

export function GuideSection({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section className="mt-12" id={id}>
      <h2 className="text-2xl font-semibold tracking-tight text-[#101828] text-balance sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-[#40516a]">{children}</div>
    </section>
  );
}

export function GuideList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 leading-7">
          <span aria-hidden="true" className="text-[#204878]">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A copyable text template (e-mail, letter, answer). */
export function GuideTemplate({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="rounded-2xl bg-white p-5 ring-1 ring-[#dce5ef] sm:p-6">
      <figcaption className="text-xs font-semibold uppercase tracking-wide text-[#607089]">{label}</figcaption>
      <div className="mt-3 space-y-3 whitespace-pre-line text-[0.95rem] leading-7 text-[#142033]">{children}</div>
    </figure>
  );
}

export function GuideTable({ caption, head, rows, alignRight = true }: { caption: string; head: string[]; rows: ReactNode[][]; alignRight?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-[#dce5ef]">
      <table className={`w-full min-w-[30rem] text-sm ${alignRight ? "text-right" : "text-left"}`}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-[#eef4fb] text-xs uppercase tracking-wide text-[#40516a]">
          <tr>
            {head.map((cell, index) => (
              <th key={index} className={`px-4 py-3 font-semibold ${index === 0 ? "text-left" : ""}`}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e6edf5] text-[#40516a]">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, index) => (
                <td key={index} className={`px-4 py-3 ${index === 0 ? "text-left font-medium text-[#101828]" : "tabular-nums"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-[#204878] underline underline-offset-4">
      {children}
    </Link>
  );
}
