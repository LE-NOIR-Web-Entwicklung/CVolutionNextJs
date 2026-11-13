import Link from "next/link";
import type { Guide } from "@/lib/seo-pages";

type RelatedGuidesProps = {
  guides: Guide[];
  heading?: string;
  intro?: string;
  className?: string;
};

export function RelatedGuides({
  guides,
  heading = "Passende Ratgeber",
  intro,
  className = "",
}: RelatedGuidesProps) {
  if (guides.length === 0) return null;

  return (
    <section aria-labelledby="related-guides" className={className}>
      <h2 id="related-guides" className="text-2xl font-semibold tracking-tight text-[#101828] text-balance">
        {heading}
      </h2>
      {intro ? <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-[#607089] text-pretty">{intro}</p> : null}
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <li key={guide.path}>
            <Link
              href={guide.path}
              className="group flex h-full flex-col rounded-xl bg-white p-4 ring-1 ring-[#dce5ef] transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#204878]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607089]">{guide.category}</span>
              <span className="mt-1 font-semibold text-[#204878]">
                {guide.label} <span aria-hidden="true" className="inline-block transition group-hover:translate-x-0.5">→</span>
              </span>
              <span className="mt-1 text-sm leading-6 text-[#607089]">{guide.teaser}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
