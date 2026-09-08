"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { useAppReady } from "@/context/AppReadyContext";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { GtaButtonSound } from "@/components/ui/GtaButtonSound";
import { withBasePath } from "@/lib/basePath";
import "@/lib/gsap";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene"),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 bg-gradient-to-b from-night via-asphalt to-sunset-2/30"
        aria-hidden
      />
    ),
  }
);

function HeroFallback() {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-b from-[#2a1430] via-night to-[#0c0913]"
      aria-hidden
    >
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sunset/20 to-transparent" />
      <div className="absolute left-1/2 top-[28%] h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-b from-sunset to-blood opacity-60 blur-sm" />
    </div>
  );
}

function WantedStars() {
  return (
    <div className="hero-stars flex gap-1.5" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <svg
          key={i}
          className="hero-star w-5 h-5 md:w-6 md:h-6"
          viewBox="0 0 24 24"
          fill="#e8d5a0"
          stroke="#e8d5a0"
          strokeWidth="1.5"
        >
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8-6.1-3.4-6.1 3.4 1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      ))}
    </div>
  );
}

function detectWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();
  const { isAppReady } = useAppReady();
  const { cinematicEnabled } = useCinematicMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [webglSupported] = useState(() =>
    typeof window !== "undefined" ? detectWebGL() : true
  );
  const showScene = isAppReady && webglSupported && cinematicEnabled;

  useGSAP(
    () => {
      if (!isAppReady || !cinematicEnabled) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      gsap.set(
        [".hero-star", ".hero-line-1", ".hero-line-2", ".hero-sub", ".hero-cta"],
        { clearProps: "all" }
      );

      tl.from(".hero-star", {
        scale: 0,
        rotation: -180,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "back.out(2)",
      })
        .from(
          ".hero-line-1",
          { y: 90, opacity: 0, skewY: 4, duration: 0.9 },
          "-=0.2"
        )
        .from(".hero-line-2", { y: 90, opacity: 0, skewY: 4, duration: 0.9 }, "-=0.65")
        .from(".hero-sub", { y: 30, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-cta", { y: 20, opacity: 0, stagger: 0.12, duration: 0.5 }, "-=0.4");

      gsap.to(".hero-content", {
        yPercent: -28,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            onUpdate: (self) => setScrollProgress(self.progress),
          },
        }
      );
    },
    { scope: container, dependencies: [isAppReady, cinematicEnabled] }
  );

  if (!data) return null;

  return (
    <section
      ref={container}
      id="top"
      className="relative h-svh min-h-[600px] md:min-h-[640px] overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0">
        {showScene ? (
          <HeroScene scrollProgress={scrollProgress} />
        ) : (
          <HeroFallback />
        )}
      </div>

      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 text-center">
        <WantedStars />

        <h1 className="mt-6 leading-[0.88]">
          <span className="hero-line-1 gta-title block text-[14vw] sm:text-[12vw] md:text-[9.5rem] text-sand">
            Amisha
          </span>
          <span className="hero-line-2 gta-title block text-[14vw] sm:text-[12vw] md:text-[9.5rem] text-sunset">
            Sharma
          </span>
        </h1>

        <p className="hero-sub mt-6 md:mt-8 max-w-xl font-[family-name:var(--font-oswald)] uppercase tracking-[0.2em] text-sm md:text-base text-sand/90">
          IT Project Coordinator · San Andreas Edition
        </p>

        <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <span className="hero-cta">
            <GtaButtonSound
              href="#missions"
              $variant="money"
              aria-label="View experience and missions"
            >
              start missions
              <span className="cta-hint">View experience</span>
            </GtaButtonSound>
          </span>
          <span className="hero-cta">
            <GtaButtonSound
              href={withBasePath(data.cvUrl)}
              download
              $variant="sand"
              aria-label="Download Amisha Sharma CV PDF"
            >
              download cv
              <span className="cta-hint">Get resume PDF</span>
            </GtaButtonSound>
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 md:bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="blink meta-label tracking-[0.3em]">Scroll to continue</p>
      </div>
    </section>
  );
}
