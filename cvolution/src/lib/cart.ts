import type { ShopProductKey } from "@/lib/shop";
import {
  normalizeCheckDocumentSelections,
  type CheckDocumentKey,
} from "@/lib/check-service";

export const CART_STORAGE_KEY = "cvolution_cart";

export type CartItem = {
  serviceType: ShopProductKey;
  quantity: number;
  checkSelections?: CheckDocumentKey[];
};

function isSingleQuantityService(serviceType: unknown) {
  return serviceType === "linkedin" || serviceType === "salary_pdf" || serviceType === "salary_phone";
}

function isDocumentCheckService(serviceType: unknown) {
  return serviceType === "check";
}

function normalizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const serviceType = item?.serviceType;
      const checkSelections = isDocumentCheckService(serviceType)
        ? normalizeCheckDocumentSelections(item?.checkSelections)
        : undefined;
      const maxQuantity = isSingleQuantityService(serviceType) ? 1 : 10;
      const quantity = checkSelections
        ? checkSelections.length
        : Math.min(maxQuantity, Math.max(1, Number(item?.quantity || 1)));
      return {
        serviceType,
        quantity,
        ...(checkSelections ? { checkSelections } : {}),
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

export function addCartItem(
  serviceType: ShopProductKey,
  options?: { checkSelections?: CheckDocumentKey[] }
) {
  const items = readCart();
  const fixedSingleQuantity = isSingleQuantityService(serviceType);
  const hasCheckSelectionOption = options?.checkSelections !== undefined;
  const checkSelections = isDocumentCheckService(serviceType)
    ? normalizeCheckDocumentSelections(options?.checkSelections)
    : undefined;
  const existing = items.find((item) => item.serviceType === serviceType);
  if (existing) {
    if (checkSelections && (hasCheckSelectionOption || !existing.checkSelections)) {
      existing.checkSelections = checkSelections;
      existing.quantity = checkSelections.length;
    } else if (isDocumentCheckService(serviceType)) {
      existing.checkSelections = normalizeCheckDocumentSelections(existing.checkSelections);
      existing.quantity = existing.checkSelections.length;
    } else {
      existing.quantity = fixedSingleQuantity ? 1 : Math.min(10, existing.quantity + 1);
    }
  } else {
    items.push({
      serviceType,
      quantity: checkSelections ? checkSelections.length : 1,
      ...(checkSelections ? { checkSelections } : {}),
    });
  }
  writeCart(items);
  return items;
}

export function clearCart() {
  writeCart([]);
}
