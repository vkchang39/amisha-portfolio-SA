"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { useGameUi } from "@/context/GameUiContext";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getSectionAccent } from "@/lib/sectionAccents";
import "@/lib/gsap";

export function Missions() {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();
  const { showMissionOverlay } = useGameUi();
  const { cinematicEnabled } = useCinematicMotion();
  const showMissionOverlayRef = useRef(showMissionOverlay);
  const triggeredOverlaysRef = useRef(new Set<string>());

  useEffect(() => {
    showMissionOverlayRef.current = showMissionOverlay;
  }, [showMissionOverlay]);

  useGSAP(
    () => {
      if (!cinematicEnabled || !data) return;

      gsap.utils.toArray<HTMLElement>(".mission-entry").forEach((entry, i) => {
        const job = data.experience[i];
        if (job) {
          ScrollTrigger.create({
            trigger: entry,
            start: "top 70%",
            once: true,
            onEnter: () => {
              if (triggeredOverlaysRef.current.has(job.id)) return;
              triggeredOverlaysRef.current.add(job.id);
              showMissionOverlayRef.current({
                id: job.id,
                title: `${job.role} @ ${job.company}`,
                respect: job.respect,
                period: job.period,
              });
            },
          });
        }

        gsap.fromTo(
          entry,
          { x: i % 2 === 0 ? -90 : 90, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 82%",
            },
          }
        );

        const stamp = entry.querySelector(".mission-stamp");
        if (stamp) {
          gsap.fromTo(
            stamp,
            { scale: 2.4, opacity: 0, rotation: 8 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.45,
              ease: "power4.in",
              scrollTrigger: {
                trigger: entry,
                start: "top 70%",
              },
            }
          );
        }
      });

      gsap.fromTo(
        ".mission-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: container, dependencies: [cinematicEnabled, data] }
  );

  if (!data) return null;

  return (
    <SectionBackground
      id="missions"
      image="/images/bg-grove-street.jpg"
      opacity="opacity-[0.13] sepia-[0.3]"
      accent={getSectionAccent("missions")}
      className="py-24 md:py-36 px-4 sm:px-6 bg-night-2"
      gradientClassName="bg-gradient-to-b from-night-2 via-transparent to-night-2"
    >
      <div ref={container} className="mx-auto max-w-6xl">
        <SectionTitle
          kicker="Work Experience"
          title="Missions Passed"
          sectionId="missions"
        />

        <div className="relative">
          <div className="mission-line absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-money via-sunset to-blood md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {data.experience.map((job, i) => (
              <article
                key={job.id}
                className={`mission-entry relative pl-11 sm:pl-12 md:pl-0 md:w-[calc(50%-2.5rem)] ${
                  i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                }`}
              >
                <div
                  className={`absolute top-2 left-4 md:left-auto h-4 w-4 -translate-x-1/2 rotate-45 bg-money border-2 border-night ${
                    i % 2 === 0
                      ? "md:left-auto md:-right-10 md:translate-x-1/2"
                      : "md:-left-10"
                  }`}
                  aria-hidden
                />

                <div className="mission-card p-6 md:p-8">
                  <div className="mission-stamp gta-title-light text-money text-xl sm:text-2xl md:text-3xl mb-4">
                    Mission Passed!
                  </div>
                  <p className="meta-label text-sunset mb-1 tracking-[0.14em]">
                    {job.period} · {job.location}
                  </p>
                  <h3 className="font-[family-name:var(--font-oswald)] text-xl sm:text-2xl font-semibold text-sand uppercase tracking-wide">
                    {job.role}
                  </h3>
                  <p className="meta-subtle font-[family-name:var(--font-oswald)] uppercase tracking-wide text-sm mb-5">
                    {job.company}
                  </p>
                  <ul className="space-y-3">
                    {job.bullets.map((bullet, j) => (
                      <li
                        key={j}
                        className="flex gap-3 text-sm leading-relaxed text-sand/85"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-money"
                          aria-hidden
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="meta-label tracking-[0.12em] shrink-0">
                      Respect earned
                    </span>
                    <div
                      className="h-2 flex-1 bg-black/50 border border-sand/20"
                      role="progressbar"
                      aria-valuenow={job.respect}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Respect earned: ${job.respect}%`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-grove to-money"
                        style={{ width: `${job.respect}%` }}
                      />
                    </div>
                    <span className="font-[family-name:var(--font-pricedown)] text-money shrink-0">
                      +{job.respect}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionBackground>
  );
}
