"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { Dashboard } from "@/pages/Dashboard";

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}