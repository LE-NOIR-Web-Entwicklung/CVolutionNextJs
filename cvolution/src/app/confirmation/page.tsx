"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Console } from "console";


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
        console.log("Stored Service:", storedService);
        console.log("Stored email:", storedEmail);
        // If service is 'self', update paid and paydate in Supabase
        if (storedService && storedService.toLowerCase() === "self") {

          if (storedName) {
            supabase
              .from("profiles")
              // Use 'as any' to bypass TypeScript property checks for 'paid' and 'paydate'
              .update({ paid: true, paydate: new Date().toISOString() } as any)
              .eq("user_id", storedName)
              .then(() => {
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
              });
          }
        }else {
          console.log("Sending confirmation and info emails");
          // Call API to send confirmation mail
          fetch("/api/send-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: storedEmail, service: storedService }),
          });
          // Call API to send info mail
          if (storedService) {
            // Check for PDF service form data
            const firstName = localStorage.getItem("firstName");
            const lastName = localStorage.getItem("lastName");
            const birthDate = localStorage.getItem("birthDate");
            const workLocation = localStorage.getItem("workLocation");
            const grossAnnualSalary = localStorage.getItem("grossAnnualSalary");
            const fringeBenefits = localStorage.getItem("fringeBenefits");
            const linkedinUrl = localStorage.getItem("linkedinUrl");
            const remarks = localStorage.getItem("remarks");
            const cvFileBase64 = localStorage.getItem("cvFileBase64");
            const cvFileName = localStorage.getItem("cvFileName");
            const salaryFileBase64 = localStorage.getItem("salaryFileBase64");
            const salaryFileName = localStorage.getItem("salaryFileName");

            const attachments = [];
            if (cvFileBase64 && cvFileName) {
              // Remove the data URL prefix to get just the base64 content
              const base64Content = cvFileBase64.split(',')[1];
              attachments.push({
                filename: cvFileName,
                content: base64Content
              });
            }
            if (salaryFileBase64 && salaryFileName) {
              // Remove the data URL prefix to get just the base64 content
              const base64Content = salaryFileBase64.split(',')[1];
              attachments.push({
                filename: salaryFileName,
                content: base64Content
              });
            }

            fetch("/api/send-info", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: storedName || `${firstName} ${lastName}`,
                email: storedEmail,
                service: storedService,
                firstName,
                lastName,
                birthDate,
                workLocation,
                grossAnnualSalary,
                fringeBenefits,
                linkedinUrl,
                remarks,
                attachments: attachments.length > 0 ? attachments : undefined
              }),
            });

            // Clean up all localStorage data after sending
            if (firstName) localStorage.removeItem("firstName");
            if (lastName) localStorage.removeItem("lastName");
            if (birthDate) localStorage.removeItem("birthDate");
            if (workLocation) localStorage.removeItem("workLocation");
            if (grossAnnualSalary) localStorage.removeItem("grossAnnualSalary");
            if (fringeBenefits) localStorage.removeItem("fringeBenefits");
            if (linkedinUrl) localStorage.removeItem("linkedinUrl");
            if (remarks) localStorage.removeItem("remarks");
            if (cvFileBase64) localStorage.removeItem("cvFileBase64");
            if (cvFileName) localStorage.removeItem("cvFileName");
            if (salaryFileBase64) localStorage.removeItem("salaryFileBase64");
            if (salaryFileName) localStorage.removeItem("salaryFileName");
          }
          localStorage.removeItem("confirmationEmail"); // Clear the email after sending
        }

        fetch("https://api.pushcut.io/5hvDj_2j6Z0VWd94p-ejG/notifications/CVolution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        
        fetch("https://api.pushcut.io/k8in1RlseA_OthMYAhmQH/notifications/CVolution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        // // Call API to send info mail
        // if (storedName && storedService) {
        //   fetch("/api/send-info", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ name: storedName, email: storedEmail, service: storedService }),
        //   });
        // }
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
