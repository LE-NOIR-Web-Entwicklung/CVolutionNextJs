import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FaqSection } from "@/components/content/FaqSection";
import { RelatedGuides } from "@/components/content/RelatedGuides";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, serviceSchema, type Faq } from "@/lib/seo";
import { guidesForService, metaFor } from "@/lib/seo-pages";
import type { ShopProductKey } from "@/lib/shop";

export const metadata = metaFor("/service-salary");

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

const steps = [
  {
    title: "Variante wählen",
    text: "PDF-Analyse für CHF 69 oder Analyse mit 15-minütigem Telefongespräch für CHF 119.",
  },
  {
    title: "Angaben übermitteln",
    text: "Im Warenkorb erfassen Sie Arbeitsort, Bruttojahreslohn, Pensum und Nebenleistungen und laden Ihre aktuelle Lohnabrechnung hoch.",
  },
  {
    title: "Analyse erhalten",
    text: "Sie erhalten Ihre Lohnanalyse als PDF innerhalb von 2 Arbeitstagen – auf Wunsch mit persönlicher Einordnung am Telefon.",
  },
];

const factors = [
  "Funktion und Verantwortung",
  "Branche und Unternehmensgrösse",
  "Arbeitsort und Kanton",
  "Ausbildung und Berufserfahrung",
  "Pensum und Bruttojahreslohn",
  "Bonus, 13. Monatslohn und Fringe Benefits",
];

const salaryFaqs: Faq[] = [
  {
    question: "Wie viel sollte ich verdienen?",
    answer:
      "Eine allgemeingültige Zahl gibt es nicht. Ihr marktgerechter Lohn hängt von Funktion, Branche, Kanton, Ausbildung, Berufserfahrung, Pensum und Führungsverantwortung ab. Zur Orientierung: Der monatliche Bruttomedianlohn in der Schweiz lag gemäss Lohnstrukturerhebung des BFS 2022 bei rund CHF 6'788. Unsere Lohnanalyse zeigt Ihnen, in welcher Bandbreite Ihr Lohn für Ihr Profil liegen sollte.",
  },
  {
    question: "Wie funktioniert eine Lohnanalyse?",
    answer:
      "Sie übermitteln uns Ihre Angaben zu Stelle, Arbeitsort, Pensum, Lohn und Nebenleistungen sowie Ihre aktuelle Lohnabrechnung. Wir vergleichen Ihre Vergütung mit branchenüblichen Werten für vergleichbare Profile und fassen das Ergebnis mit einer Einschätzung und Argumenten für Ihre Verhandlung in einem PDF zusammen.",
  },
  {
    question: "Was kostet eine Lohnanalyse?",
    answer:
      "Die Lohnanalyse als PDF kostet CHF 69. Mit zusätzlicher 15-minütiger telefonischer Besprechung der Resultate kostet sie CHF 119. Sie bezahlen mit TWINT oder Kreditkarte.",
  },
  {
    question: "Wie lange dauert es, bis ich das Resultat erhalte?",
    answer:
      "Die PDF-Analyse erhalten Sie innerhalb von 2 Arbeitstagen nach Eingang Ihrer vollständigen Angaben. Bei der Variante mit Gespräch vereinbaren wir den Telefontermin direkt mit Ihnen.",
  },
  {
    question: "Welche Angaben brauchen Sie für die Lohnanalyse?",
    answer:
      "Arbeitsort, Bruttojahreslohn, Pensum, allfällige Nebenleistungen (Fringe Benefits) und Ihre aktuelle Lohnabrechnung. Ein Lebenslauf oder Ihr LinkedIn-Profil ist optional, hilft aber bei der genauen Einordnung Ihrer Erfahrung.",
  },
  {
    question: "Was unterscheidet die Lohnanalyse von einem kostenlosen Lohnrechner?",
    answer:
      "Lohnrechner wie Salarium liefern statistische Medianwerte für eine Berufsgruppe. Unsere Analyse berücksichtigt zusätzlich Ihre konkrete Funktion, Ihre Erfahrung und Ihre Nebenleistungen und übersetzt das Ergebnis in Argumente für Ihre Lohnverhandlung. Wie Sie Ihren Lohn selbst vergleichen, erklären wir im Ratgeber Lohnanalyse Schweiz.",
  },
  {
    question: "Wofür kann ich das Resultat nutzen?",
    answer:
      "Für die jährliche Lohnrunde, eine Beförderung, einen Stellenwechsel oder die Frage nach Ihrer Lohnvorstellung im Bewerbungsgespräch. Das PDF dient als sachliche Grundlage für das Gespräch mit Ihrem Arbeitgeber.",
  },
];

export default function ServiceSalary() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <JsonLd
        data={[
          serviceSchema({
            name: "Lohnanalyse Schweiz",
            description:
              "Persönliche Lohnanalyse mit Vergleich zu branchenüblichen Löhnen in der Schweiz, als PDF oder mit telefonischer Besprechung.",
            path: "/service-salary",
            serviceType: "Lohnanalyse",
            offers: [
              { name: "Lohnanalyse als PDF", price: 69 },
              { name: "Lohnanalyse mit telefonischer Besprechung", price: 119 },
            ],
          }),
          breadcrumbSchema([
            { name: "Startseite", path: "/" },
            { name: "Angebot", path: "/service" },
            { name: "Lohnanalyse", path: "/service-salary" },
          ]),
        ]}
      />
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
                Lohnanalyse Schweiz: Wissen, wo Ihr Lohn im Markt steht.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">
                Wir ordnen Ihre Vergütung im Branchenvergleich ein und liefern Ihnen eine klare Grundlage für Planung, Bewerbung oder Verhandlung.
              </p>
            </div>

            <aside className="rounded-3xl bg-[#173d66] p-6 text-white shadow-2xl shadow-[#173d66]/18">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/18">
                  <Image src="/images/search.png" alt="" width={36} height={36} className="invert" priority />
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

          <section aria-labelledby="ablauf" className="mt-16">
            <h2 id="ablauf" className="text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">
              So funktioniert die Lohnanalyse
            </h2>
            <ol className="mt-6 grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="rounded-2xl bg-white p-6 ring-1 ring-[#dce5ef]">
                  <p className="text-sm font-semibold text-[#204878]">Schritt {index + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[#101828]">{step.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-[#607089]">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="faktoren" className="mt-14 grid gap-6 rounded-3xl bg-[#e9f0f8] p-6 ring-1 ring-[#d5e1ee] sm:p-8 lg:grid-cols-2">
            <div>
              <h2 id="faktoren" className="text-2xl font-semibold tracking-tight text-[#101828]">
                Was in Ihre Lohnanalyse einfliesst
              </h2>
              <p className="mt-3 text-[0.95rem] leading-7 text-[#40516a] text-pretty">
                Ein fairer Lohn ist mehr als eine Zahl aus einem Lohnrechner. Wir vergleichen Ihr Gesamtpaket mit
                Profilen, die Ihrem wirklich entsprechen – und sagen Ihnen, welche Argumente Sie in der Verhandlung haben.
              </p>
              <p className="mt-3 text-[0.95rem] leading-7 text-[#40516a] text-pretty">
                Sie möchten Ihren Lohn zuerst selbst einordnen? Im Ratgeber{" "}
                <Link href="/lohnanalyse-schweiz" className="font-semibold text-[#204878] underline underline-offset-4">
                  Lohnanalyse Schweiz
                </Link>{" "}
                zeigen wir die wichtigsten Quellen. Wie Sie das Ergebnis im Gespräch einsetzen, lesen Sie unter{" "}
                <Link href="/lohn-verhandeln-schweiz" className="font-semibold text-[#204878] underline underline-offset-4">
                  Lohn verhandeln
                </Link>
                .
              </p>
            </div>
            <ul className="grid content-start gap-3 sm:grid-cols-2">
              {factors.map((factor) => (
                <li key={factor} className="flex gap-3 rounded-xl bg-white p-4 text-sm font-medium text-[#40516a] ring-1 ring-[#d5e1ee]">
                  <span aria-hidden="true" className="text-[#204878]">✓</span>
                  {factor}
                </li>
              ))}
            </ul>
          </section>

          <FaqSection faqs={salaryFaqs} heading="Häufige Fragen zur Lohnanalyse" className="mt-14" />

          <RelatedGuides guides={guidesForService("/service-salary")} className="mt-14" />

          <div className="mt-14 flex flex-col gap-4 rounded-2xl bg-[#173d66] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-lg font-semibold">Jetzt Lohnanalyse bestellen – ab CHF 69</p>
              <p className="mt-1 text-sm text-white/72">PDF in 2 Arbeitstagen · Bezahlung mit TWINT oder Kreditkarte</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AddToCartButton
                serviceType="salary_pdf"
                label="PDF-Analyse · CHF 69"
                className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-[#173d66] transition hover:bg-[#eef4fb]"
              />
              <AddToCartButton
                serviceType="salary_phone"
                label="Mit Gespräch · CHF 119"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/20"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
