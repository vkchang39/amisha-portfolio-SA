"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { SectionTitle } from "@/components/ui/SectionTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Missions() {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".mission-entry").forEach((entry, i) => {
        gsap.from(entry, {
          x: i % 2 === 0 ? -90 : 90,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: entry,
            start: "top 82%",
          },
        });

        const stamp = entry.querySelector(".mission-stamp");
        if (stamp) {
          gsap.from(stamp, {
            scale: 2.4,
            opacity: 0,
            rotation: 8,
            duration: 0.45,
            ease: "power4.in",
            scrollTrigger: {
              trigger: entry,
              start: "top 70%",
            },
          });
        }
      });

      gsap.from(".mission-line", {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 0.6,
        },
      });
    },
    { scope: container }
  );

  if (!data) return null;

  return (
    <section
      ref={container}
      id="missions"
      className="relative py-28 md:py-36 px-6 bg-night-2 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/bg-grove-street.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-[0.13] sepia-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-2 via-transparent to-night-2" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <SectionTitle kicker="Work Experience" title="Missions Passed" />

        <div className="relative">
          <div className="mission-line absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-money via-sunset to-blood md:-translate-x-1/2" />

          <div className="space-y-16">
            {data.experience.map((job, i) => (
              <article
                key={job.id}
                className={`mission-entry relative pl-12 md:pl-0 md:w-[calc(50%-2.5rem)] ${
                  i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                }`}
              >
                <div
                  className={`absolute top-2 left-4 md:left-auto h-4 w-4 -translate-x-1/2 rotate-45 bg-money border-2 border-night ${
                    i % 2 === 0
                      ? "md:left-auto md:-right-[2.5rem] md:translate-x-1/2"
                      : "md:-left-[2.5rem]"
                  }`}
                />

                <div className="mission-card p-7 md:p-8">
                  <div className="mission-stamp gta-title-light text-money text-2xl md:text-3xl mb-4">
                    Mission Passed!
                  </div>
                  <p className="font-[family-name:var(--font-oswald)] text-xs uppercase tracking-[0.3em] text-sunset mb-1">
                    {job.period} · {job.location}
                  </p>
                  <h3 className="font-[family-name:var(--font-oswald)] text-2xl font-semibold text-sand uppercase tracking-wide">
                    {job.role}
                  </h3>
                  <p className="text-sand/60 font-[family-name:var(--font-oswald)] uppercase tracking-wider text-sm mb-5">
                    {job.company}
                  </p>
                  <ul className="space-y-3">
                    {job.bullets.map((bullet, j) => (
                      <li
                        key={j}
                        className="flex gap-3 text-sm leading-relaxed text-sand/80"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-money" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="font-[family-name:var(--font-oswald)] text-[0.65rem] uppercase tracking-[0.3em] text-sand/50">
                      Respect earned
                    </span>
                    <div className="h-2 flex-1 bg-black/50 border border-sand/20">
                      <div
                        className="h-full bg-gradient-to-r from-grove to-money"
                        style={{ width: `${job.respect}%` }}
                      />
                    </div>
                    <span className="font-[family-name:var(--font-pricedown)] text-money">
                      +{job.respect}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
