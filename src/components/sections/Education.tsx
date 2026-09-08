"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { getSectionAccent } from "@/lib/sectionAccents";
import "@/lib/gsap";

export function Education() {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();
  const { cinematicEnabled } = useCinematicMotion();

  useGSAP(
    () => {
      if (!container.current) return;

      const stamps = gsap.utils.toArray<HTMLElement>(".edu-unlock-stamp");

      if (!cinematicEnabled) {
        gsap.set(stamps, { clearProps: "opacity,scale,transform,rotation" });
        return;
      }

      gsap.utils.toArray<HTMLElement>(".edu-diploma").forEach((card) => {
        const stamp = card.querySelector(".edu-unlock-stamp");
        if (!stamp) return;

        gsap.set(stamp, { scale: 2.4, opacity: 0, rotation: -10 });
        ScrollTrigger.create({
          trigger: card,
          start: "top 78%",
          once: true,
          onEnter: () => {
            gsap.to(stamp, {
              scale: 1,
              opacity: 1,
              rotation: -10,
              duration: 0.4,
              ease: "power4.in",
            });
          },
        });
      });
    },
    { scope: container, dependencies: [cinematicEnabled, data] }
  );

  if (!data) return null;

  return (
    <SectionBackground
      id="education"
      image="/images/bg-campus.webp"
      opacity="opacity-[0.11] sepia-[0.3]"
      accent={getSectionAccent("education")}
      className="py-24 md:py-36 px-4 sm:px-6"
    >
      <div ref={container} className="mx-auto max-w-6xl">
        <SectionTitle
          kicker="University District"
          title="Skill Tree Unlocked"
          plain="Education"
          sectionId="education"
        />

        <p className="mb-10 max-w-2xl meta-subtle text-sm md:text-base leading-relaxed">
          Campus unlocks on the board — degrees first, schools next, outcomes stamped.
        </p>

        <ol className="edu-timeline relative space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
          {data.education.map((entry, i) => (
            <Reveal
              key={entry.id}
              as="li"
              from={i % 2 === 0 ? "left" : "right"}
              className="edu-diploma relative list-none"
            >
                <article className="mission-card edu-board h-full overflow-hidden">
                  <span
                    className="edu-unlock-stamp gta-title-light text-vice text-lg sm:text-xl"
                    aria-hidden
                  >
                    UNLOCKED
                  </span>
                  <div className="border-b border-sand/15 bg-black/25 px-5 py-3 sm:px-6 flex items-center justify-between gap-3">
                    <p className="meta-label tracking-[0.16em] text-vice">
                      Diploma {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="meta-label tracking-[0.12em] text-sand/70">
                      {entry.period}
                    </p>
                  </div>
                  <div className="p-5 sm:p-7 md:p-8">
                    <h3 className="gta-title-light text-2xl sm:text-3xl text-sand leading-tight">
                      {entry.degree}
                    </h3>
                    <p className="mt-3 font-[family-name:var(--font-oswald)] uppercase tracking-[0.14em] text-sm text-money">
                      {entry.school}
                    </p>
                    <p className="mt-2 meta-subtle">{entry.location}</p>
                    {entry.note && (
                      <p className="mt-5 inline-block bg-black/45 border border-vice/45 px-3 py-1.5 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-[0.14em] text-vice">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </SectionBackground>
  );
}
