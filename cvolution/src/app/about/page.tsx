import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaLinkedin, FaPhone } from "react-icons/fa";

export const metadata = {
  title: "Über uns",
};

const stats = [
  ["10+", "Jahre Recruiting-Erfahrung"],
  ["10'000+", "gesichtete Lebensläufe"],
  ["1:1", "persönliche Beratung"],
];

const principles = [
  {
    title: "Präzise",
    text: "Wir schauen genau hin: Struktur, Sprache, Wirkung und Passung zur Zielrolle.",
  },
  {
    title: "Persönlich",
    text: "Ihre Bewerbung soll nicht generisch wirken, sondern Ihre Erfahrung und Ziele klar abbilden.",
  },
  {
    title: "Praxisnah",
    text: "Unsere Empfehlungen kommen aus realer Recruiting- und HR-Erfahrung im Schweizer Arbeitsmarkt.",
  },
];

const team = [
  {
    name: "Armend Mustafa",
    position: "CEO | Managing Partner",
    image: "/images/team-1.jpg",
    phone: "+41764405151",
    email: "armend@cvolution.ch",
    linkedin: "https://www.linkedin.com/in/armend-mustafa/",
  },
  {
    name: "Jan Eggenberger",
    position: "CTO | Software Engineer",
    image: "/images/team-2.jpg",
    phone: "+41796654892",
    email: "jan@cvolution.ch",
    linkedin: "https://www.linkedin.com/in/jan-eggenberger-903517179",
  },
];

export default function About() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-16">
        <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_24%_4%,rgba(32,72,120,0.16),transparent_31%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-[#204878]/15 bg-white/70 px-3 py-1 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
                Über CVolution
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] text-[#101828] text-balance sm:text-5xl lg:text-6xl">
                Bewerbungen, die klar zeigen, wer Sie sind.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#4f5d72] text-pretty sm:text-lg sm:leading-8">
                Wir verbinden Recruiting-Erfahrung, präzise Sprache und modernes Bewerbungsdesign, damit Ihre Unterlagen schneller verstanden werden und besser wirken.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_1.5rem_4rem_rgba(15,37,65,0.12)] ring-1 ring-[#dce5ef]">
              <Image
                src="/images/about.jpg"
                alt="CVolution Beratung"
                width={560}
                height={520}
                className="aspect-[1.08] w-full object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#173d66]/90 to-transparent p-6 pt-16 text-white">
                <p className="text-sm font-medium text-white/72">Unser Fokus</p>
                <p className="mt-1 text-xl font-semibold">Ihre nächste berufliche Entscheidung.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl bg-white p-6 shadow-[0_1rem_2.75rem_rgba(15,37,65,0.06)] ring-1 ring-[#dce5ef]"
              >
                <p className="text-3xl font-semibold text-[#204878] tabular-nums">{value}</p>
                <p className="mt-2 text-sm leading-6 text-[#4f5d72]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-6xl gap-6">
          <aside className="rounded-2xl bg-[#173d66] p-7 text-white shadow-2xl shadow-[#173d66]/18">
            <p className="text-sm font-medium text-white/68">Warum wir das tun</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance">
              Gute Unterlagen reduzieren Reibung im Bewerbungsprozess.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">
              Eine Bewerbung muss nicht laut sein. Sie muss verständlich, glaubwürdig und passend sein.
            </p>
          </aside>

          <article className="rounded-2xl bg-white p-7 shadow-[0_1.25rem_3.5rem_rgba(15,37,65,0.07)] ring-1 ring-[#dce5ef] sm:p-9">
            <h2 className="text-3xl font-semibold tracking-tight text-[#101828]">
              Wir sind CVolution
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-[#4f5d72]">
              <p>
                Mit über 10 Jahren Erfahrung in der Rekrutierung und im HR wissen wir, worauf es ankommt, um bei potenziellen Arbeitgebern zu überzeugen. Wir haben mehr als 10&apos;000 Lebensläufe gesichtet und kennen die Kriterien, die den Unterschied machen.
              </p>
              <p>
                CVolution steht für die Entwicklung Ihrer Bewerbung. Jede Karriere ist einzigartig, und wir gestalten Unterlagen, die Persönlichkeit, Stärken und Ziele klar sichtbar machen.
              </p>
              <p>
                Unser Angebot umfasst professionelle Lebensläufe, Motivationsschreiben, Lohnanalysen, Laufbahnberatung und Unterstützung bei RAV-Anforderungen. Bei uns erhalten Sie Lösungen, die sich an Ihrer Situation orientieren.
              </p>
            </div>
          </article>
        </div>

        <div className="mx-auto mt-6 grid max-w-6xl gap-5 md:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow-[0_1rem_2.75rem_rgba(15,37,65,0.06)] ring-1 ring-[#dce5ef]"
            >
              <h3 className="text-xl font-semibold tracking-tight text-[#101828]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#4f5d72]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#101828] sm:text-4xl">Unser Team</h2>
              <p className="mt-3 text-base leading-7 text-[#4f5d72]">
                Erfahrene Experten, die Ihre Karriere voranbringen.
              </p>
            </div>
            <Link
              href="/team"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#204878]"
            >
              Team kennenlernen
              <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {team.map((member) => (
              <article
                key={member.email}
                className="flex items-center gap-5 rounded-2xl bg-[#f4f7fb] p-5 ring-1 ring-[#dce5ef]"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#e9f0f8]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="6rem"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#101828]">{member.name}</h3>
                  <p className="mt-0.5 text-sm text-[#4f5d72]">{member.position}</p>
                  <div className="mt-3 flex gap-2">
                    {[
                      { href: `tel:${member.phone}`, label: "Telefon", icon: FaPhone },
                      { href: `mailto:${member.email}`, label: "E-Mail", icon: FaEnvelope },
                      { href: member.linkedin, label: "LinkedIn", icon: FaLinkedin, external: true },
                    ].map(({ href, label, icon: ContactIcon, external }) => (
                      <a
                        key={label}
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#204878] ring-1 ring-[#dce5ef] transition hover:bg-[#204878] hover:text-white"
                        aria-label={`${label} ${member.name}`}
                      >
                        <ContactIcon size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
