import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-[#F8FAFC] min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        {/* 404 number */}
        <p className="text-[120px] font-bold leading-none text-[#204878] opacity-10 select-none">
          404
        </p>

        {/* Icon */}
        <div className="flex justify-center mt-2 mb-6">
          <div className="w-16 h-16 bg-[#204878]/10 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-[#204878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">
          Seite nicht gefunden
        </h1>
        <p className="text-[#64748B] leading-relaxed mb-8">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
          Vielleicht helfen Ihnen diese Links weiter.
        </p>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          {[
            { href: "/", label: "Startseite", desc: "Zurück zur Übersicht" },
            { href: "/service", label: "Unsere Leistungen", desc: "CV, Bewerbung & Coaching" },
            { href: "/lebenslauf-vorlage-schweiz", label: "Lebenslauf Vorlage", desc: "Kostenlose Schweizer Muster" },
            { href: "/bewerbung-schreiben", label: "Bewerbung schreiben", desc: "Schritt-für-Schritt Anleitung" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 text-[#204878] flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                <p className="text-xs text-[#64748B]">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a62] transition-colors duration-200"
        >
          Kontakt aufnehmen
        </Link>

      </div>
    </main>
  );
}
