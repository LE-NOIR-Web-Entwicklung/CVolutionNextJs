"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";

export function CartNavLink({ onClick, compact = false }: { onClick?: () => void; compact?: boolean }) {
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

  return (
    <Link
      href="/cart"
      onClick={onClick}
      className={
        compact
          ? "inline-flex shrink-0 items-center justify-center rounded-lg bg-[#204878] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1a3a66]"
          : "block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-[#204878] rounded-lg hover:bg-[#1a3a66] transition-colors md:ml-4 md:w-auto md:text-left md:py-2"
      }
      aria-label={`Warenkorb mit ${count} Positionen`}
    >
      Warenkorb{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
