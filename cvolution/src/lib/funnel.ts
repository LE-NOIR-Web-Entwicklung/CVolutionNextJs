import { track } from "@vercel/analytics";

/**
 * Checkout funnel events for Vercel Web Analytics (custom events need the Pro plan).
 * add_to_cart -> checkout_started -> payment_redirect -> order_confirmed | payment_failed
 */
type FunnelEvent =
  | { name: "add_to_cart"; service: string }
  | { name: "checkout_started"; items: number; total: number }
  | { name: "checkout_error"; reason: string }
  | { name: "payment_redirect"; total: number }
  | { name: "order_confirmed"; service: string }
  | { name: "payment_failed"; reason: string };

export function trackFunnel(event: FunnelEvent) {
  const { name, ...props } = event;
  try {
    track(name, props);
  } catch {
    // Analytics must never break the checkout.
  }
}
