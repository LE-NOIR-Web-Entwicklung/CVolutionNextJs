"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ConfirmationContent() {
  const [service, setService] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [paymentError, setPaymentError] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      setPaymentError(true);
      return;
    }

    const success = searchParams?.get("success");
    const serviceParam = searchParams?.get("service");

    if (success === "true") {
      if (serviceParam) {
        setService(serviceParam);
      }

      // "self" service: redirect to /self after countdown
      if (serviceParam === "self") {
        let seconds = 5;
        setCountdown(seconds);
        const interval = setInterval(() => {
          seconds--;
          setCountdown(seconds);
          if (seconds <= 0) {
            clearInterval(interval);
            window.location.href = '/self';
          }
        }, 1000);
      }
    }
  }, [searchParams]);

  if (paymentError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 py-8">
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
          <h1 className="text-3xl font-bold text-red-600 mb-6 mt-2">
            Zahlung fehlgeschlagen
          </h1>
          <div className="flex justify-center mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="mt-6 text-gray-700">
            Leider konnte Ihre Zahlung nicht verarbeitet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.
          </p>
          <p className="mt-4 text-gray-600 text-sm">
            Bei Problemen kontaktieren Sie uns unter
            <a href="mailto:info@cvolution.ch" className="text-[#204878] underline ml-1">
              info@cvolution.ch
            </a>
            {" "}oder telefonisch unter
            <a href="tel:+41764405151" className="text-[#204878] underline ml-1">
              076 440 51 51
            </a>.
          </p>
        </div>
      </div>
    );
  }

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
        {!(countdown !== null && countdown > 0) && (
          <>
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
        {service.toLowerCase() === "lohnanalyse telefon" && (
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

export default function Confirmation() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Laden...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
