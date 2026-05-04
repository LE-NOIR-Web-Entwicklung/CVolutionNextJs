"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Check, ShoppingCart, X } from "lucide-react";
import { addCartItem, readCart } from "@/lib/cart";
import { SHOP_PRODUCTS, type ShopProductKey } from "@/lib/shop";
import { CART_RECOMMENDATION_OFFERS } from "@/lib/service-offers";

type AddToCartButtonProps = {
  serviceType: ShopProductKey;
  className?: string;
  productName?: string;
};

export function AddToCartButton({ serviceType, className, productName }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const [count, setCount] = useState(0);
  const [cartCounts, setCartCounts] = useState<Partial<Record<ShopProductKey, number>>>({});
  const [popupRecommendations, setPopupRecommendations] = useState(CART_RECOMMENDATION_OFFERS);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const product = SHOP_PRODUCTS[serviceType];

  useEffect(() => {
    if (!showCartPopup) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCartPopup(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCartPopup]);

  useEffect(() => {
    const updateCount = () => {
      const cartItems = readCart();
      const item = cartItems.find((cartItem) => cartItem.serviceType === serviceType);
      const nextCounts: Partial<Record<ShopProductKey, number>> = {};
      cartItems.forEach((cartItem) => {
        nextCounts[cartItem.serviceType] = cartItem.quantity;
      });
      setCount(item?.quantity || 0);
      setCartCounts(nextCounts);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cvolution-cart-changed", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cvolution-cart-changed", updateCount);
    };
  }, [serviceType]);

  function handleAddToCart(nextServiceType: ShopProductKey, openPopup: boolean) {
    const nextItems = addCartItem(nextServiceType);
    const item = nextItems.find((cartItem) => cartItem.serviceType === serviceType);
    const nextCounts: Partial<Record<ShopProductKey, number>> = {};

    nextItems.forEach((cartItem) => {
      nextCounts[cartItem.serviceType] = cartItem.quantity;
    });

    setCount(item?.quantity || 0);
    setCartCounts(nextCounts);
    if (nextServiceType === serviceType) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2200);
    }
    if (openPopup) {
      setPopupRecommendations(CART_RECOMMENDATION_OFFERS.filter((offer) => !nextCounts[offer.serviceType]));
      setShowCartPopup(true);
    }
  }

  const cartPopup = showCartPopup ? (
    <div
      className="fixed inset-0 z-[10000] flex items-end bg-[#111827]/55 px-0 pt-8 backdrop-blur-[2px] sm:items-center sm:justify-center sm:px-5 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-popup-title"
      onClick={() => setShowCartPopup(false)}
    >
      <div
        className="flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl shadow-[#0f2541]/25 sm:max-h-[min(48rem,calc(100dvh-4rem))] sm:max-w-5xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[#E5EAF0] bg-white px-4 py-4 sm:px-7 sm:py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EF] text-[#087A32]">
              <Check className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p id="cart-popup-title" className="truncate text-sm font-semibold text-[#111827]">
                {productName || product.label}
              </p>
              <p className="mt-1 text-sm font-medium text-[#087A32]">Zum Warenkorb hinzugefügt</p>
            </div>
            <Link
              href="/cart"
              className="hidden shrink-0 rounded-xl bg-[#204878] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a66] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] focus-visible:ring-offset-2 sm:inline-flex"
            >
              Weiter zum Warenkorb
            </Link>
            <button
              type="button"
              onClick={() => setShowCartPopup(false)}
              className="shrink-0 rounded-full p-2 text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#204878]"
              aria-label="Popup schliessen"
            >
              <X className="h-5 w-5" aria-hidden="true" strokeWidth={2.25} />
            </button>
          </div>
          <Link
            href="/cart"
            className="mt-4 inline-flex w-full justify-center rounded-xl bg-[#204878] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a66] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] focus-visible:ring-offset-2 sm:hidden"
          >
            Weiter zum Warenkorb
          </Link>
        </div>

        <div className="overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#111827] sm:mb-5">Weitere Services</h2>
          {popupRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {popupRecommendations.map((relatedProduct) => {
              const relatedCount = cartCounts[relatedProduct.serviceType] || 0;

              return (
                <div
                  key={relatedProduct.serviceType}
                  className="flex flex-col rounded-xl border border-[#E5EAF0] bg-white p-4 shadow-[0_0.5rem_2rem_rgba(15,37,65,0.05)] sm:min-h-64 sm:p-5"
                >
                  <div className="flex-1">
                    <p className="text-base font-semibold leading-snug text-[#111827] sm:text-sm">{relatedProduct.name}</p>
                    <p className="mt-2 text-sm leading-6 text-[#64748B] sm:mt-3 sm:leading-relaxed">{relatedProduct.description}</p>
                    <p className="mt-3 text-sm font-semibold text-[#204878] sm:mt-4">{relatedProduct.price}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-3 sm:mt-5 sm:grid-cols-2">
                    <Link
                      href={relatedProduct.link}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#204878] px-4 py-3 text-sm font-semibold text-[#204878] transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] focus-visible:ring-offset-2"
                    >
                      Angebot
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(relatedProduct.serviceType, false)}
                      className="inline-flex min-h-12 min-w-14 items-center justify-center gap-2 rounded-xl bg-[#204878] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a66] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] focus-visible:ring-offset-2"
                      aria-label={`${relatedProduct.name} in den Warenkorb legen`}
                    >
                      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                      {relatedCount > 0 && <span>({relatedCount})</span>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          ) : (
            <p className="rounded-xl bg-[#F8FAFC] px-5 py-4 text-sm leading-6 text-[#64748B]">
              Alle verfügbaren Services sind bereits im Warenkorb.
            </p>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          handleAddToCart(serviceType, true);
        }}
        className={className || "px-6 py-3 bg-white border border-[#204878] text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm text-center"}
      >
        <span className="flex items-center justify-center gap-2">
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          {count > 0 && <span>({count})</span>}
        </span>
      </button>

      {typeof document !== "undefined" && cartPopup ? createPortal(cartPopup, document.body) : null}
    </>
  );
}
