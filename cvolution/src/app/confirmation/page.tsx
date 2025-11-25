"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';


export default function Confirmation() {
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("confirmationEmail");
      const storedService = localStorage.getItem("confirmationService");
      const storedName = localStorage.getItem("confirmationName");
      
      if (storedEmail) {
        setEmail(storedEmail);
        // Call API to send confirmation mail
        fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: storedEmail, service: storedService }),
        });

        fetch("https://api.pushcut.io/5hvDj_2j6Z0VWd94p-ejG/notifications/CVolution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        
        fetch("https://api.pushcut.io/k8in1RlseA_OthMYAhmQH/notifications/CVolution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        // Call API to send info mail
        if (storedName && storedService) {
          fetch("/api/send-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: storedName, email: storedEmail, service: storedService }),
          });
        }
        localStorage.removeItem("confirmationEmail"); // Clear the email after sending
      }
      if (storedService) {
        setService(storedService);
        localStorage.removeItem("confirmationService"); // Clear the service after sending
      }
      if (storedName) {
        localStorage.removeItem("confirmationName"); // Clear the name after sending
      }
    }
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-md w-full text-center mt-8 mb-8">
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
        {!(countdown !== null && countdown > 0) && email &&(
          <>
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
          </>
        )}
        {countdown !== null && countdown > 0 && (
          <p className="mt-2 text-[#204878] font-bold">
            Sie werden in {countdown} Sekunden weitergeleitet ...
          </p>
        )}
        {service.toLowerCase() === "laufbahnberatung" && (
          <a
            href="https://calendly.com/armend-cvolution/kennenlern-gesprach"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 mb-6 px-6 py-3 bg-[#204878] text-white font-bold rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
          >
            Termin für Laufbahnberatung buchen
          </a>
        )}
        {service.toLowerCase() === "lohnanalyse" && (
          <a
            href="https://calendly.com/armend-cvolution/lohnanalyse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 mb-6 px-6 py-3 bg-[#204878] text-white font-bold rounded-lg shadow-lg hover:bg-[#1a3a66] transform hover:scale-105 transition duration-300"
          >
            Termin für Lohnanalyse buchen
          </a>
        )}
        <p className="mt-2 text-gray-600 text-sm">
          Bei Problemen oder Fragen kontaktieren Sie uns gerne unter
          <a
            href="mailto:info@cvolution.ch"
            className="text-[#204878] underline ml-1"
          >
            info@cvolution.ch
          </a>
          {" "}oder telefonisch unter
          <a
            href="tel:+41764405151"
            className="text-[#204878] underline ml-1"
          >
            076 440 51 51
          </a>
          .
        </p>
      </div>
    </div>
  );
}
