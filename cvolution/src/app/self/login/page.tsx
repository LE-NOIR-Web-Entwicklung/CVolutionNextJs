"use client";

import { AuthPage } from "@/components/Auth/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

export default function SelfLoginPage() {
  return (
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <main className="min-h-screen bg-[#F8FAFC] px-4 py-16 sm:py-20">
          <AuthPage />
        </main>
      </AuthProvider>
    </TooltipProvider>
  );
}
