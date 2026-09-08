"use client";

import { useCallback, useMemo, useState } from "react";
import {
  SKIP_ANIMATIONS_KEY,
  dispatchSkipAnimationsChange,
} from "@/lib/smoothScroll";

const MUTE_KEY = "portfolio-audio-muted";
const PLAIN_LABELS_KEY = "portfolio-plain-labels";

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  return stored !== null ? stored === "true" : fallback;
}

/** User preferences persisted to localStorage: sound, animations, plain labels. */
export function usePersistedPrefs() {
  const [audioMuted, setAudioMuted] = useState(() => readBool(MUTE_KEY, true));
  const [skipAnimations, setSkipAnimations] = useState(() =>
    readBool(SKIP_ANIMATIONS_KEY, false)
  );
  const [plainLabels, setPlainLabels] = useState(() =>
    readBool(PLAIN_LABELS_KEY, true)
  );

  const toggleMute = useCallback(() => {
    setAudioMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTE_KEY, String(next));
      return next;
    });
  }, []);

  const toggleSkipAnimations = useCallback(() => {
    setSkipAnimations((prev) => {
      const next = !prev;
      localStorage.setItem(SKIP_ANIMATIONS_KEY, String(next));
      dispatchSkipAnimationsChange(next);
      return next;
    });
  }, []);

  const togglePlainLabels = useCallback(() => {
    setPlainLabels((prev) => {
      const next = !prev;
      localStorage.setItem(PLAIN_LABELS_KEY, String(next));
      return next;
    });
  }, []);

  return useMemo(
    () => ({
      audioMuted,
      skipAnimations,
      plainLabels,
      toggleMute,
      toggleSkipAnimations,
      togglePlainLabels,
    }),
    [
      audioMuted,
      skipAnimations,
      plainLabels,
      toggleMute,
      toggleSkipAnimations,
      togglePlainLabels,
    ]
  );
}
