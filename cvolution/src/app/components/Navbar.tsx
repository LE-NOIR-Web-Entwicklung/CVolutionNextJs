"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the desktop dropdown

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close the mobile menu when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const menu = document.querySelector(".mobile-menu");
      if (menu && !menu.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  // Close the desktop dropdown when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  // Navigation items array
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Angebot", href: "/service" },
    { name: "Über", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Self-Service", href: "/self" },
    { name: "Kontakt", href: "/contact" },
  ];

  // Dropdown items for "Service"
  const serviceItems = [
    { name: "Laufbahnberatung", href: "/service-career" },
    { name: "Lebenslauf", href: "/service-cv" },
    { name: "Lohnanalyse", href: "/service-salary" },
    { name: "Motivationsschreiben", href: "/service-motivation" },
    { name: "RAV Unterstützung", href: "/service-rav" },
    { name: "Videobewerbung", href: "/service-video" },
  ];

  return (
    <div>
      <nav className="block w-full max-w-screen px-4 py-4 mx-auto bg-[#204878] bg-opacity-90 sticky top-0 lg:px-8 backdrop-blur-lg backdrop-saturate-150 z-[9999]">
        <div className="container flex flex-wrap items-center justify-between mx-auto text-white">
          {/* Logo */}
          <Link
            href="/"
            className="mr-4 block cursor-pointer py-1.5 font-bold text-2xl"
          >
            <img src="/images/logo.png" className="h-10" alt="Logo" />
          </Link>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              className="relative ml-auto h-6 w-6 text-white"
              onClick={toggleMobileMenu}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`mobile-menu fixed top-0 left-0 min-h-screen w-64 bg-[#204878] shadow-lg transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden z-50`}
          >
            <div className="flex items-center justify-between border-b pb-4 px-4">
              <Link
                href="/"
                className="cursor-pointer font-bold text-xl text-white"
                onClick={closeMobileMenu}
              >
                <img src="/images/logo.png" className="h-10" alt="Logo" />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="text-white hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col gap-4 p-4">
              {navItems.map((item, index) => (
                <li key={index} className="text-white">
                  {item.name === "Angebot" ? (
                    <div>
                      <button
                        onClick={toggleMobileDropdown}
                        className="flex items-center justify-between w-full text-left"
                      >
                        {item.name}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-4 h-4 ml-1 transform ${
                            isMobileDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isMobileDropdownOpen && (
                        <ul className="mt-2 pl-4 text-sm">
                          {serviceItems.map((service, idx) => (
                            <li key={idx} className="py-1 hover:text-gray-300">
                              <Link
                                href={service.href}
                                onClick={closeMobileMenu}
                              >
                                {service.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="hover:text-gray-300"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navItems.map((item, index) => (
              <li key={index} className="relative">
                {item.name === "Angebot" ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center text-white hover:text-gray-300"
                    onClick={toggleDropdown}
                  >
                    {item.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute left-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                      {serviceItems.map((service, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          <Link href={service.href}>{service.name}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white hover:text-gray-300"
                    >
                      {item.name}
                    </Link>
                  )}
              </li>
            ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}