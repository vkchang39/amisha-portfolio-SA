"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAppReady } from "@/context/AppReadyContext";
import { useGameUi } from "@/context/GameUiContext";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { useGameAudio } from "@/hooks/useGameAudio";

interface Burst {
  id: number;
  x: number;
  y: number;
}

const MAX_BURSTS = 5;

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "a, button, input, textarea, select, label, summary, [role='button'], [role='menuitem'], [data-no-click-burst], .pause-menu, .map-screen, .radio-hud"
    )
  );
}

/** Site-wide SA crosshair click burst (fixed viewport coords). */
export function PageClickBurst() {
  const { isAppReady } = useAppReady();
  const { pauseOpen, mapOpen } = useGameUi();
  const { cinematicEnabled } = useCinematicMotion();
  const { play } = useGameAudio();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);
  const reactId = useId();
  const blocked = pauseOpen || mapOpen || !isAppReady;

  const spawn = useCallback(
    (clientX: number, clientY: number) => {
      if (!cinematicEnabled || blocked) return;

      const id = nextId.current++;
      setBursts((prev) => {
        const next = [...prev, { id, x: clientX, y: clientY }];
        return next.slice(-MAX_BURSTS);
      });

      play("buttonClick");

      window.setTimeout(() => {
        setBursts((prev) => prev.filter((burst) => burst.id !== id));
      }, 650);
    },
    [blocked, cinematicEnabled, play]
  );

  useEffect(() => {
    if (!cinematicEnabled || blocked) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (isInteractiveTarget(event.target)) return;
      spawn(event.clientX, event.clientY);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [blocked, cinematicEnabled, spawn]);

  if (!cinematicEnabled || bursts.length === 0) return null;

  return (
    <div className="page-click-layer" aria-hidden>
      {bursts.map((burst) => (
        <span
          key={`${reactId}-${burst.id}`}
          className="page-click-burst"
          style={{ left: burst.x, top: burst.y }}
        >
          <span className="page-click-ring" />
          <span className="page-click-ring page-click-ring-delayed" />
          <span className="page-click-crosshair" />
          <span className="page-click-star page-click-star-a" />
          <span className="page-click-star page-click-star-b" />
          <span className="page-click-star page-click-star-c" />
        </span>
      ))}
    </div>
  );
}
