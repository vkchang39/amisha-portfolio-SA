"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppReady } from "@/context/AppReadyContext";
import { useGameUi } from "@/context/GameUiContext";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const DISPLAY_MS = 500;
const EXIT_MS = 150;

export function MissionPassedOverlay() {
  const { isAppReady } = useAppReady();
  const { missionOverlay, completeMissionOverlay } = useGameUi();
  const { play } = useGameAudio();
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<number | null>(null);
  const completeRef = useRef(completeMissionOverlay);
  const playRef = useRef(play);
  const exitingIdRef = useRef<string | null>(null);
  const [exitingId, setExitingId] = useState<string | null>(null);

  useEffect(() => {
    completeRef.current = completeMissionOverlay;
  }, [completeMissionOverlay]);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  const overlayId = missionOverlay?.id;
  const exiting = exitingId === overlayId && overlayId != null;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishOverlay = useCallback(() => {
    if (!overlayId || exitingIdRef.current === overlayId) return;

    exitingIdRef.current = overlayId;
    setExitingId(overlayId);
    clearTimer();

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      exitingIdRef.current = null;
      setExitingId(null);
      completeRef.current();
    }, reducedMotion ? 80 : EXIT_MS);
  }, [clearTimer, overlayId, reducedMotion]);

  const finishRef = useRef(finishOverlay);

  useEffect(() => {
    finishRef.current = finishOverlay;
  }, [finishOverlay]);

  useEffect(() => {
    clearTimer();

    if (!overlayId) return;

    playRef.current("missionPassed");

    const holdMs = reducedMotion ? 350 : DISPLAY_MS - EXIT_MS;
    timerRef.current = window.setTimeout(() => finishRef.current(), holdMs);

    return clearTimer;
  }, [overlayId, reducedMotion, clearTimer]);

  if (!isAppReady || !missionOverlay) return null;

  return (
    <div
      className={`mission-overlay ${exiting ? "mission-overlay-exit" : ""} ${
        reducedMotion ? "mission-overlay-reduced" : ""
      }`}
      role="status"
      aria-live="assertive"
      aria-label={`Mission passed: ${missionOverlay.title}`}
      onClick={finishOverlay}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          finishOverlay();
        }
      }}
    >
      <div className="mission-overlay-scanline" aria-hidden />
      <div className="mission-overlay-content">
        <p className="mission-overlay-title gta-title text-money text-4xl sm:text-5xl md:text-6xl">
          Mission Passed!
        </p>
        <p className="mission-overlay-respect font-[family-name:var(--font-pricedown)] text-sand text-xl md:text-2xl mt-3">
          Respect +{missionOverlay.respect}
        </p>
        <p className="meta-label mt-2 tracking-[0.18em]">{missionOverlay.title}</p>
        {missionOverlay.period && (
          <p className="meta-subtle text-sm mt-1 tracking-[0.12em]">
            {missionOverlay.period}
          </p>
        )}
      </div>
    </div>
  );
}
