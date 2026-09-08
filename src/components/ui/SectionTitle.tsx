"use client";

import { Reveal } from "./Reveal";
import { SprayTitleReveal } from "./SprayTitleReveal";
import { getSectionAccent } from "@/lib/sectionAccents";

export function SectionTitle({
  kicker,
  title,
  accent,
  sectionId,
}: {
  kicker: string;
  title: string;
  accent?: string;
  sectionId?: string;
}) {
  const resolvedAccent = accent ?? (sectionId ? getSectionAccent(sectionId) : "#54b948");

  return (
    <Reveal className="mb-10 md:mb-16">
      <p
        className="meta-label mb-2 tracking-[0.22em]"
        style={{ color: resolvedAccent }}
      >
        — {kicker}
      </p>
      <SprayTitleReveal className="gta-title text-4xl sm:text-5xl md:text-7xl text-sand">
        {title}
      </SprayTitleReveal>
    </Reveal>
  );
}
