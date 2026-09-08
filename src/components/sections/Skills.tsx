"use client";

import { useResume } from "@/hooks/useResume";
import { useGameUi } from "@/context/GameUiContext";
import dynamic from "next/dynamic";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatBar } from "@/components/ui/StatBar";
import { Reveal } from "@/components/ui/Reveal";
import { getSectionAccent } from "@/lib/sectionAccents";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";

const StatsPillarsScene = dynamic(
  () => import("@/components/three/StatsPillarsScene"),
  { ssr: false }
);

function StatsPillarsFallback({
  skills,
}: {
  skills: { label: string; value: number }[];
}) {
  return (
    <div className="stats-pillars-fallback" aria-hidden>
      {skills.map((skill) => (
        <div key={skill.label} className="stats-pillars-fallback-bar">
          <div
            className="stats-pillars-fallback-fill"
            style={{ height: `${skill.value}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  const { data } = useResume();
  const { respect } = useGameUi();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { cinematicEnabled } = useCinematicMotion();
  const show3D = cinematicEnabled && !isMobile;

  if (!data) return null;

  return (
    <SectionBackground
      id="stats"
      image="/images/bg-city-night.webp"
      opacity="opacity-[0.14]"
      accent={getSectionAccent("stats")}
      className="py-24 md:py-36 px-4 sm:px-6 bg-night-2"
      gradientClassName="bg-gradient-to-b from-night-2 via-transparent to-night-2"
    >
      <div className="gym-stats-frame mx-auto max-w-5xl">
        <SectionTitle
          kicker="Skills"
          title="Player Stats"
          plain="Skills & tools"
          sectionId="stats"
        />

        <div className="gym-stats-header">
          <p className="gym-stats-title meta-label tracking-[0.2em]">PLAYER STATS</p>
          <p className="gym-stats-respect">
            Total Respect: <span>{respect}</span>
          </p>
        </div>

        {show3D ? (
          <StatsPillarsScene skills={data.skills} />
        ) : (
          <StatsPillarsFallback
            skills={data.skills.map((s) => ({ label: s.label, value: s.value }))}
          />
        )}

        <div className="grid gap-x-10 gap-y-8 md:gap-x-16 md:gap-y-10 md:grid-cols-2 mt-8">
          {data.skills.map((skill, i) => (
            <Reveal key={skill.label} delay={i * 0.06}>
              <StatBar label={skill.label} value={skill.value} />
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {skill.items.map((item) => (
                  <span key={item} className="meta-subtle text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 md:mt-20">
          <div className="loadout-header">
            <p className="meta-label tracking-[0.2em]">Loadout — How I Work</p>
            <p className="loadout-plain">
              Day-to-day tools and rituals, so you know what you&apos;re hiring.
            </p>
          </div>
          <ul className="loadout-grid">
            {data.loadout.map((item) => (
              <li key={item.name} className={`loadout-slot loadout-slot-${item.kind}`}>
                <span className="loadout-kind">{item.kind === "tool" ? "Weapon" : "Ritual"}</span>
                <span className="loadout-name">{item.name}</span>
                <span className="loadout-use">{item.use}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12 md:mt-16">
          <p className="text-center meta-subtle tracking-[0.18em] uppercase">
            Stats increase as missions are completed. No cheat codes used.
          </p>
        </Reveal>
      </div>
    </SectionBackground>
  );
}
