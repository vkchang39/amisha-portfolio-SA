"use client";

import { Reveal } from "./Reveal";
import { SprayTitleReveal } from "./SprayTitleReveal";
import { useGameUi } from "@/context/GameUiContext";
import { getSectionAccent } from "@/lib/sectionAccents";

export function SectionTitle({
  kicker,
  title,
  plain,
  accent,
  sectionId,
}: {
  kicker: string;
  title: string;
  /** Recruiter-friendly label shown under the game title when Plain Labels is on. */
  plain?: string;
  accent?: string;
  sectionId?: string;
}) {
  const { plainLabels } = useGameUi();
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
      {plain && plainLabels && (
        <p className="section-plain-label" aria-label={`Section: ${plain}`}>
          {plain}
        </p>
      )}
    </Reveal>
  );
}
