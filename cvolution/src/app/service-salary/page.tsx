"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const salaryServices = [
  {
    title: "Lohnanalyse mit telefonischer Besprechung",
    subtitle: "Ihr Gehalt, unsere Expertise",
    description:
      "Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit unserer Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards. Im telefonischen Gespräch ordnen wir die Resultate gemeinsam ein und beantworten Ihre Fragen.",
    services: [
      "Erstellung einer individuellen Lohnanalyse",
      "Telefonische Besprechung der Resultate in einem 15-minütigen Telefonat",
      "Argumentationsgrundlage für Ihre weitere Planung",
      "Beantwortung Ihrer individuellen Fragen zur Einordnung der Analyse",
      "Vollständiges PDF-Dokument der Lohnanalyse im Anschluss",
      "Transparenter Vergleich mit branchenüblichen Gehältern",
      "Einschätzung basierend auf Position, Erfahrung und Markt",
    ],
    note: "Für alle, die mehr als nur Zahlen wollen.",
    price: "CHF 119",
    href: "/service-salary-tel",
  },
  {
    title: "Lohnanalyse mit PDF",
    subtitle: "Ihr Gehalt, unsere Expertise",
    description:
      "Sind Sie unsicher, ob Ihr Gehalt Ihrer Qualifikation, Erfahrung und der aktuellen Marktlage entspricht? Mit dieser Lohnanalyse erhalten Sie eine fundierte Einschätzung Ihrer aktuellen Vergütung im Vergleich zu branchenüblichen Standards. Sie übermitteln uns Ihre Angaben und erhalten die Analyse in strukturierter Form als PDF.",
    services: [
      "Erstellung einer individuellen Lohnanalyse auf Basis Ihrer Angaben",
      "Zustellung eines vollständigen PDF-Dokuments innerhalb von 2 Arbeitstagen",
      "Argumentationsgrundlage für Ihre weitere Planung",
      "Transparenter Vergleich mit branchenüblichen Gehältern",
      "Einschätzung basierend auf Position, Erfahrung und Markt",
    ],
    note: "Mit dieser Lohnanalyse erhalten Sie eine klare Standortbestimmung für eine fundierte Entscheidungsgrundlage.",
    price: "CHF 69",
    href: "/service-salary-pdf",
  },
];

export default function ServiceSalary() {
  const [externalQuery, setExternalQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const externalParam = params.get("external");
    const isExternal = externalParam
      ? ["1", "true", "yes", "ja"].includes(externalParam.trim().toLowerCase())
      : false;

    setExternalQuery(isExternal ? "?external=1" : "");
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/search.png"
                alt="Lohnanalyse"
                width={72}
                height={72}
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#111827] mb-4">
              Lohnanalyse
            </h1>
            <p className="text-lg text-[#64748B] max-w-xl mx-auto">
              Fundierte Einschätzung Ihrer Vergütung im Branchenvergleich.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {salaryServices.map((salaryService) => (
              <div
                key={salaryService.href}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-[#111827] mb-2">
                    {salaryService.title}
                  </h2>
                  <h3 className="text-base text-[#64748B] mb-5">
                    {salaryService.subtitle}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                    {salaryService.description}
                  </p>
                  <h4 className="text-xs font-semibold text-[#111827] mb-3 uppercase tracking-wide">
                    Unsere Leistungen
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {salaryService.services.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[#64748B]">
                        <svg className="w-4 h-4 text-[#204878] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                    {salaryService.note}
                  </p>
                </div>
                <div className="mt-auto border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-[#64748B] mb-1">Preis</p>
                      <p className="text-2xl font-semibold text-[#111827]">
                        {salaryService.price}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`${salaryService.href}${externalQuery}`}
                    className="block w-full px-6 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors duration-200 text-sm text-center"
                  >
                    Jetzt buchen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
