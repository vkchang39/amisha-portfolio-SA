"use client";

import { useCallback, useRef } from "react";
import { useGameUi } from "@/context/GameUiContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type SoundType = "menuMove" | "menuSelect" | "missionPassed" | "buttonClick";

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.08
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function useGameAudio() {
  const { audioMuted } = useGameUi();
  const reducedMotion = useReducedMotion();
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      if (audioMuted || reducedMotion) return;
      const ctx = getContext();
      if (!ctx) return;

      switch (type) {
        case "menuMove":
          playTone(ctx, 440, 0.06, "square", 0.04);
          break;
        case "menuSelect":
          playTone(ctx, 660, 0.1, "square", 0.06);
          playTone(ctx, 880, 0.08, "square", 0.04);
          break;
        case "buttonClick":
          playTone(ctx, 520, 0.05, "triangle", 0.05);
          break;
        case "missionPassed":
          playTone(ctx, 523, 0.12, "square", 0.07);
          window.setTimeout(() => playTone(ctx, 659, 0.12, "square", 0.07), 80);
          window.setTimeout(() => playTone(ctx, 784, 0.2, "square", 0.08), 160);
          break;
        default: {
          const exhaustive: never = type;
          return exhaustive;
        }
      }
    },
    [audioMuted, reducedMotion, getContext]
  );

  return { play };
}
