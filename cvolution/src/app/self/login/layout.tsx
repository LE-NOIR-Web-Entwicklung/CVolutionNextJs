import { noindexMetadata } from "@/lib/seo";

export const metadata = noindexMetadata("Self-Service Login");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
