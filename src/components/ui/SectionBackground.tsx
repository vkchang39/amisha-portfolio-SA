"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { withBasePath } from "@/lib/basePath";
import "@/lib/gsap";

interface SectionBackgroundProps {
  id?: string;
  image: string;
  opacity?: string;
  accent?: string;
  className?: string;
  gradientClassName?: string;
  children: ReactNode;
}

export function SectionBackground({
  id,
  image,
  opacity = "opacity-[0.12]",
  accent,
  className = "",
  gradientClassName = "bg-gradient-to-b from-night via-transparent to-night",
  children,
}: SectionBackgroundProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { cinematicEnabled } = useCinematicMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useGSAP(
    () => {
      if (!cinematicEnabled || !bgRef.current || !sectionRef.current) return;

      gsap.to(bgRef.current, {
        yPercent: isDesktop ? 12 : 8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    },
    { scope: sectionRef, dependencies: [cinematicEnabled, isDesktop] }
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative overflow-hidden ${className}`}
      style={accent ? { ["--section-accent" as string]: accent } : undefined}
    >
      <div ref={bgRef} className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src={withBasePath(image)}
          alt=""
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          quality={65}
          className={`object-cover ${opacity}`}
        />
        <div className={`absolute inset-0 ${gradientClassName}`} />
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}
