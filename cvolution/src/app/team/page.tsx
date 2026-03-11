"use client";

import Image from "next/image";
 import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Team() {
  const teamMembers = [
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

  return (
    <div className="min-h-screen bg-[#0F172A] bg-[#193961]">
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">
              Das Team hinter CVolution
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Erfahrene Experten mit über 10 Jahren Branchenerfahrung.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors duration-200"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={112}
                  height={112}
                  className="rounded-full mx-auto mb-5 object-cover"
                />
                <h3 className="text-lg font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-400 mb-6">{member.position}</p>
                <div className="flex justify-center gap-5">
                  <a
                    href={`tel:${member.phone}`}
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="Telefon"
                  >
                    <FaPhone size={18} />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="E-Mail"
                  >
                    <FaEnvelope size={18} />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
