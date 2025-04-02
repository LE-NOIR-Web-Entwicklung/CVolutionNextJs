"use client";

import Link from "next/link";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#204878] text-white py-10">
      <div className="container mx-auto px-4">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: <a href="mailto:info@cvolution.ch" className="hover:underline">info@cvolution.ch</a></li>
              <li>Telefon: <a href="tel:+41764405151" className="hover:underline">+41 76 440 51 51</a></li>
              <li>Adresse: Kasernenstrasse 28, 5000 Aarau</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com/cvolutionswitzerland"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://linkedin.com/company/cvolution-gmbh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://instagram.com/cvolution.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Über CVolution</h3>
            <p className="text-sm">
              Wir legen grossen Wert auf Präzision, Kreativität und Individualität, damit Ihre Bewerbung auffällt und überzeugt. 
              Mit unserer langjährigen Erfahrung und Expertise sind wir der ideale Partner für Ihren beruflichen Erfolg.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:underline">
                  Team
                </Link>
              </li>
            </ul>
          </div>
        </div>
       

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-100 pt-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} - CVolution GmbH. Alle Rechte vorbehalten.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/agb" className="hover:underline">
              AGB
            </Link>
            <Link href="/data" className="hover:underline">
              Datenschutz
            </Link>
            <Link href="/impressum" className="hover:underline">
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}