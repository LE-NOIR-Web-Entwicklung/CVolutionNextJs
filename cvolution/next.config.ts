import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
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
    // AVIF first, WebP fallback. The largest source photo is 1672px wide, so 2048/3840
    // variants only re-encode the original at full size; capping the list avoids that.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "umvuqbeuzjqmmudkvscy.supabase.co",
        pathname: "/storage/v1/object/public/blog-images/**",
      },
    ],
  },
  // Renamed blog slugs are redirected in src/app/blog/[slug]/page.tsx (see src/lib/blog-redirects.ts),
  // so the redirect only fires once the new slug exists in Supabase.
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default nextConfig;
