"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppReady } from "@/context/AppReadyContext";
import { useGameUi } from "@/context/GameUiContext";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import "@/lib/gsap";

const FLASH_MS = 500;

function FloppyIcon() {
  return (
    <svg
      className="save-flash-icon"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="8" y="6" width="32" height="36" rx="2" />
      <rect x="14" y="6" width="20" height="12" fill="currentColor" opacity="0.3" />
      <rect x="16" y="24" width="16" height="4" fill="currentColor" opacity="0.5" />
      <rect x="16" y="30" width="12" height="3" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function SaveGameFlash() {
  const { isAppReady } = useAppReady();
  const { saveFlashSeen, markSaveFlashSeen } = useGameUi();
  const { cinematicEnabled } = useCinematicMotion();
  const [visible, setVisible] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!isAppReady || !cinematicEnabled || saveFlashSeen) return;

    const contact = document.getElementById("contact");
    if (!contact) return;

    const trigger = ScrollTrigger.create({
      trigger: contact,
      start: "top 60%",
      once: true,
      onEnter: () => {
        if (triggeredRef.current) return;
        triggeredRef.current = true;
        markSaveFlashSeen();
        setVisible(true);
      },
    });

    return () => trigger.kill();
  }, [isAppReady, cinematicEnabled, saveFlashSeen, markSaveFlashSeen]);

  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => setVisible(false), FLASH_MS);
    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="save-game-flash save-game-flash-animate" aria-hidden>
      <div className="save-game-flash-content">
        <FloppyIcon />
        <p className="gta-title text-money text-3xl md:text-4xl">Game Saved</p>
      </div>
    </div>
  );
}
