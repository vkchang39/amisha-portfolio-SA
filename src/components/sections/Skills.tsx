"use client";

import Image from "next/image";
import { useResume } from "@/hooks/useResume";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatBar } from "@/components/ui/StatBar";
import { Reveal } from "@/components/ui/Reveal";

export function Skills() {
  const { data } = useResume();

  if (!data) return null;

  return (
    <section
      id="stats"
      className="relative py-28 md:py-36 px-6 bg-night-2 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/bg-city-night.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-2 via-transparent to-night-2" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <SectionTitle kicker="Skills" title="Player Stats" />

        <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
          {data.skills.map((skill, i) => (
            <Reveal key={skill.label} delay={i * 0.06}>
              <StatBar label={skill.label} value={skill.value} />
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {skill.items.map((item) => (
                  <span key={item} className="text-xs text-sand/55">
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <p className="text-center font-[family-name:var(--font-oswald)] uppercase tracking-[0.3em] text-xs text-sand/45">
            Stats increase as missions are completed. No cheat codes used.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
