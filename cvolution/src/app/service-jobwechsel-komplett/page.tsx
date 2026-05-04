"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function ServiceJobwechselKomplettPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType: "jobwechsel_komplett", email, phone, name }),
      });
      const data = await response.json();
      if (!response.ok || !data?.paymentUrl) throw new Error(data?.error || "Checkout konnte nicht gestartet werden.");
      window.location.href = data.paymentUrl;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout konnte nicht gestartet werden.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#142033]">
      <section className="px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="inline-flex rounded-md border border-[#204878]/20 bg-white px-3 py-1.5 text-sm font-semibold text-[#204878]">Premium Paket</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#101828] sm:text-5xl">Jobwechsel Komplett</h1>
          <h2 className="mt-3 text-xl font-semibold text-[#204878]">Alles, was du für deinen nächsten Jobwechsel brauchst.</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#55657d]">Du willst nicht einfach nur einen neuen Lebenslauf, sondern bessere Chancen im Bewerbungsprozess, einen stärkeren Auftritt und klare Argumente für deinen nächsten Lohnschritt. Mit Jobwechsel Komplett erhältst du Unterlagen, Strategie und persönliche Begleitung aus einer Hand.</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <article className="rounded-3xl border border-[#d8e4f1] bg-white p-6 shadow-[0_1rem_2.75rem_rgba(15,37,65,0.08)]">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#204878]">Leistungen</h3>
              <ul className="mt-4 space-y-3">
                {["Premium Lebenslauf mit klarem, professionellem Aufbau", "Vorlage für Motivationsschreiben für überzeugende Bewerbungen", "LinkedIn Profil Optimierung für mehr Sichtbarkeit", "Lohnanalyse mit realistischen Argumenten für die Verhandlung", "Bewerbungsstrategie passend zu deiner Position und Zielbranche", "1 Gesprächsvorbereitung für dein nächstes Interview", "30 Tage WhatsApp und Mail Support für Fragen und Anpassungen"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6 text-[#2f425d]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#204878]" /><span>{item}</span></li>
                ))}
              </ul>
            </article>

            <aside className="rounded-3xl border border-[#c9daec] bg-[#eef4fb] p-6">
              <p className="text-sm text-[#4f6078]">Preis</p>
              <p className="mt-1 text-3xl font-semibold text-[#101828]">CHF 499 einmalig</p>
              <p className="mt-4 text-sm leading-6 text-[#4f6078]">Bereit für deinen nächsten Karriereschritt, mit Unterlagen, Strategie und Verhandlungsargumenten aus einer Hand.</p>
              <div className="mt-5 space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" className="w-full rounded-xl border border-[#c7d8ea] bg-white px-3 py-2.5 text-sm text-[#101828] outline-none focus:border-[#204878]" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-Mail" className="w-full rounded-xl border border-[#c7d8ea] bg-white px-3 py-2.5 text-sm text-[#101828] outline-none focus:border-[#204878]" required />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Telefon" className="w-full rounded-xl border border-[#c7d8ea] bg-white px-3 py-2.5 text-sm text-[#101828] outline-none focus:border-[#204878]" required />
              </div>
              <button onClick={startCheckout} disabled={isLoading || !email || !phone} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#204878] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#173d66] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Jobwechsel Komplett anfragen"}</button>
              <Link href="/contact" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[#c7d8ea] bg-white px-4 py-3 text-sm font-semibold text-[#204878] transition hover:bg-[#f8fbff]">Mehr erfahren</Link>
              {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
