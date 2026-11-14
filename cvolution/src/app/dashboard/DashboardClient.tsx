"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { Dashboard } from "@/components/Dashboard/Dashboard";

export default function DashboardClient() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
