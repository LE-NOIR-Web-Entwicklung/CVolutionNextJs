// Checks every title (<= 60) and description (<= 155) in src/lib/seo-pages.ts, and flags "ß".
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("../src/lib/seo-pages.ts", import.meta.url), "utf8");
const block = src.slice(src.indexOf("PAGE_META"), src.indexOf("} as const;"));
const entries = [...block.matchAll(/"(\/[^"]*)":\s*\{\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g)];
let failed = 0;
for (const [, path, title, description] of entries) {
  const problems = [];
  if (title.length > 60) problems.push(`title ${title.length}`);
  if (description.length > 155) problems.push(`description ${description.length}`);
  if (/ß/.test(title + description)) problems.push("contains ß");
  if (problems.length) failed++;
  console.log(`${problems.length ? "FAIL" : "ok  "} ${path.padEnd(30)} T${String(title.length).padStart(3)} D${String(description.length).padStart(4)} ${problems.join(", ")}`);
}
const titles = entries.map((e) => e[2]);
const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
if (dupes.length) { failed++; console.log("Duplicate titles:", dupes); }
console.log(`${entries.length} pages checked, ${failed} problems`);
process.exit(failed ? 1 : 0);
