"use client";

import { useEffect, useRef, useState } from "react";
import { useAppReady } from "@/context/AppReadyContext";
import { useGameUi } from "@/context/GameUiContext";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useResume } from "@/hooks/useResume";
import { withBasePath } from "@/lib/basePath";

const CHEAT_RESPECT = 250;
const TOAST_MS = 1400;
const IDLE_RESET_MS = 1500;

type Cheat = "HESOYAM" | "HIREME" | "GROVE";
const CHEATS: Cheat[] = ["HESOYAM", "HIREME", "GROVE"];
const MAX_LEN = Math.max(...CHEATS.map((c) => c.length));

/**
 * One keyboard listener for single-key hotkeys and SA-style cheat codes, so they
 * can't fight each other (typing HESOYAM must not open the map on its final "M").
 *
 *   M        → toggle map          R      → toggle radio panel
 *   HESOYAM  → respect boost       HIREME → download CV      GROVE → back to top
 *
 * Escape is owned by PauseMenuHotkey / MapScreen. Ignored in form fields and
 * while a dialog is open.
 */
export function GlobalHotkeys() {
  const { isAppReady } = useAppReady();
  const {
    addRespect,
    navigateToSection,
    pauseOpen,
    mapOpen,
    openMap,
    closeMap,
    radioExpanded,
    setRadioExpanded,
  } = useGameUi();
  const { play } = useGameAudio();
  const { data } = useResume();
  const [toast, setToast] = useState<string | null>(null);
  const buffer = useRef("");
  const idleTimer = useRef<number | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!isAppReady) return;

    const showToast = (text: string) => {
      setToast(text);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS);
    };

    const fireCheat = (cheat: Cheat) => {
      play("cheatActivated");
      switch (cheat) {
        case "HESOYAM":
          addRespect(CHEAT_RESPECT);
          showToast(`Cheat activated · Respect +${CHEAT_RESPECT}`);
          break;
        case "HIREME": {
          showToast("Cheat activated · Downloading CV");
          if (data) {
            const a = document.createElement("a");
            a.href = withBasePath(data.cvUrl);
            a.download = "";
            document.body.appendChild(a);
            a.click();
            a.remove();
          }
          break;
        }
        case "GROVE":
          showToast("Cheat activated · Back to Grove Street");
          navigateToSection("top");
          break;
        default: {
          const exhaustive: never = cheat;
          return exhaustive;
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (pauseOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (e.key.length !== 1 || !/[a-z]/i.test(e.key)) return;

      const key = e.key.toUpperCase();
      buffer.current = (buffer.current + key).slice(-MAX_LEN);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        buffer.current = "";
      }, IDLE_RESET_MS);

      const hit = CHEATS.find((c) => buffer.current.endsWith(c));
      if (hit) {
        buffer.current = "";
        if (!mapOpen) fireCheat(hit);
        return;
      }

      // Single-key hotkeys only when this key wasn't typed as part of a longer sequence.
      const lone = buffer.current.length === 1;
      if (!lone) return;

      if (key === "M") {
        e.preventDefault();
        if (mapOpen) closeMap();
        else openMap();
      } else if (key === "R" && !mapOpen) {
        e.preventDefault();
        setRadioExpanded(!radioExpanded);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [
    isAppReady,
    pauseOpen,
    mapOpen,
    radioExpanded,
    openMap,
    closeMap,
    setRadioExpanded,
    addRespect,
    navigateToSection,
    play,
    data,
  ]);

  if (!toast) return null;
  return (
    <div className="cheat-toast" role="status" aria-live="polite">
      {toast}
    </div>
  );
}
