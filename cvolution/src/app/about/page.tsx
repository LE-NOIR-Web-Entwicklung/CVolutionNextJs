"use client";

import Image from "next/image";

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
            src="/images/about.png" // Replace with your image path
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
            Mit über 10 Jahren Erfahrung in der Rekrutierung und im HR wissen wir genau, worauf es ankommt, um bei potenziellen Arbeitgebern zu überzeugen. Wir haben mehr als 10'000 Lebensläufe gesichtet und kennen die Kriterien, die den Unterschied machen.
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
    </div>
  );
}
