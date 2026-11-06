import type { Metadata } from "next";
import { DownloadAccess } from "./DownloadAccess";

export const metadata: Metadata = {
  title: "Ihre Downloads | CVolution",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function DownloadPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <DownloadAccess token={token} />;
}
