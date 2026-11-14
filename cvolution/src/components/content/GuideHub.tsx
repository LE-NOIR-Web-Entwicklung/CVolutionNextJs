import Link from "next/link";
import { GUIDES, type GuideCategory } from "@/lib/seo-pages";
import { GuideGroup } from "./GuideGroup";

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

      <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
        {GROUPS.map((group) => (
          <GuideGroup
            key={group.title}
            title={group.title}
            text={group.text}
            cta={group.cta}
            guides={GUIDES.filter((guide) => group.categories.includes(guide.category)).map(({ path, label }) => ({ path, label }))}
          />
        ))}
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
