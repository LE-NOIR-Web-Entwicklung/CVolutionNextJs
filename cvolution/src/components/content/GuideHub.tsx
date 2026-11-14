import Link from "next/link";
import { GUIDES, type GuideCategory } from "@/lib/seo-pages";

type Group = {
  title: string;
  text: string;
  categories: GuideCategory[];
  cta?: { href: string; heading: string; label: string };
};

const GROUPS: Group[] = [
  {
    title: "Lohn",
    text: "Marktwert kennen und besser verhandeln.",
    categories: ["Lohn"],
    cta: { href: "/service-salary", heading: "Lieber persönlich prüfen lassen?", label: "Lohnanalyse ab CHF 69" },
  },
  { title: "Lebenslauf", text: "Aufbau, Format und Muster nach Schweizer Standard.", categories: ["Lebenslauf"] },
  { title: "Bewerbung & RAV", text: "Vom Motivationsschreiben bis zum Gespräch.", categories: ["Bewerbung", "RAV"] },
];

/** Compact overview of all Ratgeber pages, grouped by topic. Used on the homepage. */
export function GuideHub() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 inline-flex rounded-md border border-[#204878]/15 bg-white/75 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
          Kostenloser Ratgeber
        </p>
        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#101828] text-balance sm:text-5xl">
          Wissen für Ihre Bewerbung
        </h2>
        <p className="mt-4 text-base leading-7 text-[#5d6b7f] text-pretty">
          Anleitungen, Muster und Lohnwissen von unseren Recruiting-Profis.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {GROUPS.map((group) => {
          const guides = GUIDES.filter((guide) => group.categories.includes(guide.category));
          return (
            <section
              key={group.title}
              className="flex flex-col rounded-3xl bg-white p-6 shadow-[0_1.25rem_3.5rem_rgba(15,37,65,0.07)] ring-1 ring-[#dce5ef]"
            >
              <h3 className="text-xl font-semibold tracking-tight text-[#101828]">{group.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#607089]">{group.text}</p>
              <ul className="mt-4 mb-2 divide-y divide-[#e6edf5] border-t border-[#e6edf5]">
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
              {group.cta ? (
                <div className="mt-6 rounded-2xl bg-[#eef4fb] p-5 md:mt-auto">
                  <p className="text-sm font-semibold text-[#101828]">{group.cta.heading}</p>
                  <Link
                    href={group.cta.href}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#204878] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#173d66]"
                  >
                    {group.cta.label} <span aria-hidden="true" className="ml-1.5">→</span>
                  </Link>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-[#607089]">
        Weitere Artikel im{" "}
        <Link href="/blog" className="font-semibold text-[#204878] hover:underline">
          Karriere-Blog
        </Link>
      </p>
    </div>
  );
}
