import { noindexMetadata } from "@/lib/seo";

export const metadata = noindexMetadata("Admin");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
