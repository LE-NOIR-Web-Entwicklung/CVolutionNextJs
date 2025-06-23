"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Confirmation() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("confirmationEmail");
      if (storedEmail) {
        setEmail(storedEmail);
        // Call API to send confirmation mail
        fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: storedEmail }),
        });
        localStorage.removeItem("confirmationEmail"); // Clear the email after sending
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-start mb-2">
          <Link
            href="/"
            className="text-[#204878] hover:text-[#1a3a66] font-bold text-lg px-3 py-1 rounded transition bg-blue-50 hover:bg-blue-100 shadow"
            style={{ textDecoration: "none" }}
          >
            &larr; Home
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[#204878] mb-6 mt-2">
          Vielen Dank für Ihre Bestellung!
        </h1>
        {email && (
          <p className="text-lg text-gray-700 mb-4">
            Wir haben Ihre Bestätigung an{" "}
            <strong className="text-[#204878]">{email}</strong> gesendet.
          </p>
        )}
        <div className="flex justify-center mt-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="mt-6 text-gray-500">
          Sie werden in Kürze eine E-Mail mit weiteren Informationen erhalten.
        </p>
      </div>
    </div>
  );
}