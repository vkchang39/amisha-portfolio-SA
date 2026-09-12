/**
 * Strip GitHub Pages basePath from request URLs so a flat `out/` tree works
 * both at `/` and under `/amisha-portfolio-SA/` (assetPrefix in the HTML).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "out");
const PORT = Number(process.argv[2] || process.env.PORT || 3111);
const BASE = (
  process.env.PLAYWRIGHT_BASE_PATH ||
  process.env.NEXT_PUBLIC_BASE_PATH ||
  ""
).replace(/\/$/, "");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
};

function resolveFile(urlPath) {
  let pathname = decodeURIComponent(urlPath.split("?")[0] || "/");
  if (BASE && (pathname === BASE || pathname.startsWith(`${BASE}/`))) {
    pathname = pathname.slice(BASE.length) || "/";
  }
  if (pathname.endsWith("/")) pathname += "index.html";

  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) return null;
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const asIndex = path.join(filePath, "index.html");
    if (fs.existsSync(asIndex) && fs.statSync(asIndex).isFile()) return asIndex;
    return null;
  }
  return filePath;
}

const server = http.createServer((req, res) => {
  const filePath = resolveFile(req.url || "/");
  if (!filePath) {
    res.writeHead(404).end("Not found");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} on http://127.0.0.1:${PORT}${BASE || ""}/`);
});
