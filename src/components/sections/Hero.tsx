"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { useAppReady } from "@/context/AppReadyContext";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { GtaButtonSound } from "@/components/ui/GtaButtonSound";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { withBasePath } from "@/lib/basePath";
import "@/lib/gsap";

/** Matches HeroScene clear color / fog so chunk load never flashes a different photo. */
function HeroScenePlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden hero-scene-placeholder" aria-hidden>
      <div className="absolute inset-0 bg-[#1a0818]" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#ff6a1a]/50 via-[#c42860]/25 to-transparent" />
      <div className="absolute inset-x-0 top-[22%] h-40 bg-gradient-to-r from-transparent via-[#ff9a2a]/35 to-transparent blur-md" />
      <div className="absolute left-1/2 top-[16%] h-52 w-52 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#ffd060] via-[#ff6a1a] to-[#c42840] opacity-65 blur-xl" />
      <div className="hero-fallback-skyline absolute inset-x-0 bottom-[16%] h-28 opacity-90" />
      <div className="hero-fallback-grid absolute inset-x-0 bottom-0 h-[40%] opacity-40" />
    </div>
  );
}

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <HeroScenePlaceholder />,
});

/** Permanent non-WebGL / mobile art fallback — only when 3D will not run. */
function HeroArtFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden hero-fallback" aria-hidden>
      <Image
        src={withBasePath("/images/bg-city-night.webp")}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover scale-110 opacity-70 contrast-[1.15] saturate-[1.2]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a1040]/55 via-[#2a0c28]/35 to-night" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#ff6a1a]/45 via-[#c42860]/20 to-transparent" />
      <div className="absolute inset-x-0 top-[30%] h-32 bg-gradient-to-r from-transparent via-[#ff9a2a]/40 to-transparent blur-lg" />
      <div className="absolute left-1/2 top-[18%] h-56 w-56 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#ffd060] via-[#ff6a1a] to-[#c42840] opacity-70 blur-xl" />
      <div className="hero-fallback-skyline absolute inset-x-0 bottom-[18%] h-28 opacity-80" />
      <div className="hero-fallback-grid absolute inset-x-0 bottom-0 h-[42%] opacity-45" />
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [webglSupported] = useState(() =>
    typeof window !== "undefined" ? detectWebGL() : true
  );

  // Intent to use WebGL — mount early under the loading screen so the photo→canvas swap never happens.
  const useWebGLScene = webglSupported && cinematicEnabled && !isMobile;

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
        {useWebGLScene ? (
          <>
            {/* Base layer stays until/while canvas paints — same palette as the 3D sky */}
            <HeroScenePlaceholder />
            <div className="absolute inset-0">
              <HeroScene scrollProgress={scrollProgress} />
            </div>
          </>
        ) : (
          <HeroArtFallback />
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

        <div className="hero-sub mt-4">
          <AvailabilityBadge availability={data.availability} compact />
        </div>

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
