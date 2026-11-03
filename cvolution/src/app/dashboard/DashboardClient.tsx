"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { Dashboard } from "@/screens/Dashboard";

export default function DashboardClient() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
