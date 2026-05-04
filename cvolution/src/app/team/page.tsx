"use client";

import Image from "next/image";
import { FaEnvelope, FaLinkedin, FaPhone } from "react-icons/fa";

export default function Team() {
  const teamMembers = [
    {
      name: "Armend Mustafa",
      position: "CEO | Managing Partner",
      image: "/images/team-1.jpg",
      phone: "+41764405151",
      email: "armend@cvolution.ch",
      linkedin: "https://www.linkedin.com/in/armend-mustafa/",
      description:
        "Recruiting, HR-Beratung und strategische Laufbahnfragen mit Blick für klare Positionierung.",
    },
    {
      name: "Jan Eggenberger",
      position: "CTO | Software Engineer",
      image: "/images/team-2.jpg",
      phone: "+41796654892",
      email: "jan@cvolution.ch",
      linkedin: "https://www.linkedin.com/in/jan-eggenberger-903517179",
      description:
        "Software, digitale Prozesse und technische Umsetzung für moderne Bewerbungs- und CV-Services.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_50%_0%,rgba(32,72,120,0.14),transparent_34%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex rounded-md border border-[#204878]/15 bg-white/75 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
              Team
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#101828] text-balance sm:text-5xl lg:text-6xl">
              Das Team hinter CVolution
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty sm:text-lg sm:leading-8">
              Erfahrene Experten mit über 10 Jahren Branchenerfahrung.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["10+", "Jahre Erfahrung"],
              ["HR", "Recruiting-Praxis"],
              ["1:1", "persönliche Begleitung"],
            ].map(([value, label]) => (
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
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {teamMembers.map((member) => (
              <article
                key={member.email}
                className="group overflow-hidden rounded-3xl bg-white shadow-[0_1.5rem_4rem_rgba(15,37,65,0.09)] ring-1 ring-[#dce5ef]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#e9f0f8]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#173d66]/90 to-transparent p-7 pt-20 text-white">
                    <h2 className="text-2xl font-semibold tracking-tight">{member.name}</h2>
                    <p className="mt-1 text-sm text-white/72">{member.position}</p>
                  </div>
                </div>

                <div className="p-7">
                  <p className="text-base leading-8 text-[#607089]">
                    {member.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-[#e6edf5] px-7 py-5">
                  <a
                    href={`tel:${member.phone}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4fb] text-[#204878] transition hover:bg-[#204878] hover:text-white"
                    aria-label="Telefon"
                  >
                    <FaPhone size={16} />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4fb] text-[#204878] transition hover:bg-[#204878] hover:text-white"
                    aria-label="E-Mail"
                  >
                    <FaEnvelope size={16} />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4fb] text-[#204878] transition hover:bg-[#204878] hover:text-white"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
