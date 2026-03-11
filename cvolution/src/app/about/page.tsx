import Image from "next/image";
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";

export const metadata = {
  title: "Über uns",
};

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* About Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#111827] mb-4">
              Über Uns
            </h1>
            <p className="text-lg text-[#64748B] max-w-xl mx-auto">
              Ihr Partner für professionelle Bewerbungsoptimierung.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Text Section */}
            <div>
              <h2 className="text-3xl font-semibold text-[#111827] mb-8">Wir sind CVolution</h2>
              <div className="space-y-5 text-base text-[#64748B] leading-relaxed">
                <p>
                  Mit über 10 Jahren Erfahrung in der Rekrutierung und im HR wissen wir genau, worauf es ankommt, um bei potenziellen Arbeitgebern zu überzeugen. Wir haben mehr als 10&apos;000 Lebensläufe gesichtet und kennen die Kriterien, die den Unterschied machen.
                </p>
                <p>
                  Unser Name, CVolution, steht für die Entwicklung Ihrer Bewerbung. Jede Karriere ist einzigartig, und wir gestalten Bewerbungsunterlagen, die Ihre Persönlichkeit und Stärken perfekt widerspiegeln. Unser Ziel ist es, Ihnen nicht nur den nächsten Karriereschritt zu erleichtern, sondern langfristig Ihre beruflichen Chancen zu verbessern.
                </p>
                <p>
                  Unser Angebot umfasst die Erstellung professioneller Lebensläufe, individuell abgestimmter Motivationsschreiben und moderner Videobewerbungen. Darüber hinaus bieten wir Laufbahnberatungen und Unterstützung bei den Anforderungen des RAV an. Bei uns erhalten Sie massgeschneiderte Lösungen, die sich an Ihren persönlichen Zielen orientieren.
                </p>
                <p>
                  Wir legen grossen Wert auf Präzision, Kreativität und Individualität, damit Ihre Bewerbung auffällt und überzeugt. Mit unserer langjährigen Erfahrung und Expertise sind wir der ideale Partner für Ihren beruflichen Erfolg.
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center">
              <Image
                src="/images/about.png"
                alt="About Us"
                width={500}
                height={500}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#0F172A] bg-[#193961]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              Unser Team
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Erfahrene HR-Experten, die Ihre Karriere voranbringen.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
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
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors duration-200"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="rounded-full mx-auto mb-5 object-cover"
                />
                <h3 className="text-lg font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-400 mb-5">{member.position}</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={`tel:${member.phone}`}
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="Telefon"
                  >
                    <FaPhone size={16} />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="E-Mail"
                  >
                    <FaEnvelope size={16} />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors"
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
    </div>
  );
}
