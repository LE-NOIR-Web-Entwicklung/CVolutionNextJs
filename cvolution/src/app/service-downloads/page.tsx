import type { Metadata } from "next";
import { ServiceDownloadCard } from "@/components/ServiceDownloadCard";
import {
  SERVICE_DOWNLOAD_MAX_PER_DOCUMENT,
  SERVICE_DOWNLOAD_VALID_DAYS,
  SERVICE_DOWNLOADS,
} from "@/lib/service-downloads";

export const metadata: Metadata = {
  title: "Downloads: Masterprompts und Lebenslauf-Vorlagen | CVolution",
  description: "Masterprompts für Ihr Motivationsschreiben mit KI und Lebenslauf-Vorlagen für Word. CHF 19.90 pro Dokument.",
};

const STEPS = [
  { title: "Dokumente wählen", text: "Legen Sie die gewünschten Dokumente in den Warenkorb und bezahlen Sie wie gewohnt." },
  { title: "Link erhalten", text: "Der persönliche Download-Link kommt mit Ihrer Bestellbestätigung per E-Mail." },
  { title: "Code bestätigen", text: "Beim Öffnen bestätigen Sie einen Code, den wir an Ihre E-Mail-Adresse senden." },
];

export default function ServiceDownloads() {
  const prompts = SERVICE_DOWNLOADS.filter((download) => download.group === "prompt");
  const templates = SERVICE_DOWNLOADS.filter((download) => download.group === "cv");

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-[#142033]">
      <section className="relative isolate px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[20rem] bg-[radial-gradient(circle_at_28%_0%,rgba(32,72,120,0.14),transparent_30%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)]" />

        <div className="mx-auto max-w-5xl">
          <p className="mb-4 inline-flex rounded-md border border-[#204878]/15 bg-white/80 px-3 py-1.5 text-sm font-semibold text-[#204878] shadow-sm shadow-[#204878]/5">
            CVolution Bewerbungsservice
          </p>
          <p className="mb-3 text-sm font-semibold text-[#204878]">Downloads</p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-[#101828] text-balance sm:text-5xl">
            Unsere Vorlagen für Ihre Bewerbung, sofort verfügbar.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5d6b7f] text-pretty">
            Masterprompts für Ihr Motivationsschreiben mit KI und Lebenslauf-Vorlagen für Word. Jedes Dokument kostet CHF 19.90.
          </p>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-[#101828]">Lebenslauf-Vorlagen</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((download) => <ServiceDownloadCard key={download.key} download={download} />)}
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-[#101828]">Masterprompts</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((download) => <ServiceDownloadCard key={download.key} download={download} />)}
          </div>

          <div className="mt-12 rounded-2xl bg-[#e9f0f8] p-6 ring-1 ring-[#d5e1ee] sm:p-7">
            <h2 className="text-2xl font-semibold tracking-tight text-[#101828]">So kommen Sie zu Ihren Dokumenten</h2>
            <ol className="mt-5 grid gap-5 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <p className="text-sm font-semibold text-[#204878]">Schritt {index + 1}</p>
                  <p className="mt-1 text-base font-semibold text-[#101828]">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#40516a]">{step.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm leading-6 text-[#40516a] text-pretty">
              Der Link ist {SERVICE_DOWNLOAD_VALID_DAYS} Tage gültig, jedes Dokument lässt sich {SERVICE_DOWNLOAD_MAX_PER_DOCUMENT}-mal herunterladen.
              Die Dokumente sind auf Ihren Namen lizenziert und nur für den persönlichen Gebrauch bestimmt. Eine Weitergabe ist nicht gestattet.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
