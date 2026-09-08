/**
 * Convert public/images/*.jpg|png to WebP for the static export.
 *
 * - Resizes anything wider than MAX_WIDTH (keeps aspect ratio).
 * - Skips files listed in KEEP_ORIGINAL (OG share image must stay JPEG for
 *   WhatsApp/Twitter/LinkedIn crawlers).
 * - Removes the source JPEG/PNG once the .webp is written so `out/` only ships
 *   the small variant. Pass `--keep` to keep originals side by side.
 *
 * Usage: pnpm optimize:images [--keep]
 */
import { readdirSync, statSync, unlinkSync } from "node:fs";
import { extname, join, basename } from "node:path";
import sharp from "sharp";

const DIR = "public/images";
const MAX_WIDTH = 1920;
const QUALITY = 78;
const KEEP_ORIGINAL = new Set(["og-share.jpg"]);
const keepSources = process.argv.includes("--keep");

const files = readdirSync(DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));

let before = 0;
let after = 0;

for (const file of files) {
  if (KEEP_ORIGINAL.has(file)) continue;

  const src = join(DIR, file);
  const out = join(DIR, `${basename(file, extname(file))}.webp`);
  const srcSize = statSync(src).size;

  const image = sharp(src);
  const meta = await image.metadata();
  const pipeline =
    meta.width && meta.width > MAX_WIDTH
      ? image.resize({ width: MAX_WIDTH, withoutEnlargement: true })
      : image;

  await pipeline.webp({ quality: QUALITY, effort: 6 }).toFile(out);

  const outSize = statSync(out).size;
  before += srcSize;
  after += outSize;
  console.log(
    `${file} → ${basename(out)}  ${(srcSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB`
  );

  if (!keepSources) unlinkSync(src);
}

console.log(
  `\nTotal: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (${(
    (1 - after / before) *
    100
  ).toFixed(0)}% smaller)`
);
