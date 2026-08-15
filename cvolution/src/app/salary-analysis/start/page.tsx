import Link from "next/link";

export default function SalaryAnalysisStartPage() {
  return <main className="min-h-screen bg-[#F8FAFC] p-6"><div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border"><h1 className="text-3xl font-semibold mb-4">Lohnanalyse starten</h1><p className="text-[#475569] mb-6">Strukturierte Lohnanalyse auf Basis Ihrer Angaben, öffentlich verfügbaren Schweizer Benchmarkdaten und einer professionellen Einordnung.</p><Link className="inline-flex bg-[#204878] text-white px-5 py-3 rounded-xl" href="/salary-analysis/form">Zum Formular</Link></div></main>;
}
