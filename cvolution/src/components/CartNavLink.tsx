"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { readCart } from "@/lib/cart";

export function CartNavLink({ onClick, variant = "icon" }: { onClick?: () => void; variant?: "icon" | "row" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cvolution-cart-changed", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cvolution-cart-changed", updateCount);
    };
  }, []);

  const label = count > 0 ? `Warenkorb, ${count} ${count === 1 ? "Position" : "Positionen"}` : "Warenkorb";

  if (variant === "row") {
    return (
      <Link
        href="/cart"
        onClick={onClick}
        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[#111827] transition-colors hover:bg-gray-50 hover:text-[#204878]"
        aria-label={label}
      >
        <span className="inline-flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Warenkorb
        </span>
        {count > 0 && (
          <span className="min-w-5 rounded-full bg-[#204878] px-1.5 py-0.5 text-center text-xs font-semibold text-white tabular-nums">
            {count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/cart"
      onClick={onClick}
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#111827] transition-colors hover:bg-gray-50 hover:text-[#204878]"
      aria-label={label}
      title="Warenkorb"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-[#204878] px-1 text-[0.65rem] font-bold leading-none text-white ring-2 ring-white tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}
