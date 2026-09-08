"use client";

import { useGameUi } from "@/context/GameUiContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function useCinematicMotion() {
  const reducedMotion = useReducedMotion();
  const { skipAnimations } = useGameUi();

  return {
    cinematicEnabled: !reducedMotion && !skipAnimations,
    reducedMotion,
    skipAnimations,
  };
}
