"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import "@/lib/gsap";

export function SprayTitleReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mistRef = useRef<HTMLSpanElement>(null);
  const { cinematicEnabled } = useCinematicMotion();

  useGSAP(
    () => {
      if (!cinematicEnabled || !titleRef.current || !wrapRef.current) return;

      gsap.set(titleRef.current, {
        clipPath: "inset(0 105% 0 -5%)",
        WebkitClipPath: "inset(0 105% 0 -5%)",
        filter: "blur(1.5px)",
        x: -6,
      });
      if (mistRef.current) {
        gsap.set(mistRef.current, { opacity: 0, scaleX: 0.2, x: -20 });
      }

      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top 88%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          if (mistRef.current) {
            tl.to(mistRef.current, {
              opacity: 0.55,
              scaleX: 1,
              x: 0,
              duration: 0.28,
              ease: "power2.out",
            });
          }
          tl.to(
            titleRef.current,
            {
              clipPath: "inset(0 -2% 0 -2%)",
              WebkitClipPath: "inset(0 -2% 0 -2%)",
              filter: "blur(0px)",
              x: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            "-=0.12"
          );
          if (mistRef.current) {
            tl.to(
              mistRef.current,
              { opacity: 0, duration: 0.35, ease: "power1.in" },
              "-=0.2"
            );
          }
          tl.to(
            titleRef.current,
            {
              x: "+=2",
              duration: 0.05,
              yoyo: true,
              repeat: 3,
              ease: "none",
            },
            "-=0.35"
          );
        },
      });
    },
    { scope: wrapRef, dependencies: [cinematicEnabled] }
  );

  return (
    <div ref={wrapRef} className="spray-title-wrap relative inline-block max-w-full">
      <span ref={mistRef} className="spray-title-mist" aria-hidden />
      <h2 ref={titleRef} className={`spray-title ${className}`}>
        {children}
      </h2>
    </div>
  );
}
