import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, organizationSchema } from "@/lib/seo";
import { PAGE_META } from "@/lib/seo-pages";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Fallback only: every indexable route sets its own absolute title via metaFor().
  title: {
    default: PAGE_META["/"].title,
    template: "%s | CVolution",
  },
  description: PAGE_META["/"].description,
  applicationName: SITE_NAME,
  icons: {
    icon: "/images/logo-new.ico",
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "de_CH",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  // Paste the token from Google Search Console (HTML tag method) into this env var on Vercel.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-CH">
      <body>
        <JsonLd data={organizationSchema()} />
        <SiteChrome position="header" />
        {children}
        <SiteChrome position="footer" />

        <Analytics />
      </body>
    </html>
  );
}
