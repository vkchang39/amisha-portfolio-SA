/**
 * Rasterise src/app/icon.svg into the PNG sizes the manifest and iOS need.
 * Usage: pnpm generate:icons
 */
import { readFileSync } from "node:fs";
import sharp from "sharp";

const svg = readFileSync("src/app/icon.svg");

const targets = [
  { out: "public/icon-192.png", size: 192 },
  { out: "public/icon-512.png", size: 512 },
  // Next.js file convention → served as /apple-icon.png and linked automatically.
  { out: "src/app/apple-icon.png", size: 180 },
];

for (const { out, size } of targets) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(out);
  console.log(`${out} (${size}px)`);
}
