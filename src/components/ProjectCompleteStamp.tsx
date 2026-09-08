"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import "@/lib/gsap";

export function ProjectCompleteStamp({ projectId }: { projectId: string }) {
  const stampRef = useRef<HTMLSpanElement>(null);
  const { cinematicEnabled } = useCinematicMotion();

  useGSAP(
    () => {
      if (!cinematicEnabled || !stampRef.current) return;

      gsap.set(stampRef.current, { scale: 2.2, opacity: 0, rotation: -12 });
      ScrollTrigger.create({
        trigger: stampRef.current.closest(".project-card"),
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(stampRef.current, {
            scale: 1,
            opacity: 1,
            rotation: -12,
            duration: 0.4,
            ease: "power4.in",
          });
        },
      });
    },
    { scope: stampRef, dependencies: [cinematicEnabled, projectId] }
  );

  return (
    <span
      ref={stampRef}
      className="project-complete-stamp gta-title-light text-money text-lg sm:text-xl"
      aria-hidden
    >
      COMPLETE
    </span>
  );
}
