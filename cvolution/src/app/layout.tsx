import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "CVolution GmbH",
  icons: {
    icon: "/images/logo-new.ico",
  },
  description: "Unsere Bewerbung, deine Entwicklung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome position="header" />
        {children}
        <SiteChrome position="footer" />

        <Analytics />
      </body>
    </html>
  );
}
