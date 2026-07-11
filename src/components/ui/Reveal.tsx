"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "left" | "right";
  id?: string;
}

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  id,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const offset =
        from === "up"
          ? { y: 60, x: 0 }
          : from === "left"
            ? { y: 0, x: -80 }
            : { y: 0, x: 80 };

      gsap.from(ref.current, {
        ...offset,
        opacity: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
}
