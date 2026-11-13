import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, type Faq } from "@/lib/seo";

type FaqSectionProps = {
  faqs: Faq[];
  heading?: string;
  className?: string;
};

/** Visible FAQ plus matching FAQPage schema, so the markup always mirrors what users see. */
export function FaqSection({ faqs, heading = "Häufige Fragen", className = "" }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className={className}>
      <JsonLd data={faqSchema(faqs)} />
      <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-[#101828] text-balance">
        {heading}
      </h2>
      <div className="mt-5 space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl bg-white p-5 ring-1 ring-[#dce5ef] open:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-[#101828] [&::-webkit-details-marker]:hidden">
              <h3 className="text-base">{faq.question}</h3>
              <span aria-hidden="true" className="mt-0.5 text-[#204878] transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[0.95rem] leading-7 text-[#40516a] text-pretty">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
