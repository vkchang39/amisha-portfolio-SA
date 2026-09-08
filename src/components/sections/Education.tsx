"use client";

import { useResume } from "@/hooks/useResume";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { getSectionAccent } from "@/lib/sectionAccents";

export function Education() {
  const { data } = useResume();

  if (!data) return null;

  return (
    <SectionBackground
      id="education"
      image="/images/bg-campus.jpg"
      opacity="opacity-[0.11] sepia-[0.3]"
      accent={getSectionAccent("education")}
      className="py-24 md:py-36 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          kicker="Education"
          title="Skill Tree Unlocked"
          sectionId="education"
        />

        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {data.education.map((entry, i) => (
            <Reveal key={entry.id} from={i % 2 === 0 ? "left" : "right"}>
              <div className="mission-card p-6 md:p-8 h-full">
                <p className="meta-label text-vice mb-2 tracking-[0.14em]">
                  {entry.period}
                </p>
                <h3 className="gta-title-light text-2xl sm:text-3xl text-sand mb-1">
                  {entry.school}
                </h3>
                <p className="font-[family-name:var(--font-oswald)] uppercase tracking-wide text-sand/85">
                  {entry.degree}
                </p>
                <p className="mt-2 meta-subtle">{entry.location}</p>
                {entry.note && (
                  <p className="mt-4 inline-block bg-black/40 border border-vice/40 px-3 py-1 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-[0.14em] text-vice">
                    {entry.note}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionBackground>
  );
}
