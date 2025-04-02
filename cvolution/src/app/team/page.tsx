"use client";

import Image from "next/image";
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Team() {
  const teamMembers = [
    {
      name: "Armend Mustafa",
      position: "Managing Partner",
      image: "/images/team-1.jpg",
      phone: "+41764405151",
      email: "armend@cvolution.ch",
      linkedin: "https://www.linkedin.com/in/armend-mustafa/",
    },
    {
      name: "Jan Eggenberger",
      position: "Software Engineer",
      image: "/images/team-2.jpg",
      phone: "+41796654892",
      email: "jan@cvolution.ch",
      linkedin: "https://www.linkedin.com/in/jan-eggenberger-903517179",
    },
  ];

  return (
    <div className="min-h-screen bg-[#204878] text-white">
      {/* Team Section */}
      <section className="py-16 px-4 lg:px-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Das Team hinter <span className="text-blue-300">CVolution</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white text-black p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-center">{member.position}</p>
                <div className="flex justify-center mt-4 space-x-4">
                  <a
                    href={`tel:${member.phone}`}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaPhone size={20} />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaEnvelope size={20} />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaLinkedin size={20} />
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
