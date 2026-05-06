import Link from "next/link";
import { supabaseAdmin } from "../../../../../lib/supabase-server";

export default async function SalaryResultPage({ params, searchParams }: any) {
  const { data } = await supabaseAdmin.from("salary_analyses").select("id,status,analysis_json,pdf_url,benchmark_confidence").eq("id", params.id).eq("access_token", searchParams.token || "").maybeSingle();
  if (!data) return <main className="p-6">Ungültiger Zugriff.</main>;
  return <main className="min-h-screen bg-[#F8FAFC] p-6"><div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border"><h1 className="text-2xl font-semibold mb-2">Ihre Lohnanalyse wurde erstellt.</h1><p className="mb-4">Status: {data.status}</p>{data.pdf_url && <Link className="inline-flex bg-[#204878] text-white px-4 py-2 rounded" href={`/api/salary-analysis/download/${data.id}?token=${searchParams.token}`}>PDF herunterladen</Link>}<div className="mt-8 p-4 border rounded-xl"><h2 className="font-semibold">Analyse persönlich besprechen?</h2><p className="text-sm">Telefonische Besprechung buchen (CHF 50 / 20 Minuten).</p><Link className="text-[#204878] underline" href="/contact">Telefonische Besprechung buchen</Link></div></div></main>;
}
