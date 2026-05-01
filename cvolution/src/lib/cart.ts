import type { ShopProductKey } from "@/lib/shop";

export const CART_STORAGE_KEY = "cvolution_cart";

export type CartItem = {
  serviceType: ShopProductKey;
  quantity: number;
};

function isSingleQuantityService(serviceType: unknown) {
  return serviceType === "salary_pdf" || serviceType === "salary_phone";
}

function normalizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const serviceType = item?.serviceType;
      const maxQuantity = isSingleQuantityService(serviceType) ? 1 : 10;
      return {
        serviceType,
        quantity: Math.min(maxQuantity, Math.max(1, Number(item?.quantity || 1))),
      };
    })
    .filter((item) => typeof item.serviceType === "string") as CartItem[];
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return normalizeItems(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]"));
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cvolution-cart-changed"));
}

export function addCartItem(serviceType: ShopProductKey) {
  const items = readCart();
  const fixedSingleQuantity = isSingleQuantityService(serviceType);
  const existing = items.find((item) => item.serviceType === serviceType);
  if (existing) {
    existing.quantity = fixedSingleQuantity ? 1 : Math.min(10, existing.quantity + 1);
  } else {
    items.push({ serviceType, quantity: 1 });
  }
  writeCart(items);
  return items;
}

export function clearCart() {
  writeCart([]);
}
