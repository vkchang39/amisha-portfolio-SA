"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useResume } from "@/hooks/useResume";
import { GtaButton } from "@/components/ui/GtaButton";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-night via-asphalt to-sunset-2/30" />
  ),
});

gsap.registerPlugin(ScrollTrigger, useGSAP);

function WantedStars() {
  return (
    <div className="hero-stars flex gap-1.5" aria-label="Wanted level: 6 stars">
      {Array.from({ length: 6 }, (_, i) => (
        <svg
          key={i}
          className="hero-star w-5 h-5 md:w-6 md:h-6"
          viewBox="0 0 24 24"
          fill={i < 6 ? "#e8d5a0" : "none"}
          stroke="#e8d5a0"
          strokeWidth="1.5"
        >
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8-6.1-3.4-6.1 3.4 1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      ))}
    </div>
  );
}

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { data } = useResume();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
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
        .from(".hero-cta", { y: 20, opacity: 0, stagger: 0.12, duration: 0.5 }, "-=0.4")
        .from(".hero-hud", { opacity: 0, duration: 0.8 }, "-=0.3");

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
    },
    { scope: container }
  );

  if (!data) return null;

  return (
    <section
      ref={container}
      id="top"
      className="relative h-svh min-h-[640px] overflow-hidden"
    >
      <HeroScene />

      {/* HUD corners */}
      <div className="hero-hud pointer-events-none absolute inset-0 z-20">
        <div className="absolute top-24 left-6 md:left-10 font-[family-name:var(--font-oswald)]">
          <p className="text-money text-lg md:text-xl font-semibold tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
            $1,500,000
          </p>
          <p className="text-sand/80 text-xs tracking-[0.3em] uppercase mt-1">
            Respect: Maxed
          </p>
        </div>
        <div className="absolute top-24 right-6 md:right-10 text-right">
          <p className="font-[family-name:var(--font-oswald)] text-sand text-sm tracking-[0.25em] uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
            {data.title}
          </p>
          <p className="text-hud text-xs tracking-[0.2em] mt-1 uppercase">
            Grove Street — Home
          </p>
        </div>
      </div>

      {/* Main hero content */}
      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <WantedStars />

        <h1 className="mt-6 leading-[0.88]">
          <span className="hero-line-1 gta-title block text-[16vw] md:text-[9.5rem] text-sand">
            Amisha
          </span>
          <span className="hero-line-2 gta-title block text-[16vw] md:text-[9.5rem] text-sunset">
            Sharma
          </span>
        </h1>

        <p className="hero-sub mt-8 max-w-xl font-[family-name:var(--font-oswald)] uppercase tracking-[0.3em] text-sm md:text-base text-sand/85">
          IT Project Coordinator · San Andreas Edition
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <span className="hero-cta">
            <GtaButton href="#missions" $variant="money">
              start missions
            </GtaButton>
          </span>
          <span className="hero-cta">
            <GtaButton href={data.cvUrl} download $variant="sand">
              download cv
            </GtaButton>
          </span>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="blink font-[family-name:var(--font-oswald)] text-xs uppercase tracking-[0.4em] text-sand/60">
          Press ↓ to continue
        </p>
      </div>
    </section>
  );
}
