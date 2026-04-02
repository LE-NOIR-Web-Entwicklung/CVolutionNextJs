"use client";

import Link from "next/link";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Angebot", href: "/service" },
    { name: "Über", href: "/about" },
    { name: "Team", href: "/team" },
    // { name: "Self-Service", href: "/self" },
    { name: "Kontakt", href: "/contact" },
  ];

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand + Contact */}
          <div>
            <img src="/images/logo-nobg.png" className="h-8 mb-6" alt="CVolution Logo" />
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:info@cvolution.ch" className="hover:text-white transition-colors">
                  info@cvolution.ch
                </a>
              </li>
              <li>
                <a href="tel:+41764405151" className="hover:text-white transition-colors">
                  +41 76 440 51 51
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/w6xbQW3mxBxoj6sa8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Ausserfeldstrasse 9, 5036 Oberentfelden
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com/cvolutionswitzerland"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://linkedin.com/company/cvolution-gmbh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://instagram.com/cvolution.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Über CVolution</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Wir legen grossen Wert auf Präzision, Kreativität und
              Individualität, damit Ihre Bewerbung auffällt und überzeugt. Mit
              unserer langjährigen Erfahrung und Expertise sind wir der ideale
              Partner für Ihren beruflichen Erfolg.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2.5">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ratgeber */}
          {/* <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Ratgeber</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { name: "Lebenslauf Vorlage", href: "/lebenslauf-vorlage-schweiz" },
                { name: "Lebenslauf Aufbau", href: "/lebenslauf-aufbau" },
                { name: "Lebenslauf Fehler", href: "/lebenslauf-fehler" },
                { name: "Lebenslauf Beispiel", href: "/lebenslauf-beispiel" },
                { name: "Lebenslauf Format", href: "/lebenslauf-format-schweiz" },
                { name: "Lebenslauf Student", href: "/lebenslauf-student" },
                { name: "Lebenslauf Quereinsteiger", href: "/lebenslauf-quereinsteiger" },
                { name: "Motivationsschreiben Tipps", href: "/motivationsschreiben-tipps" },
                { name: "Bewerbung schreiben", href: "/bewerbung-schreiben" },
                { name: "Bewerbung Schweiz", href: "/bewerbung-schweiz" },
                { name: "Bewerbung Vorlage", href: "/bewerbung-vorlage-schweiz" },
                { name: "Bewerbung nach Kündigung", href: "/bewerbung-nach-kuendigung" },
                { name: "Bewerbungsgespräch Tipps", href: "/bewerbungsgespraech-tipps" },
                { name: "Lohn verhandeln", href: "/lohn-verhandeln-schweiz" },
                { name: "Lohnanalyse Schweiz", href: "/lohnanalyse-schweiz" },
                { name: "RAV Bewerbung Tipps", href: "/rav-bewerbung-tipps" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-gray-400 hover:text-white transition-colors leading-relaxed"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>*/}
        </div> 

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} CVolution GmbH. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/agb" className="text-xs text-gray-500 hover:text-white transition-colors">
              AGB
            </Link>
            <Link href="/data" className="text-xs text-gray-500 hover:text-white transition-colors">
              Datenschutz
            </Link>
            <Link href="/impressum" className="text-xs text-gray-500 hover:text-white transition-colors">
              Impressum
            </Link>
          </div>
          <p className="text-xs text-gray-600">
            Entwickelt von{" "}
            <a
              href="https://ha-meira.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              HA MEIRA
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
