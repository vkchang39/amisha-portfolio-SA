"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function CounterStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="mission-card p-6 text-center">
      <p className="gta-title-light text-5xl md:text-6xl text-money">{value}</p>
      <p className="mt-2 font-[family-name:var(--font-oswald)] text-xs uppercase tracking-[0.25em] text-sand/70">
        {label}
      </p>
    </div>
  );
}

export function About() {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();

  useGSAP(
    () => {
      gsap.from(".about-stat", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ".about-stats",
          start: "top 85%",
        },
      });
    },
    { scope: container }
  );

  if (!data) return null;

  return (
    <section
      ref={container}
      className="relative py-28 md:py-36 px-6 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/bg-desert-highway.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.1] sepia-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-transparent to-night" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <SectionTitle kicker="The Introduction" title="The Story So Far" />

        <div className="grid gap-12 md:grid-cols-5 items-start">
          <Reveal className="md:col-span-2" from="left">
            <div className="mission-card p-3 group">
              <div className="relative overflow-hidden">
                <Image
                  src="/images/about-portrait.jpg"
                  alt="Amisha Sharma — GTA San Andreas style portrait art"
                  width={819}
                  height={546}
                  className="w-full object-cover sepia-[0.25] contrast-[1.05] transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
                <p className="gta-title-light absolute bottom-3 left-4 text-2xl text-sand">
                  The Coordinator
                </p>
              </div>
              <p className="px-2 pt-3 pb-1 text-center font-[family-name:var(--font-oswald)] text-[0.65rem] uppercase tracking-[0.3em] text-sand/50">
                Los Santos · Last seen shipping on time
              </p>
            </div>
          </Reveal>

          <Reveal className="md:col-span-3" from="right">
            <p className="text-lg md:text-xl leading-relaxed text-sand/85">
              {data.summary}
            </p>
            <p className="mt-6 font-[family-name:var(--font-oswald)] uppercase tracking-[0.2em] text-sm text-money">
              &ldquo;Ah shit, here we go again&rdquo; — every sprint planning, ever.
            </p>

            <div className="mission-card mt-8 p-6">
              <p className="font-[family-name:var(--font-oswald)] uppercase tracking-[0.25em] text-xs text-sand/60 mb-4">
                Core Competencies
              </p>
              <ul className="flex flex-wrap gap-2">
                {data.competencies.map((item) => (
                  <li
                    key={item}
                    className="border border-sand/25 px-3 py-1 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-wider text-sand/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="about-stats mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {data.stats.map((stat) => (
            <div key={stat.label} className="about-stat">
              <CounterStat value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
