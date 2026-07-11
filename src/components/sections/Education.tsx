"use client";

import Image from "next/image";
import { useResume } from "@/hooks/useResume";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

export function Education() {
  const { data } = useResume();

  if (!data) return null;

  return (
    <section
      id="education"
      className="relative py-28 md:py-36 px-6 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/bg-campus.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.11] sepia-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-transparent to-night" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <SectionTitle
          kicker="Education"
          title="Skill Tree Unlocked"
          accent="#d36ba6"
        />

        <div className="grid gap-8 md:grid-cols-2">
          {data.education.map((entry, i) => (
            <Reveal key={entry.id} from={i % 2 === 0 ? "left" : "right"}>
              <div className="mission-card p-7 md:p-8 h-full">
                <p className="font-[family-name:var(--font-oswald)] text-xs uppercase tracking-[0.3em] text-vice mb-2">
                  {entry.period}
                </p>
                <h3 className="gta-title-light text-3xl text-sand mb-1">
                  {entry.school}
                </h3>
                <p className="font-[family-name:var(--font-oswald)] uppercase tracking-wide text-sand/80">
                  {entry.degree}
                </p>
                <p className="mt-2 text-sm text-sand/55">{entry.location}</p>
                {entry.note && (
                  <p className="mt-4 inline-block bg-black/40 border border-vice/40 px-3 py-1 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-[0.2em] text-vice">
                    {entry.note}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
