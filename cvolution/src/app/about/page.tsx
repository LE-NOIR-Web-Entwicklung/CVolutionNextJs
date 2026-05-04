import Image from "next/image";
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
              <p className="mb-4 inline-flex rounded-md border border-[#204878]/15 bg-white/70 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
                Über CVolution
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-tight text-[#101828] text-balance sm:text-5xl lg:text-6xl">
                Bewerbungen, die klar zeigen, wer Sie sind.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">
                Wir verbinden Recruiting-Erfahrung, präzise Sprache und modernes Bewerbungsdesign, damit Ihre Unterlagen schneller verstanden werden und besser wirken.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_1.5rem_4rem_rgba(15,37,65,0.12)] ring-1 ring-[#dce5ef]">
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
                <p className="mt-2 text-sm leading-6 text-[#607089]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-6xl gap-6">
          <aside className="rounded-3xl bg-[#173d66] p-7 text-white shadow-2xl shadow-[#173d66]/18">
            <p className="text-sm font-medium text-white/68">Warum wir das tun</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance">
              Gute Unterlagen reduzieren Reibung im Bewerbungsprozess.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">
              Eine Bewerbung muss nicht laut sein. Sie muss verständlich, glaubwürdig und passend sein.
            </p>
          </aside>

          <article className="rounded-3xl bg-white p-7 shadow-[0_1.25rem_3.5rem_rgba(15,37,65,0.07)] ring-1 ring-[#dce5ef] sm:p-9">
            <h2 className="text-3xl font-semibold tracking-tight text-[#101828]">
              Wir sind CVolution
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-[#607089]">
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
              <p className="mt-3 text-sm leading-7 text-[#607089]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <Image
          src="/images/teamsectionbg.png"
          alt="Team section background"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover object-[70%] md:object-center"
        />
        <div className="absolute inset-0 bg-transparent md:bg-[#193961]/60" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Unser Team
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
              Erfahrene Experten, die Ihre Karriere voranbringen.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
            {team.map((member) => (
              <div
                key={member.email}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center transition-colors duration-200 hover:bg-white/10"
              >
                <div className="relative mx-auto mb-6 h-36 w-36 md:h-24 md:w-24">
                  <div className="absolute inset-0 rounded-full ring-2 ring-white/20 ring-offset-4 ring-offset-transparent" />
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover object-top"
                  />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="mb-5 text-sm text-gray-400">{member.position}</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={`tel:${member.phone}`}
                    className="text-gray-500 transition-colors hover:text-white"
                    aria-label="Telefon"
                  >
                    <FaPhone size={16} />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-500 transition-colors hover:text-white"
                    aria-label="E-Mail"
                  >
                    <FaEnvelope size={16} />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 transition-colors hover:text-white"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
