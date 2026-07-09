import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  // ".nosync" verhindert, dass iCloud Drive den Build-Cache synchronisiert/evakuiert.
  // Das Projekt liegt in ~/Documents (iCloud-synchronisiert); ohne dies wird der
  // .next-Cache immer wieder korrupt (ENOENT app-build-manifest.json, weisse Seite).
  distDir: ".next.nosync",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "umvuqbeuzjqmmudkvscy.supabase.co",
        pathname: "/storage/v1/object/public/blog-images/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default nextConfig;
