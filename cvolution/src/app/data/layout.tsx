import { noindexMetadata } from "@/lib/seo";

export const metadata = noindexMetadata("Datenschutzerklärung");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
