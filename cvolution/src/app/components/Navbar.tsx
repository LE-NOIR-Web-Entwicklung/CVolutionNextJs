"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // State to track which dropdown is open
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the desktop dropdown

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Close the dropdown when clicking outside of it
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

  // Navigation items array
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
        { name: "Videobewerbung", href: "/service-video" },
      ],
    },
    {
      name: "Über",
      href: "/about",
      dropdown: true,
      items: [
        { name: "Team", href: "/team" }, // Single dropdown item under "Über"
      ],
    },
    { name: "Self-Service", href: "/self" },
    { name: "Kontakt", href: "/contact" },
  ];

  return (
    <div>
      <nav className="block w-full max-w-screen px-4 py-4 mx-auto bg-[#204878] bg-opacity-90 sticky top-0 lg:px-8 backdrop-blur-lg backdrop-saturate-150 z-[9999]">
        <div className="container flex flex-wrap items-center justify-between mx-auto text-white">
          {/* Logo */}
          <Link
            href="/"
            className="mr-auto block cursor-pointer py-1.5 font-bold text-2xl"
          >
            <img src="/images/logo.png" className="h-10" alt="Logo" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navItems.map((item, index) => (
                <li key={index} className="relative">
                  {item.dropdown ? (
                    <div className="relative" ref={dropdownRef}>
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className="text-white hover:text-gray-300"
                        >
                          {item.name}
                        </Link>
                        <button
                          className="ml-2 text-white hover:text-gray-300"
                          onClick={() => toggleDropdown(item.name)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
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
                      </div>
                      {openDropdown === item.name && (
                        <ul className="absolute left-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                          {item.items.map((subItem, idx) => (
                            <li
                              key={idx}
                              className="px-4 py-2 hover:bg-gray-100"
                            >
                              <Link
                                href={subItem.href}
                                onClick={closeDropdown} // Close dropdown after navigation
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