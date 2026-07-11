"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { SectionTitle } from "@/components/ui/SectionTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Projects() {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();

  useGSAP(
    () => {
      gsap.from(".project-card", {
        y: 80,
        opacity: 0,
        rotateX: -8,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".project-grid",
          start: "top 80%",
        },
      });
    },
    { scope: container }
  );

  if (!data) return null;

  return (
    <section
      ref={container}
      id="projects"
      className="relative py-28 md:py-36 px-6 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/bg-garage.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.1] sepia-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-transparent to-night" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <SectionTitle
          kicker="Selected Work"
          title="The Big Scores"
          accent="#f2772f"
        />

        <div className="project-grid grid gap-8 md:grid-cols-2 [perspective:1200px]">
          {data.projects.map((project) => (
            <article
              key={project.id}
              className="project-card group mission-card overflow-hidden transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative h-52 md:h-60 overflow-hidden border-b border-sand/15">
                <Image
                  src={project.image}
                  alt={`${project.name} — GTA San Andreas style artwork`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover sepia-[0.2] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-2 via-night-2/20 to-transparent" />
                <p className="gta-title-light absolute bottom-3 left-6 text-2xl md:text-3xl text-sunset drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)]">
                  {project.codename}
                </p>
              </div>

              <div className="p-7 md:p-8 pt-6">
              <h3 className="font-[family-name:var(--font-oswald)] text-2xl font-semibold uppercase tracking-wide text-sand">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-money transition-colors"
                  >
                    {project.name} ↗
                  </a>
                ) : (
                  project.name
                )}
              </h3>
              <p className="mt-1 text-xs font-[family-name:var(--font-oswald)] uppercase tracking-[0.25em] text-sand/55">
                {project.role} · {project.date}
              </p>

              <ul className="mt-5 space-y-3">
                {project.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-sand/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-sunset" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-black/40 border border-sunset/40 px-3 py-1 text-[0.65rem] font-[family-name:var(--font-oswald)] uppercase tracking-[0.2em] text-sunset"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
