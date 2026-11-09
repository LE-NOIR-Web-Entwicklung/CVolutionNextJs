import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";
import { Analytics } from "@vercel/analytics/next";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "CVolution GmbH",
  icons: {
    icon: "/images/logo-new.ico",
  },
  description: "Unsere Bewerbung, Ihre Entwicklung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={manrope.variable}>
      <body className="antialiased">
        <SiteChrome position="header" />
        {children}
        <SiteChrome position="footer" />

        <Analytics />
      </body>
    </html>
  );
}
