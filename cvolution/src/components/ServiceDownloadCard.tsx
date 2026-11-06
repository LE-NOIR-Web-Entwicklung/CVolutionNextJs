import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getServiceDownloadPrice, type ServiceDownloadOffer } from "@/lib/service-downloads";

export function ServiceDownloadCard({ download }: { download: ServiceDownloadOffer }) {
  const isBundle = download.group === "bundle";

  return (
    <article className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1rem_2.75rem_rgba(15,37,65,0.06)] ${isBundle ? "ring-2 ring-[#204878]" : "ring-1 ring-[#dce5ef]"}`}>
      {"preview" in download && (
        <div className="relative h-56 overflow-hidden border-b border-[#e6edf5] bg-[#eef4fb]">
          <Image
            src={download.preview}
            alt={`Vorschau ${download.label}`}
            fill
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
            className="origin-top scale-[1.03] object-cover object-top"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-[#101828]">{download.label}</h3>
          <span className="shrink-0 rounded-md bg-[#f2f6fb] px-2 py-1 text-xs font-semibold text-[#204878]">{download.format}</span>
        </div>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#607089] text-pretty">{download.description}</p>
        <p className="mt-4 text-base font-semibold tabular-nums text-[#204878]">
          CHF {getServiceDownloadPrice(download.key).toFixed(2)}
          {isBundle && <span className="ml-2 text-sm font-normal text-[#607089] line-through">CHF 99.50</span>}
        </p>
        <div className="mt-4">
          <AddToCartButton
            serviceType={download.key}
            productName={download.label}
            className="w-full rounded-xl bg-[#204878] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1a3a66]"
          />
        </div>
      </div>
    </article>
  );
}
