/**
 * Move title/description/OG/Twitter tags to the start of <head>.
 * Some chat crawlers (notably WhatsApp) only scan the first few KB.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";

function collectHtmlFiles(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files.push(...collectHtmlFiles(full));
    else if (name.endsWith(".html")) files.push(full);
  }
  return files;
}

function hoist(html) {
  const extracted = [];
  const patterns = [
    /<title\b[^>]*>[\s\S]*?<\/title>/i,
    /<meta\b[^>]*\bname=["']description["'][^>]*>/i,
    /<meta\b[^>]*\bproperty=["']og:[^"']+["'][^>]*>/gi,
    /<meta\b[^>]*\bname=["']twitter:[^"']+["'][^>]*>/gi,
    /<link\b[^>]*\brel=["']canonical["'][^>]*>/i,
  ];

  let next = html;
  for (const pattern of patterns) {
    next = next.replace(pattern, (match) => {
      extracted.push(match);
      return "";
    });
  }

  if (extracted.length === 0) return html;

  const unique = [...new Set(extracted)];
  return next.replace(/<head([^>]*)>/i, `<head$1>${unique.join("")}`);
}

for (const file of collectHtmlFiles(OUT)) {
  const before = readFileSync(file, "utf8");
  const after = hoist(before);
  if (after !== before) {
    writeFileSync(file, after);
    console.log(`hoisted OG meta → ${file}`);
  }
}
