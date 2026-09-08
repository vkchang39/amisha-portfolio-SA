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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { cinematicEnabled } = useCinematicMotion();

  useGSAP(
    () => {
      if (!cinematicEnabled || !titleRef.current) return;

      gsap.set(titleRef.current, {
        clipPath: "inset(0 100% 0 0)",
        WebkitClipPath: "inset(0 100% 0 0)",
      });

      ScrollTrigger.create({
        trigger: titleRef.current,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(titleRef.current, {
            clipPath: "inset(0 0% 0 0)",
            WebkitClipPath: "inset(0 0% 0 0)",
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });
    },
    { scope: titleRef, dependencies: [cinematicEnabled] }
  );

  return (
    <h2 ref={titleRef} className={className}>
      {children}
    </h2>
  );
}
