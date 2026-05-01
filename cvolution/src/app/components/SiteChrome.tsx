"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const chromeHiddenRoutes = new Set([
  "/service-salary-pdf",
  "/service-salary-tel",
]);

export default function SiteChrome({ position }: { position: "header" | "footer" }) {
  const pathname = usePathname();

  if (pathname && chromeHiddenRoutes.has(pathname)) {
    return null;
  }

  return position === "header" ? <Navbar /> : <Footer />;
}
