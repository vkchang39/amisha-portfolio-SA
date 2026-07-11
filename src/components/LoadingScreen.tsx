"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function LoadingScreen() {
  const container = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => setDone(true),
      });

      tl.to(".loading-bar-fill", {
        scaleX: 1,
        duration: 1.4,
        ease: "power2.inOut",
      })
        .to(".loading-text", { opacity: 0, duration: 0.25 }, "+=0.15")
        .to(
          ".loading-panel",
          {
            yPercent: (i) => (i % 2 === 0 ? -101 : 101),
            duration: 0.7,
            ease: "power4.inOut",
            stagger: 0.06,
          },
          "<"
        );
    },
    { scope: container }
  );

  if (done) return null;

  return (
    <div ref={container} className="fixed inset-0 z-[100]">
      {/* GTA SA loading screens are split into bold color panels */}
      <div className="absolute inset-0 flex">
        <div className="loading-panel h-full flex-1 bg-[#36682c]" />
        <div className="loading-panel h-full flex-1 bg-[#0c0913]" />
        <div className="loading-panel h-full flex-1 bg-[#b3262a]" />
        <div className="loading-panel h-full flex-1 bg-[#0c0913]" />
        <div className="loading-panel h-full flex-1 bg-[#e8d5a0]" />
      </div>

      <div className="loading-text absolute inset-0 flex flex-col items-center justify-center gap-6">
        <p className="gta-title text-5xl md:text-7xl text-sand">
          Amisha Sharma
        </p>
        <div className="w-56 md:w-72 border border-sand/50 bg-black/40 p-1">
          <div className="loading-bar-fill h-2 w-full origin-left scale-x-0 bg-gradient-to-r from-grove to-money" />
        </div>
        <p className="blink font-[family-name:var(--font-oswald)] text-[0.65rem] uppercase tracking-[0.45em] text-sand/70">
          Loading San Andreas
        </p>
      </div>
    </div>
  );
}
