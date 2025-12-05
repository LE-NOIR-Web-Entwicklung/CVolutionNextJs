"use client";

import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthPage } from "@/components/Auth/AuthPage";
import { Dashboard } from "@/pages/Dashboard";

// Design Showcase Accordion Component
function DesignShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-6 py-4 rounded-lg transition-colors duration-200"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Unsere 3 professionellen Designs
        </h2>
        <svg
          className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[5000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[1/1.4] relative">
              <img
                src="/lovable-uploads/52816b4d-4592-4ac6-a2ca-7eba6c6d86d2.png"
                alt="Design 1 - Klassisch"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 bg-blue-50">
              <h3 className="text-lg font-semibold text-center text-gray-900">Modern</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[1/1.4] relative">
              <img
                src="/lovable-uploads/f40ab6d8-a47e-4e91-b431-58002f60e221.png"
                alt="Design 2 - Modern"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 bg-blue-50">
              <h3 className="text-lg font-semibold text-center text-gray-900">Minimal</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[1/1.4] relative">
              <img
                src="/lovable-uploads/cdc6fbed-c846-4243-b7ea-4eb12246f389.png"
                alt="Design 3 - Professionell"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 bg-blue-50">
              <h3 className="text-lg font-semibold text-center text-gray-900">Klassisch</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Self() {
  const targetDate = new Date("2025-12-07T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            {/* Info Section */}
            <div className="bg-white py-8 px-2 sm:px-3 lg:px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Erstellen Sie Ihren professionellen Lebenslauf
                  </h1>
                  <p className="text-xl text-gray-600">
                    Ihr perfekter Lebenslauf in wenigen Minuten
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-6">
                  <div className="bg-blue-50 p-8 rounded-lg">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4 mx-auto">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-center text-black mb-3">Preis</h3>
                    <p className="text-center text-gray-700 mb-4">
                      Nur <span className="text-3xl font-bold text-blue-600">CHF 49.–</span> pro Jahr
                    </p>
                    <p className="text-center text-sm text-gray-600">
                      Unbegrenzter Zugriff auf alle Funktionen
                    </p>
                  </div>

                  <div className="bg-green-50 p-8 rounded-lg">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4 mx-auto">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-center text-black mb-3">3 Designs</h3>
                    <p className="text-center text-gray-700 mb-4">
                      Wählen Sie aus 3 professionellen Lebenslauf-Designs
                    </p>
                    <p className="text-center text-sm text-gray-600">
                      Modern, minimal und klassisch
                    </p>
                  </div>

                  <div className="bg-purple-50 p-8 rounded-lg">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full mb-4 mx-auto">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-center text-black mb-3">Vorteile</h3>
                    <ul className="space-y-2 text-left">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Einfache Benutzeroberfläche</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">PDF-Export</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Unbegrenzte Downloads</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Sichere Datenspeicherung</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Zugriff von überall</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Design Showcase Section - Accordion */}
                <DesignShowcase />
              </div>
            </div>

            {/* Auth Section */}
            <AuthPage />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>


  );
}