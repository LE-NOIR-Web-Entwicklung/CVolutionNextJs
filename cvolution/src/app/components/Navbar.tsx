"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    closeDropdown();
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (openDropdown) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openDropdown]);

  const navItems = [
    { name: "Home", href: "/" },
    {
      name: "Angebot",
      href: "/service",
      dropdown: true,
      items: [
        { name: "Laufbahnberatung", href: "/service-career" },
        { name: "Lebenslauf", href: "/service-cv" },
        { name: "Lohnanalyse", href: "/service-salary" },
        { name: "Motivationsschreiben", href: "/service-motivation" },
        { name: "RAV Unterstützung", href: "/service-rav" },
        { name: "Check", href: "/service-check" },
      ],
    },
    { name: "Blog", href: "/blog" },
    {
      name: "Über",
      href: "/about",
      dropdown: true,
      items: [
        { name: "Team", href: "/team" },
      ],
    },
    { name: "Self-Service", href: "/self" },
    { name: "Kontakt", href: "/contact" },
  ];

  return (
    <div>
      <nav className="block w-full max-w-screen sticky top-0 z-[9999] transition-all duration-300 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/images/logo-nobg.png" className="h-9" style={{filter: "invert(24%) sepia(57%) saturate(600%) hue-rotate(185deg) brightness(40%) contrast(95%)"}} alt="Logo" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.dropdown ? (
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className="px-3 py-2 text-sm font-medium text-[#111827] hover:text-[#204878] transition-colors duration-150 rounded-md hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                      <button
                        className="p-1 text-gray-400 hover:text-[#204878] transition-colors"
                        onClick={() => toggleDropdown(item.name)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            openDropdown === item.name ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    {openDropdown === item.name && (
                      <ul className="absolute left-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1">
                        {item.items.map((subItem, idx) => (
                          <li key={idx}>
                            <Link
                              href={subItem.href}
                              onClick={closeDropdown}
                              className="block px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-[#111827] hover:text-[#204878] transition-colors duration-150 rounded-md hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/service"
              className="ml-4 px-4 py-2 text-sm font-semibold text-white bg-[#204878] rounded-lg hover:bg-[#1a3a66] transition-colors duration-150"
            >
              Jetzt buchen
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#111827] hover:text-[#204878] rounded-md hover:bg-gray-50 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Menü öffnen"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <ul className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  {item.dropdown ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          className="px-3 py-2.5 text-sm font-medium text-[#111827] hover:text-[#204878] rounded-md hover:bg-gray-50 transition-colors flex-1"
                          onClick={closeMobileMenu}
                        >
                          {item.name}
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-[#204878] transition-colors"
                          onClick={() => toggleDropdown(item.name)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openDropdown === item.name ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      {openDropdown === item.name && (
                        <ul className="ml-4 mt-1 border-l border-white/20 pl-4 flex flex-col gap-1">
                          {item.items.map((subItem, idx) => (
                            <li key={idx}>
                              <Link
                                href={subItem.href}
                                onClick={closeMobileMenu}
                                className="block px-3 py-2 text-sm text-[#64748B] hover:text-[#111827] hover:bg-gray-50 rounded-md transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2.5 text-sm font-medium text-[#111827] hover:text-[#204878] rounded-md hover:bg-gray-50 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
              <li className="mt-3 pt-3 border-t border-gray-100">
                <Link
                  href="/service"
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-[#204878] rounded-lg hover:bg-[#1a3a66] transition-colors"
                >
                  Jetzt buchen
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
