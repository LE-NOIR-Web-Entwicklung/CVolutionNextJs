import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "../../lib/supabase-server";
import { getServiceDownload, SERVICE_DOWNLOAD_MAX_PER_DOCUMENT, SERVICE_DOWNLOAD_VALID_DAYS } from "./service-downloads";

export const DOWNLOAD_SESSION_COOKIE = "cvolution_download_session";
export const DOWNLOAD_SESSION_MINUTES = 30;

const CODE_VALID_MINUTES = 10;
const CODE_RESEND_SECONDS = 60;
const MAX_CODE_ATTEMPTS = 5;
const MINUTE = 60_000;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

type DownloadGrant = {
  id: string;
  email: string;
  buyer_name: string | null;
  order_reference: string;
  expires_at: string;
  code_hash: string | null;
  code_expires_at: string | null;
  code_sent_at: string | null;
  code_attempts: number;
  session_hash: string | null;
  session_expires_at: string | null;
};

type PaidDownloadOrder = { id: string; email: string; name?: string | null; service_type: string };

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function sameHash(left: string, right: string) {
  return timingSafeEqual(Buffer.from(left), Buffer.from(right));
}

function isPast(value: string | null, now = Date.now()) {
  return !value || new Date(value).getTime() <= now;
}

export function maskEmail(email: string) {
  const [local, domain = ""] = email.split("@");
  return `${local.slice(0, 2)}${"*".repeat(Math.max(3, local.length - 2))}@${domain}`;
}

export async function createDownloadGrant(orders: PaidDownloadOrder[], siteUrl: string) {
  const token = randomBytes(32).toString("base64url");
  const { data: grant, error } = await supabaseAdmin
    .from("service_download_grants")
    .insert({
      token_hash: sha256(token),
      email: orders[0].email,
      buyer_name: orders[0].name || null,
      order_reference: orders[0].id.slice(0, 8).toUpperCase(),
      expires_at: new Date(Date.now() + SERVICE_DOWNLOAD_VALID_DAYS * 24 * 60 * MINUTE).toISOString(),
    })
    .select("id")
    .single();
  if (error || !grant) throw new Error(error?.message || "Download grant could not be created");

  const { error: itemsError } = await supabaseAdmin
    .from("service_download_items")
    .insert(orders.map((order) => ({ grant_id: grant.id, order_id: order.id, product_key: order.service_type })));
  if (itemsError) throw new Error(itemsError.message);

  return `${siteUrl.replace(/\/$/, "")}/downloads/${token}`;
}

export async function loadGrant(token: string) {
  if (!TOKEN_PATTERN.test(token)) return null;
  const { data } = await supabaseAdmin
    .from("service_download_grants")
    .select("*")
    .eq("token_hash", sha256(token))
    .maybeSingle();
  return (data as DownloadGrant | null) ?? null;
}

export function isGrantExpired(grant: DownloadGrant) {
  return isPast(grant.expires_at);
}

export function hasValidSession(grant: DownloadGrant, sessionToken: string | undefined) {
  if (!sessionToken || !grant.session_hash || isPast(grant.session_expires_at)) return false;
  return sameHash(sha256(sessionToken), grant.session_hash);
}

export async function listGrantItems(grantId: string) {
  const { data } = await supabaseAdmin
    .from("service_download_items")
    .select("id, product_key, download_count")
    .eq("grant_id", grantId)
    .order("created_at", { ascending: true });

  return (data || []).flatMap((item) => {
    const download = getServiceDownload(item.product_key);
    if (!download) return [];
    return [{
      id: item.id as string,
      label: download.label,
      format: download.format,
      remaining: Math.max(0, SERVICE_DOWNLOAD_MAX_PER_DOCUMENT - item.download_count),
    }];
  });
}

// Returns the code for the e-mail, or null while the previous one was sent too recently.
export async function issueAccessCode(grant: DownloadGrant, token: string) {
  const now = Date.now();
  if (grant.code_sent_at && now - new Date(grant.code_sent_at).getTime() < CODE_RESEND_SECONDS * 1000) return null;

  const code = String(randomInt(100000, 1000000));
  const { error } = await supabaseAdmin
    .from("service_download_grants")
    .update({
      code_hash: sha256(`${token}:${code}`),
      code_expires_at: new Date(now + CODE_VALID_MINUTES * MINUTE).toISOString(),
      code_sent_at: new Date(now).toISOString(),
      code_attempts: 0,
    })
    .eq("id", grant.id);
  if (error) throw new Error(error.message);
  return code;
}

// Returns a session token for the cookie, or null when the code is wrong, used up or expired.
export async function verifyAccessCode(grant: DownloadGrant, token: string, code: string) {
  if (!grant.code_hash || isPast(grant.code_expires_at) || grant.code_attempts >= MAX_CODE_ATTEMPTS) return null;

  // Counting first and on the read value means parallel guesses cannot share one attempt.
  const { data: counted } = await supabaseAdmin
    .from("service_download_grants")
    .update({ code_attempts: grant.code_attempts + 1 })
    .eq("id", grant.id)
    .eq("code_attempts", grant.code_attempts)
    .select("id");
  if (!counted?.length || !sameHash(sha256(`${token}:${code}`), grant.code_hash)) return null;

  const sessionToken = randomBytes(32).toString("base64url");
  const { error } = await supabaseAdmin
    .from("service_download_grants")
    .update({
      code_hash: null,
      code_expires_at: null,
      session_hash: sha256(sessionToken),
      session_expires_at: new Date(Date.now() + DOWNLOAD_SESSION_MINUTES * MINUTE).toISOString(),
    })
    .eq("id", grant.id);
  if (error) throw new Error(error.message);
  return sessionToken;
}

export async function loadGrantItem(grantId: string, itemId: string) {
  const { data } = await supabaseAdmin
    .from("service_download_items")
    .select("id, product_key, download_count")
    .eq("id", itemId)
    .eq("grant_id", grantId)
    .maybeSingle();
  return data as { id: string; product_key: string; download_count: number } | null;
}

// Guarded on the read count so parallel requests cannot exceed the limit.
export async function claimDownload(item: { id: string; download_count: number }) {
  if (item.download_count >= SERVICE_DOWNLOAD_MAX_PER_DOCUMENT) return false;
  const { data } = await supabaseAdmin
    .from("service_download_items")
    .update({ download_count: item.download_count + 1, last_downloaded_at: new Date().toISOString() })
    .eq("id", item.id)
    .eq("download_count", item.download_count)
    .select("id");
  return Boolean(data?.length);
}
