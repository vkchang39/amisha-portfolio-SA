"use client";

import { useEffect, useState } from "react";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";

const PHRASES = [
  "Grove Street — Home",
  "Mission Passed + Respect",
  "15+ Projects Delivered",
  "Agile · Scrum · Waterfall",
  "No Cheat Codes Used",
  "Sprint Planning OG",
  "On Time. On Budget.",
];

function MarqueeStar() {
  return (
    <svg
      className="marquee-star text-money"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8-6.1-3.4-6.1 3.4 1.4-6.8L2.2 9.1l6.9-.8z" />
    </svg>
  );
}

export function Marquee() {
  const [paused, setPaused] = useState(false);
  const { cinematicEnabled } = useCinematicMotion();

  useEffect(() => {
    const onVisibility = () => {
      setPaused(document.visibilityState === "hidden");
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const row = PHRASES.map((phrase, i) => (
    <span key={i} className="mx-8 inline-flex items-center gap-8">
      <span>{phrase}</span>
      <MarqueeStar />
    </span>
  ));

  const shouldAnimate = cinematicEnabled && !paused;

  return (
    <div
      className="relative overflow-hidden border-y border-sand/15 bg-night-2 py-3"
      aria-hidden
    >
      <div
        className={`marquee-track flex w-max whitespace-nowrap meta-label tracking-[0.2em] ${
          shouldAnimate ? "" : "marquee-track-paused"
        }`}
      >
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0" aria-hidden>
          {row}
        </div>
      </div>
    </div>
  );
}
