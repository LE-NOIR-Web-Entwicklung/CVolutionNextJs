"use client";

import Link from "next/link";
import { useId, useState } from "react";

type GuideGroupProps = {
  title: string;
  text: string;
  guides: { path: string; label: string }[];
  cta?: { href: string; heading: string; label: string };
};

/**
 * Accordion row on mobile, always-open card from md upwards.
 * Closed panels use `hidden md:block`, so the links stay in the HTML for crawlers.
 */
export function GuideGroup({ title, text, guides, cta }: GuideGroupProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section className="flex flex-col rounded-2xl bg-white ring-1 ring-[#dce5ef] md:rounded-3xl md:p-6 md:shadow-[0_1.25rem_3.5rem_rgba(15,37,65,0.07)]">
      <h3 className="md:pointer-events-none">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#204878] md:cursor-default md:p-0"
        >
          <span>
            <span className="block text-lg font-semibold tracking-tight text-[#101828] md:text-xl">{title}</span>
            <span className="mt-0.5 block text-sm text-[#607089] md:hidden">{guides.length} Ratgeber</span>
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`h-5 w-5 shrink-0 text-[#204878] transition-transform duration-200 md:hidden ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </h3>

      <div id={panelId} className={`${open ? "block" : "hidden"} flex-1 flex-col px-5 pb-5 md:flex md:p-0`}>
        <p className="hidden text-sm leading-6 text-[#607089] md:mt-1 md:block">{text}</p>
        <ul className="mb-2 divide-y divide-[#e6edf5] border-t border-[#e6edf5] md:mt-4">
          {guides.map((guide) => (
            <li key={guide.path}>
              <Link
                href={guide.path}
                className="group flex items-center justify-between gap-3 py-3 text-[0.95rem] font-medium text-[#204878] transition hover:text-[#101828] focus:outline-none focus-visible:underline"
              >
                {guide.label}
                <span aria-hidden="true" className="text-[#9aaabd] transition group-hover:translate-x-0.5 group-hover:text-[#204878]">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {cta ? (
          <div className="mt-4 rounded-2xl bg-[#eef4fb] p-4 md:mt-auto md:p-5">
            <p className="text-sm font-semibold text-[#101828]">{cta.heading}</p>
            <Link
              href={cta.href}
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#204878] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#173d66]"
            >
              {cta.label} <span aria-hidden="true" className="ml-1.5">→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
