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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111827]/45 px-4 py-8">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Check className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">
                {productName || product.label}
              </p>
              <p className="mt-1 text-sm text-green-700">Zum Warenkorb hinzugefügt</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <Link
              href="/cart"
              className="inline-flex flex-1 justify-center rounded-xl bg-[#204878] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a66] sm:flex-none"
            >
              Weiter zum Warenkorb
            </Link>
            <button
              type="button"
              onClick={() => setShowCartPopup(false)}
              className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-gray-100 hover:text-[#111827]"
              aria-label="Popup schliessen"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7">
          <h2 className="mb-5 text-xl font-semibold text-[#111827]">Weitere Services</h2>
          {popupRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {popupRecommendations.map((relatedProduct) => {
              const relatedCount = cartCounts[relatedProduct.serviceType] || 0;

              return (
                <div
                  key={relatedProduct.serviceType}
                  className="flex min-h-64 flex-col rounded-xl border border-gray-100 p-5"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#111827]">{relatedProduct.name}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{relatedProduct.description}</p>
                    <p className="mt-4 text-sm font-semibold text-[#204878]">{relatedProduct.price}</p>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link
                      href={relatedProduct.link}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#204878] px-4 py-3 text-sm font-semibold text-[#204878] transition-colors hover:bg-blue-50"
                    >
                      Angebot
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(relatedProduct.serviceType, false)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#204878] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a66]"
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
            <p className="rounded-xl bg-[#F8FAFC] px-5 py-4 text-sm text-[#64748B]">
              Alle verfügbaren Services sind bereits im Warenkorb.
            </p>
          )}
        </div>
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
          <span>{added ? "" : ""}{count > 0 ? ` (${count})` : ""}</span>
        </span>
      </button>

      {typeof document !== "undefined" && cartPopup ? createPortal(cartPopup, document.body) : null}
    </>
  );
}
