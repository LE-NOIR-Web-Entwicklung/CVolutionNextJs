import { metaFor } from "@/lib/seo-pages";

export const metadata = metaFor("/service");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
