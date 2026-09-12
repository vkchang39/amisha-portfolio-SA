"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { useGameAudio } from "@/hooks/useGameAudio";
import { BriefingTypewriter } from "@/components/BriefingTypewriter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { getSectionAccent } from "@/lib/sectionAccents";
import { withBasePath } from "@/lib/basePath";
import Image from "next/image";
import "@/lib/gsap";

function CounterStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="wanted-poster p-5 md:p-6 text-center h-full">
      <p className="meta-label mb-2 tracking-[0.18em] text-blood/90">Wanted</p>
      <p className="gta-title-light text-4xl sm:text-5xl md:text-6xl text-money">{value}</p>
      <p className="mt-2 meta-label tracking-[0.14em]">{label}</p>
    </div>
  );
}

export function About() {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();
  const { cinematicEnabled } = useCinematicMotion();
  const { play } = useGameAudio();

  useGSAP(
    () => {
      if (!cinematicEnabled) return;

      gsap.fromTo(
        ".about-stat",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".about-stats",
            start: "top 85%",
          },
        }
      );
    },
    { scope: container, dependencies: [cinematicEnabled] }
  );

  if (!data) return null;

  return (
    <SectionBackground
      id="about"
      image="/images/bg-desert-highway.webp"
      opacity="opacity-[0.1] sepia-[0.3]"
      accent={getSectionAccent("about")}
      className="py-24 md:py-36 px-4 sm:px-6"
    >
      <div ref={container} className="mx-auto max-w-6xl">
        <SectionTitle
          kicker="The Introduction"
          title="The Story So Far"
          plain="About Amisha"
          sectionId="about"
        />

        <div className="grid gap-10 md:gap-12 md:grid-cols-5 items-start">
          <Reveal className="md:col-span-2" from="left">
            <div
              className="wanted-poster group"
              onMouseEnter={() => play("menuMove")}
            >
              <div className="wanted-poster-banner">
                <span>Suspect Profile</span>
                <span>Los Santos PD</span>
              </div>
              <div className="relative overflow-hidden min-h-[220px]">
                <Image
                  src={withBasePath("/images/about-portrait.webp")}
                  alt="Amisha Sharma — GTA San Andreas style portrait art"
                  width={819}
                  height={546}
                  className="w-full h-auto object-cover sepia-[0.25] contrast-[1.05] transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
                <p className="gta-title-light absolute bottom-3 left-4 text-xl md:text-2xl text-sand">
                  The Coordinator
                </p>
              </div>
              <p className="px-3 pt-3 pb-3 text-center meta-subtle tracking-[0.14em] uppercase">
                Last seen shipping on time · Reward: hire
              </p>
            </div>
          </Reveal>

          <Reveal className="md:col-span-3" from="right">
            <div className="briefing-sheet">
              <p className="meta-label mb-4 tracking-[0.16em] text-money">
                Mission Briefing
              </p>
              <BriefingTypewriter text={data.summary} />
              <div className="mt-5">
                <AvailabilityBadge availability={data.availability} />
              </div>
              <p className="mt-6 meta-label text-money tracking-[0.12em]">
                &ldquo;Ah shit, here we go again&rdquo; — every sprint planning, ever.
              </p>
            </div>

            <div className="mission-card mt-8 p-5 md:p-6">
              <p className="meta-label mb-4">Core Competencies</p>
              <ul className="flex flex-wrap gap-2">
                {data.competencies.map((item) => (
                  <li
                    key={item}
                    className="border border-sand/25 px-3 py-1.5 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wide text-sand/90 transition-colors hover:border-money/50 hover:text-money"
                    onMouseEnter={() => play("menuMove")}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="about-stats mt-12 md:mt-16 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {data.stats.map((stat) => (
            <div key={stat.label} className="about-stat">
              <CounterStat value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </div>
    </SectionBackground>
  );
}
