import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  // Der Elternordner hat ein eigenes package-lock.json; ohne festes Root
  // waehlt Turbopack diesen und findet das Next.js-Paket nicht.
  turbopack: {
    root: __dirname,
  },
  reactStrictMode: true,
  // The paid documents are read at runtime and must ship with these routes only.
  outputFileTracingIncludes: {
    "/api/service-downloads/**/*": ["./private-downloads/**/*"],
  },
  // ".nosync" verhindert, dass iCloud Drive den lokalen Build-Cache
  // synchronisiert/evakuiert (Projekt liegt in ~/Documents). Ohne dies wird der
  // .next-Cache lokal immer wieder korrupt (ENOENT app-build-manifest.json).
  // Auf Vercel MUSS der Standard ".next" verwendet werden, sonst schlaegt das
  // Deployment fehl (routes-manifest.json not found).
  distDir: process.env.VERCEL ? ".next" : ".next.nosync",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "umvuqbeuzjqmmudkvscy.supabase.co",
        pathname: "/storage/v1/object/public/blog-images/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
