"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import "@/lib/gsap";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "left" | "right";
  id?: string;
}

const revealClass = {
  up: "gsap-reveal",
  left: "gsap-reveal-left",
  right: "gsap-reveal-right",
} as const;

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  id,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { cinematicEnabled } = useCinematicMotion();

  useGSAP(
    () => {
      if (!cinematicEnabled || !ref.current) return;

      const offset =
        from === "up"
          ? { y: 60, x: 0 }
          : from === "left"
            ? { y: 0, x: -80 }
            : { y: 0, x: 80 };

      gsap.fromTo(
        ref.current,
        { ...offset, opacity: 0 },
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
          },
        }
      );
    },
    { scope: ref, dependencies: [cinematicEnabled, delay, from] }
  );

  return (
    <div
      ref={ref}
      className={`${revealClass[from]}${className ? ` ${className}` : ""}`}
      id={id}
    >
      {children}
    </div>
  );
}
