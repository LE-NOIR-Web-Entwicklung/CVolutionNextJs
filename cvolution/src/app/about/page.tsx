"use client";

import Image from "next/image";
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-[#204878] text-white">
      {/* Content Section */}
      <section className="py-16 px-4 lg:px-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Über <span className="text-blue-300">Uns</span></h2>
      </div>
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          {/* Image Section */}
          <div className="w-full lg:w-1/3 mb-0 lg:mb-0">
            <Image
              src="/images/about.png" 
              alt="About Us"
              width={600}
              height={600}
              className="rounded-lg"
            />
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-bold mb-8 text-left lg:text-left">Wir sind CVolution</h2>
            <p className="text-lg leading-relaxed mb-8">
              Mit über 10 Jahren Erfahrung in der Rekrutierung und im HR wissen wir genau, worauf es ankommt, um bei potenziellen Arbeitgebern zu überzeugen. Wir haben mehr als 10&apos;000 Lebensläufe gesichtet und kennen die Kriterien, die den Unterschied machen.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Unser Name, CVolution, steht für die Entwicklung Ihrer Bewerbung. Jede Karriere ist einzigartig, und wir gestalten Bewerbungsunterlagen, die Ihre Persönlichkeit und Stärken perfekt widerspiegeln. Unser Ziel ist es, Ihnen nicht nur den nächsten Karriereschritt zu erleichtern, sondern langfristig Ihre beruflichen Chancen zu verbessern.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Unser Angebot umfasst die Erstellung professioneller Lebensläufe, individuell abgestimmter Motivationsschreiben und moderner Videobewerbungen. Darüber hinaus bieten wir Laufbahnberatungen und Unterstützung bei den Anforderungen des RAV an. Bei uns erhalten Sie massgeschneiderte Lösungen, die sich an Ihren persönlichen Zielen orientieren.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Wir legen grossen Wert auf Präzision, Kreativität und Individualität, damit Ihre Bewerbung auffällt und überzeugt. Mit unserer langjährigen Erfahrung und Expertise sind wir der ideale Partner für Ihren beruflichen Erfolg.
            </p>
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="py-16 bg-[#0a396b] bg-opacity-90">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Unser <span className="text-blue-300">Team</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              {
                name: "Armend Mustafa",
                position: "CEO / Managing Partner",
                image: "/images/team-1.jpg",
                phone: "+41764405151",
                email: "armend@cvolution.ch",
                linkedin: "https://www.linkedin.com/in/armend-mustafa/",
              },
              {
                name: "Jan Eggenberger",
                position: "Software Engineer",
                image: "/images/team-2.jpg",
                phone: "+41764405151",
                email: "jan@cvolution.ch",
                linkedin: "https://www.linkedin.com/in/jan-eggenberger-987654321/",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-lg text-center"
              >
                <Image
                  src={member.image} 
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.position}</p>
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
