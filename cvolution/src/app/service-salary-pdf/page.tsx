import { noindexMetadata } from "@/lib/seo";
import { SalaryOrderForm } from "../service-salary/SalaryOrderForm";

// Order form without site chrome: reachable from /service-salary, not a landing page.
export const metadata = noindexMetadata("Lohnanalyse als PDF bestellen");

export default function ServiceSalaryPdf() {
  return <SalaryOrderForm variant="pdf" />;
}
