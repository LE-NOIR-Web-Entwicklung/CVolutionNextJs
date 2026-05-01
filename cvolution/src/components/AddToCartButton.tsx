"use client";

import { useEffect, useState } from "react";
import { addCartItem, readCart } from "@/lib/cart";
import type { ShopProductKey } from "@/lib/shop";

type AddToCartButtonProps = {
  serviceType: ShopProductKey;
  className?: string;
};

export function AddToCartButton({ serviceType, className }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const item = readCart().find((cartItem) => cartItem.serviceType === serviceType);
      setCount(item?.quantity || 0);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cvolution-cart-changed", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cvolution-cart-changed", updateCount);
    };
  }, [serviceType]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          const nextItems = addCartItem(serviceType);
          const item = nextItems.find((cartItem) => cartItem.serviceType === serviceType);
          setCount(item?.quantity || 0);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 2200);
        }}
        className={className || "px-6 py-3 bg-white border border-[#204878] text-[#204878] font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm text-center"}
      >
        {added ? "Im Warenkorb" : "In den Warenkorb"}{count > 0 ? ` (${count})` : ""}
      </button>
    </div>
  );
}
