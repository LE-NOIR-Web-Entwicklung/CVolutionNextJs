import { notFound } from "next/navigation";
import { parseDashboardPath } from "@/lib/dashboard-routes";
import DashboardClient from "../DashboardClient";

export default async function DashboardPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  if (!parseDashboardPath(["/dashboard", ...slug].join("/"))) notFound();
  return <DashboardClient />;
}
