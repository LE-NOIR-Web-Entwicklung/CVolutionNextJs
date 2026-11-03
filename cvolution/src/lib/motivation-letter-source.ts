import { lookup } from "node:dns";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { createBrotliDecompress, createGunzip, createInflate } from "node:zlib";

const FETCH_TIMEOUT_MS = 8000;
const MAX_FETCH_BYTES = 2_000_000;
const MAX_REDIRECTS = 3;

export function parseSafeExternalUrl(raw: string): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = url.hostname.toLowerCase();
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      isIP(host.replace(/^\[|\]$/g, "")) ||
      !host.includes(".") ||
      /(?:^|\.)(?:localhost|local|internal|lan|home)\.?$/.test(host)
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

function isPublicIpv4(address: string) {
  if (isIP(address) !== 4) return false;
  const [a, b, c] = address.split(".").map(Number);
  return !(
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) ||
    (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
    (a === 203 && b === 0 && c === 113)
  );
}

// DNS-Pruefung und Verbindung nutzen dieselbe IPv4-Adresse. Auch jedes
// Weiterleitungsziel wird vor dem Abruf neu validiert; keine internen Abrufe.
function readHtml(url: URL, deadline: number, redirects = 0): Promise<string> {
  const timeout = deadline - Date.now();
  if (timeout <= 0 || redirects > MAX_REDIRECTS) return Promise.resolve("");
  return new Promise((resolve) => {
    let finished = false;
    const finish = (text = "") => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve(text);
    };
    const request = url.protocol === "https:" ? httpsRequest : httpRequest;
    const req = request(
      url,
      {
        family: 4,
        lookup: (hostname, _options, callback) => {
          lookup(hostname, { family: 4 }, (error, address, family) => {
            if (error) return callback(error, "", 4);
            if (!isPublicIpv4(address))
              return callback(new Error("Non-public address"), "", 4);
            callback(null, address, family);
          });
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          accept: "text/html,application/xhtml+xml,text/plain;q=0.9",
          "accept-language": "de-CH,de;q=0.9,en;q=0.7",
          "accept-encoding": "gzip, deflate, br",
        },
      },
      (res) => {
        res.on("error", () => finish());
        res.on("aborted", () => finish());
        const status = res.statusCode || 0;
        if (
          [301, 302, 303, 307, 308].includes(status) &&
          res.headers.location
        ) {
          res.resume();
          let target: URL | null = null;
          try {
            target = parseSafeExternalUrl(
              new URL(res.headers.location, url).toString(),
            );
          } catch {
            /* ungueltiges Ziel */
          }
          if (!target) return finish();
          void readHtml(target, deadline, redirects + 1).then(finish);
          return;
        }
        if (
          status < 200 ||
          status >= 300 ||
          (res.headers["content-type"] &&
            !/text\/html|application\/xhtml|text\/plain/i.test(
              res.headers["content-type"],
            ))
        ) {
          res.resume();
          return finish();
        }
        const encoding = String(res.headers["content-encoding"] || "")
          .toLowerCase()
          .trim();
        const decoder =
          encoding === "gzip"
            ? createGunzip()
            : encoding === "br"
              ? createBrotliDecompress()
              : encoding === "deflate"
                ? createInflate()
                : null;
        const stream = decoder ? res.pipe(decoder) : res;
        const chunks: Buffer[] = [];
        let bytes = 0;
        stream.on("error", () => finish());
        stream.on("data", (chunk: Buffer) => {
          if (finished) return;
          bytes += chunk.length;
          if (bytes > MAX_FETCH_BYTES) {
            finish();
            stream.destroy();
            res.destroy();
            return;
          }
          chunks.push(chunk);
        });
        stream.on("end", () => finish(Buffer.concat(chunks).toString("utf8")));
      },
    );
    const timer = setTimeout(() => {
      finish();
      req.destroy();
    }, timeout);
    req.on("error", () => finish());
    req.end();
  });
}

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    apos: "'",
    auml: "ä",
    ouml: "ö",
    uuml: "ü",
    Auml: "Ä",
    Ouml: "Ö",
    Uuml: "Ü",
    szlig: "ss",
    eacute: "é",
    egrave: "è",
    agrave: "à",
  };
  return value.replace(
    /&(#x[\da-f]+|#\d+|[a-z]+);/gi,
    (entity, code: string) => {
      if (!code.startsWith("#")) return named[code] ?? entity;
      const number =
        code[1].toLowerCase() === "x"
          ? parseInt(code.slice(2), 16)
          : Number(code.slice(1));
      return number > 31 && number <= 0x10ffff
        ? String.fromCodePoint(number)
        : " ";
    },
  );
}

function htmlToText(html: string) {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<li\b[^>]*>/gi, "\n- ")
      .replace(
        /<\/(p|div|li|h[1-6]|tr|td|th|section|article|header|footer|ul|ol|table)>/gi,
        "\n",
      )
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function structuredJobText(html: string) {
  const jobs: Record<string, any>[] = [];
  const visit = (value: any, depth = 0) => {
    if (!value || typeof value !== "object" || depth > 8) return;
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1));
      return;
    }
    const types = Array.isArray(value["@type"])
      ? value["@type"]
      : [value["@type"]];
    if (
      types.some(
        (type: unknown) =>
          typeof type === "string" && /(?:^|[/#])JobPosting$/.test(type),
      )
    )
      jobs.push(value);
    if (value["@graph"]) visit(value["@graph"], depth + 1);
  };
  for (const match of html.matchAll(
    /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi,
  )) {
    try {
      visit(JSON.parse(match[1]));
    } catch {
      /* sichtbaren Inhalt als Fallback nutzen */
    }
  }
  return jobs
    .map((job) => {
      const locations = Array.isArray(job.jobLocation)
        ? job.jobLocation
        : [job.jobLocation];
      return [
        job.title,
        job.hiringOrganization?.name,
        job.applicationContact?.name,
        typeof job.validThrough === "string" ? `Bewerbungsfrist (validThrough): ${job.validThrough}` : "",
        ...locations.flatMap((location: any) => {
          const address = location?.address;
          return address
            ? [
                address.streetAddress,
                address.postalCode,
                address.addressLocality,
                address.addressCountry,
              ]
            : [];
        }),
        job.description,
        job.qualifications,
        job.responsibilities,
        job.skills,
      ]
        .filter((value) => typeof value === "string")
        .map(htmlToText)
        .join("\n");
    })
    .join("\n\n");
}

export async function fetchPageText(
  url: URL,
  maxChars: number,
): Promise<string> {
  const safeUrl = parseSafeExternalUrl(url.toString());
  if (!safeUrl) return "";
  const html = await readHtml(safeUrl, Date.now() + FETCH_TIMEOUT_MS);
  const structured = structuredJobText(html);
  if (structured.length > 120) return structured.slice(0, maxChars);
  const main = html.match(/<(main|article)\b[^>]*>([\s\S]*?)<\/\1\s*>/i)?.[2];
  const text = htmlToText(main || html);
  if (
    text.length < 120 ||
    /just a moment|access denied|enable javascript and cookies|verify (?:that )?you are (?:a )?human|you need to enable javascript/i.test(
      text.slice(0, 600),
    )
  )
    return "";
  return text.slice(0, maxChars);
}

export async function fetchImpressumText(baseUrl: URL): Promise<string> {
  const paths = [
    "/impressum",
    "/imprint",
    "/de/impressum",
    "/kontakt",
    "/contact",
    "/ueber-uns",
  ];
  const results = await Promise.all(
    paths.map((path) => fetchPageText(new URL(path, baseUrl.origin), 3500)),
  );
  return results.find(Boolean) || "";
}
