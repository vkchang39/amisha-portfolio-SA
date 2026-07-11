"use client";

import { Reveal } from "./Reveal";

export function SectionTitle({
  kicker,
  title,
  accent = "#54b948",
}: {
  kicker: string;
  title: string;
  accent?: string;
}) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p
        className="font-[family-name:var(--font-oswald)] uppercase tracking-[0.35em] text-sm mb-2"
        style={{ color: accent }}
      >
        — {kicker}
      </p>
      <h2 className="gta-title text-5xl md:text-7xl text-sand">{title}</h2>
    </Reveal>
  );
}
