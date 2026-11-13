import { noindexMetadata } from "@/lib/seo";
import { SalaryOrderForm } from "../service-salary/SalaryOrderForm";

// Order form without site chrome: reachable from /service-salary, not a landing page.
export const metadata = noindexMetadata("Lohnanalyse mit Gespräch bestellen");

export default function ServiceSalaryTel() {
  return <SalaryOrderForm variant="phone" />;
}
