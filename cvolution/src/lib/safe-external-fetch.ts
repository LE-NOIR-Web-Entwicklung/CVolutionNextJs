import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import type { IncomingHttpHeaders, RequestOptions } from "node:http";

type SafeResponse = { status: number; headers: IncomingHttpHeaders; body: Buffer };

function isPublicIpv4(address: string) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => part < 0 || part > 255)) return false;
  const [a, b, c] = parts;
  return !(
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 0 || b === 168)) ||
    (a === 198 && (b === 18 || b === 19 || b === 51 && c === 100)) ||
    (a === 203 && b === 0 && c === 113)
  );
}

export function isPublicAddress(address: string) {
  const family = isIP(address);
  if (family === 4) return isPublicIpv4(address);
  if (family !== 6) return false;

  const normalized = address.toLowerCase();
  if (normalized.startsWith("::ffff:")) {
    const mapped = normalized.slice(7);
    if (isIP(mapped) === 4) return isPublicIpv4(mapped);
    const words = mapped.split(":");
    if (words.length === 2 && words.every((word) => /^[0-9a-f]{1,4}$/.test(word))) {
      const high = parseInt(words[0], 16);
      const low = parseInt(words[1], 16);
      return isPublicIpv4(`${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`);
    }
    return false;
  }
  const first = parseInt(normalized.split(":")[0] || "0", 16);
  if ((first & 0xe000) !== 0x2000) return false;
  const value = ipv6First32(normalized);
  return ![
    ["2001:db8::", 32], // Documentation
    ["2001::", 23], // IETF protocol assignments, including benchmarking
    ["2002::", 16], // 6to4
    ["3fff::", 20], // Documentation
  ].some(([prefix, bits]) => ipv6PrefixMatch(value, ipv6First32(prefix as string), bits as number));
}

function ipv6First32(address: string) {
  const halves = address.split("::");
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves[1] ? halves[1].split(":") : [];
  const words = halves.length === 2
    ? [...left, ...Array(8 - left.length - right.length).fill("0"), ...right]
    : left;
  return parseInt(words[0] || "0", 16) * 65536 + parseInt(words[1] || "0", 16);
}

function ipv6PrefixMatch(address: number, prefix: number, bits: number) {
  const divisor = 2 ** (32 - bits);
  return Math.floor(address / divisor) === Math.floor(prefix / divisor);
}

export async function resolvePublicAddress(hostname: string) {
  if (hostname.startsWith("[") && hostname.endsWith("]")) hostname = hostname.slice(1, -1);
  if (hostname.endsWith(".")) hostname = hostname.slice(0, -1);
  if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") || hostname.endsWith(".internal")) return null;

  const family = isIP(hostname);
  const addresses = family
    ? [{ address: hostname, family }]
    : await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) return null;
  return addresses[0];
}

export async function fetchSafeExternal(
  input: string | URL,
  options: { maxBytes: number; timeoutMs: number; headers?: Record<string, string>; httpsOnly?: boolean },
  redirectsRemaining = 5,
  deadline = Date.now() + options.timeoutMs
): Promise<SafeResponse | null> {
  if (Date.now() >= deadline) return null;
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (!(url.protocol === "http:" || url.protocol === "https:") ||
      (options.httpsOnly && url.protocol !== "https:") || url.username || url.password) return null;

  let resolved;
  let dnsTimer: ReturnType<typeof setTimeout> | undefined;
  try {
    resolved = await Promise.race([
      resolvePublicAddress(url.hostname),
      new Promise<null>((resolve) => {
        dnsTimer = setTimeout(() => resolve(null), Math.max(1, deadline - Date.now()));
      }),
    ]);
  } catch {
    return null;
  } finally {
    if (dnsTimer) clearTimeout(dnsTimer);
  }
  if (!resolved || Date.now() >= deadline) return null;

  return new Promise((resolve) => {
    const requestFn = url.protocol === "https:" ? httpsRequest : httpRequest;
    const requestOptions: RequestOptions = {
      method: "GET",
      headers: options.headers,
      lookup: (_hostname, _lookupOptions, callback) => callback(null, resolved.address, resolved.family),
    };
    const req = requestFn(url, requestOptions, (res) => {
      const status = res.statusCode || 0;
      const location = res.headers.location;
      if (status >= 300 && status < 400 && location) {
        res.destroy();
        if (redirectsRemaining <= 0) return resolve(null);
        let redirectUrl: URL;
        try {
          redirectUrl = new URL(location, url);
        } catch {
          return resolve(null);
        }
        void fetchSafeExternal(redirectUrl, options, redirectsRemaining - 1, deadline).then(resolve);
        return;
      }

      const chunks: Buffer[] = [];
      let size = 0;
      res.on("data", (chunk: Buffer | string) => {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > options.maxBytes) {
          req.destroy();
          resolve(null);
          return;
        }
        chunks.push(buffer);
      });
      res.on("end", () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on("error", () => resolve(null));
    });
    const timer = setTimeout(() => req.destroy(), Math.max(1, deadline - Date.now()));
    req.on("close", () => clearTimeout(timer));
    req.on("error", () => resolve(null));
    req.end();
  });
}
