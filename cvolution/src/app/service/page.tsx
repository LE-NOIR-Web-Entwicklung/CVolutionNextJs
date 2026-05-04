"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { SERVICE_OFFERS } from "@/lib/service-offers";
 
export default function Service() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#111827] mb-4">
              Unser Angebot
            </h1>
            <p className="text-lg text-[#64748B] max-w-xl mx-auto">
              Professionelle Unterstützung für jeden Schritt Ihrer Karriere.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICE_OFFERS.map((product, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
              >
                <div className="mb-5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{product.name}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed flex-1">{product.description}</p>
                <div className="mt-6">
                  <span className="text-sm font-semibold text-[#204878]">{product.price}</span>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    href={product.link}
                    className={`${product.hasMultipleVariants ? "sm:col-span-2" : ""} inline-flex items-center justify-center gap-2 rounded-xl border border-[#204878] px-4 py-3 text-sm font-semibold text-[#204878] transition-colors hover:bg-blue-50`}
                  >
                    {product.offerLabel || "Angebot"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {!product.hasMultipleVariants && (
                    <AddToCartButton
                      serviceType={product.serviceType}
                      productName={product.name}
                      className="w-full px-4 py-3 bg-[#204878] text-white font-semibold rounded-xl hover:bg-[#1a3a66] transition-colors text-sm text-center"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
