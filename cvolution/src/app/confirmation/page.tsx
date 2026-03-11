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
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC] py-16 px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 max-w-md w-full text-center">
          <div className="flex justify-start mb-6">
            <Link
              href="/"
              className="text-sm text-[#64748B] hover:text-[#111827] transition-colors flex items-center gap-1"
              style={{ textDecoration: "none" }}
            >
              ← Home
            </Link>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
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
          </div>
          <h1 className="text-2xl font-semibold text-[#111827] mb-4">
            Zahlung fehlgeschlagen
          </h1>
          <p className="text-sm text-[#64748B] leading-relaxed mb-4">
            Leider konnte Ihre Zahlung nicht verarbeitet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.
          </p>
          <p className="text-sm text-[#64748B]">
            Bei Problemen kontaktieren Sie uns unter{" "}
            <a href="mailto:info@cvolution.ch" className="text-[#204878] hover:underline">
              info@cvolution.ch
            </a>
            {" "}oder telefonisch unter{" "}
            <a href="tel:+41764405151" className="text-[#204878] hover:underline">
              076 440 51 51
            </a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC] py-16 px-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 max-w-md w-full text-center">
        <div className="flex justify-start mb-6">
          <Link
            href="/"
            className="text-sm text-[#64748B] hover:text-[#111827] transition-colors flex items-center gap-1"
            style={{ textDecoration: "none" }}
          >
            ← Home
          </Link>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
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
        </div>

        <h1 className="text-2xl font-semibold text-[#111827] mb-3">
          Vielen Dank für Ihre Bestellung!
        </h1>

        {!(countdown !== null && countdown > 0) && (
          <p className="text-sm text-[#64748B] mb-6">
            Sie werden in Kürze eine E-Mail mit weiteren Informationen erhalten.
          </p>
        )}

        {countdown !== null && countdown > 0 && (
          <p className="text-sm text-[#204878] font-medium mb-6">
            Sie werden in {countdown} Sekunden weitergeleitet ...
          </p>
        )}

        {service.toLowerCase() === "laufbahnberatung" && (
          <a
            href="https://calendly.com/armend-cvolution/kennenlern-gesprach"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-6 px-6 py-3 bg-[#0F172A] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors text-sm"
          >
            Termin für Laufbahnberatung buchen
          </a>
        )}
        {service.toLowerCase() === "lohnanalyse telefon" && (
          <a
            href="https://calendly.com/armend-cvolution/lohnanalyse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-6 px-6 py-3 bg-[#0F172A] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors text-sm"
          >
            Termin für Lohnanalyse buchen
          </a>
        )}

        <p className="text-xs text-[#64748B]">
          Bei Problemen oder Fragen kontaktieren Sie uns gerne unter{" "}
          <a href="mailto:info@cvolution.ch" className="text-[#204878] hover:underline">
            info@cvolution.ch
          </a>
          {" "}oder telefonisch unter{" "}
          <a href="tel:+41764405151" className="text-[#204878] hover:underline">
            076 440 51 51
          </a>.
        </p>
      </div>
    </div>
  );
}

export default function Confirmation() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center bg-[#F8FAFC]">Laden...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
