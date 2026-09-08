"use client";

import { useCinematicMotion } from "@/hooks/useCinematicMotion";

export function MotionGatedOverlays() {
  const { cinematicEnabled } = useCinematicMotion();

  return (
    <>
      <div className="crt-overlay" aria-hidden />
      <div
        className={`grain-overlay ${cinematicEnabled ? "" : "grain-overlay-static"}`}
        aria-hidden
      />
    </>
  );
}
