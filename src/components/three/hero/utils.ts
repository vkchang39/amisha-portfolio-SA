"use client";

import * as THREE from "three";

export function seededRand(seed: { v: number }) {
  seed.v = (seed.v * 16807) % 2147483647;
  return (seed.v - 1) / 2147483646;
}

export function makeLabelTexture(
  lines: string[],
  bg: string,
  fg: string,
  w = 512,
  h = 256
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const size = lines.length > 1 ? 52 : 72;
  ctx.font = `bold ${size}px Impact, Arial Black, sans-serif`;
  lines.forEach((line, i) => {
    const y = h / 2 + (i - (lines.length - 1) / 2) * (size + 8);
    ctx.fillText(line.toUpperCase(), w / 2, y);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
