"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#204878] text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Copyright Section */}
        <p className="text-sm text-center md:text-left mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} CVolution GmbH. All rights reserved.
        </p>

        {/* Links Section */}
        <div className="flex space-x-4">
          <Link href="/agb" className="text-sm hover:underline">
            AGB
          </Link>
          <Link href="/impressum" className="text-sm hover:underline">
            Impressum
          </Link>
        </div>
      </div>
    </footer>
  );
}