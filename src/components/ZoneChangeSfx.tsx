"use client";

import { useEffect, useRef } from "react";
import { useGameUi } from "@/context/GameUiContext";
import { useGameAudio } from "@/hooks/useGameAudio";

/** Plays a short radio re-tune sting whenever the HUD zone toast changes district. */
export function ZoneChangeSfx() {
  const { zoneToast } = useGameUi();
  const { play } = useGameAudio();
  const first = useRef(true);

  useEffect(() => {
    if (!zoneToast) return;
    // Skip the initial "Grove Street — Home" announcement on load.
    if (first.current) {
      first.current = false;
      return;
    }
    play("zoneChange");
  }, [zoneToast, play]);

  return null;
}
