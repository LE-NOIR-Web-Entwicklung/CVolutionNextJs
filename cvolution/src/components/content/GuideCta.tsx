import Link from "next/link";
import { guideFor, type ServiceCta } from "@/lib/seo-pages";

type GuideCtaProps = {
  /** Guide path; the matching paid service comes from GUIDES in seo-pages.ts. */
  path?: string;
  cta?: ServiceCta;
};

/** Closing call to action for every guide: one paid service, one softer alternative. */
export function GuideCta({ path, cta }: GuideCtaProps) {
  const service = cta ?? (path ? guideFor(path)?.service : undefined);
  if (!service) return null;

  return (
    <section className="rounded-2xl bg-[#204878] p-8 text-center text-white">
      <h2 className="mb-3 text-2xl font-semibold text-balance">{service.heading}</h2>
      <p className="mx-auto mb-6 max-w-xl text-blue-100/85 text-pretty">{service.text}</p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={service.href}
          className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-[#204878] transition-colors duration-200 hover:bg-blue-50"
        >
          {service.button}
        </Link>
        <Link
          href="/service"
          className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-white/20"
        >
          Alle Angebote ansehen
        </Link>
      </div>
      <p className="mt-5 text-sm text-blue-100/70">Bezahlung mit TWINT oder Kreditkarte · Recruiting-Profis aus der Schweiz</p>
    </section>
  );
}
