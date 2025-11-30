"use client";

import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthPage } from "@/components/Auth/AuthPage";
import { Dashboard } from "@/pages/Dashboard";

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
    // <QueryClientProvider client={queryClient}>
    //   <TooltipProvider>
    //     <Toaster />
    //     <AuthProvider>
    //       <div className="min-h-screen bg-gray-100">
    //         <AuthPage />
    //       </div>
    //     </AuthProvider>
    //   </TooltipProvider>
    // </QueryClientProvider>


<div className="min-h-screen bg-[#204878] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Self-Service <span className="text-blue-300">Coming Soon!</span></h1>
      <p className="text-lg mb-8">
        Das Self-Service Angebot ist ab <strong>01. Dezember 2025</strong> verfügbar.
      </p>
      <div className="flex space-x-4 text-center">
        <div className="bg-[#1a3a66] p-4 rounded-lg shadow-lg">
          <p className="text-3xl font-bold">{timeLeft.days}</p>
          <p className="text-sm">Days</p>
        </div>
        <div className="bg-[#1a3a66] p-4 rounded-lg shadow-lg">
          <p className="text-3xl font-bold">{timeLeft.hours}</p>
          <p className="text-sm">Hours</p>
        </div>
        <div className="bg-[#1a3a66] p-4 rounded-lg shadow-lg">
          <p className="text-3xl font-bold">{timeLeft.minutes}</p>
          <p className="text-sm">Minutes</p>
        </div>
        <div className="bg-[#1a3a66] p-4 rounded-lg shadow-lg">
          <p className="text-3xl font-bold">{timeLeft.seconds}</p>
          <p className="text-sm">Seconds</p>
        </div>
      </div>
    </div>
  );
}