// Shared model selection for every Claude call in the app.
//
// Requests go to the primary model first. When it declines a request
// (HTTP 200 with stop_reason "refusal"), the caller retries once on the
// fallback model. The server-side `fallbacks` parameter cannot target
// Claude Haiku 5.5, so the retry happens here.

export const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-5-5";
export const FALLBACK_ANTHROPIC_MODEL = "claude-haiku-5-5";

export function primaryAnthropicModel(): string {
  return process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL;
}

// The way to turn thinking off differs by model: Claude Sonnet 5.5 rejects
// "disabled" and only accepts "between_tools"; Claude Haiku 5.5 rejects
// "between_tools". Other models (for an ANTHROPIC_MODEL override) get no
// thinking field.
export function thinkingOff(model: string): { thinking?: { type: "between_tools" | "disabled" } } {
  if (model === "claude-sonnet-5-5") return { thinking: { type: "between_tools" } };
  if (model === "claude-haiku-5-5") return { thinking: { type: "disabled" } };
  return {};
}

type MaybeRefusal = { stop_reason?: unknown; stop_details?: { category?: unknown } | null } | null | undefined;

export function isRefusal(data: unknown): boolean {
  return (data as MaybeRefusal)?.stop_reason === "refusal";
}

export function shouldUseFallback(model: string, data: unknown): boolean {
  return isRefusal(data) && model !== FALLBACK_ANTHROPIC_MODEL;
}

// Logs only the model and refusal category, never request or response content.
export function logRefusal(feature: string, model: string, data: unknown, willRetry: boolean): void {
  const category = (data as MaybeRefusal)?.stop_details?.category;
  console.warn(`${feature}: ${model} declined the request`, {
    category: typeof category === "string" ? category : null,
    fallback: willRetry ? FALLBACK_ANTHROPIC_MODEL : null,
  });
}
