"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAppReady } from "@/context/AppReadyContext";
import { MONEY_PER_SECTION, useGameUi } from "@/context/GameUiContext";
import { MAP_LOCATIONS } from "@/lib/mapLocations";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { useResume } from "@/hooks/useResume";
import { withBasePath } from "@/lib/basePath";
import "@/lib/gsap";

const TICKER_MS = 900;

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/** Brief "+$125,000" pop next to the money counter when a new district is reached. */
function MoneyTicker({ visitedCount }: { visitedCount: number }) {
  const [visible, setVisible] = useState(false);
  const prevCount = useRef(visitedCount);

  useEffect(() => {
    if (visitedCount <= prevCount.current) return;
    prevCount.current = visitedCount;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), TICKER_MS);
    return () => window.clearTimeout(t);
  }, [visitedCount]);

  if (!visible) return null;
  return (
    <span className="game-hud-ticker" aria-hidden>
      +{formatMoney(MONEY_PER_SECTION)}
    </span>
  );
}

/** SA-style HUD clock: session time as an in-game HH:MM (1 real second = 1 game minute). */
function SessionClock() {
  const [minutes, setMinutes] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setMinutes((m) => m + 1), 1000);
    return () => window.clearInterval(t);
  }, []);
  // Start the "day" at 07:00 like a fresh SA save.
  const total = 7 * 60 + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return (
    <p className="game-hud-clock" aria-hidden>
      {hh}:{mm}
    </p>
  );
}

/** Always-visible CV download — one click from any viewport, styled as a HUD chip. */
export function HudCvButton() {
  const { isAppReady } = useAppReady();
  const { pauseOpen, mapOpen, radioExpanded } = useGameUi();
  const { data } = useResume();

  if (!isAppReady || !data || pauseOpen || mapOpen || radioExpanded) return null;

  return (
    <a
      href={withBasePath(data.cvUrl)}
      download
      className="game-hud-cv"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>CV</span>
      <span className="sr-only"> download (PDF)</span>
    </a>
  );
}

function WantedStars({ level }: { level: number }) {
  const starsRef = useRef<HTMLDivElement>(null);
  const prevLevel = useRef(level);
  const { cinematicEnabled } = useCinematicMotion();

  useEffect(() => {
    if (!starsRef.current) return;

    const stars = starsRef.current.querySelectorAll<SVGElement>(".game-hud-star");
    const from = prevLevel.current;
    const to = level;
    prevLevel.current = level;

    stars.forEach((star, i) => {
      const filled = i < to;
      const wasFilled = i < from;

      if (!cinematicEnabled) {
        star.setAttribute("fill", filled ? "#e8d5a0" : "none");
        star.classList.toggle("game-hud-star-active", filled);
        return;
      }

      if (filled && !wasFilled) {
        gsap.fromTo(
          star,
          { scale: 0.4, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.2,
            delay: i * 0.2,
            ease: "power2.out",
            onStart: () => {
              star.setAttribute("fill", "#e8d5a0");
              star.classList.add("game-hud-star-active");
            },
          }
        );
      } else if (!filled && wasFilled) {
        gsap.to(star, {
          scale: 0.85,
          opacity: 0.5,
          duration: 0.15,
          delay: (5 - i) * 0.05,
          ease: "power2.in",
          onComplete: () => {
            star.setAttribute("fill", "none");
            star.classList.remove("game-hud-star-active");
            gsap.set(star, { scale: 1, opacity: 1 });
          },
        });
      } else {
        star.setAttribute("fill", filled ? "#e8d5a0" : "none");
        star.classList.toggle("game-hud-star-active", filled);
      }
    });
  }, [level, cinematicEnabled]);

  return (
    <div ref={starsRef} className="game-hud-stars flex gap-0.5" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <svg
          key={i}
          className={`game-hud-star h-4 w-4 md:h-5 md:w-5 ${i < level ? "game-hud-star-active" : ""}`}
          viewBox="0 0 24 24"
          fill={i < level ? "#e8d5a0" : "none"}
          stroke="#e8d5a0"
          strokeWidth="1.5"
        >
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8-6.1-3.4-6.1 3.4 1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      ))}
    </div>
  );
}

function StatusBar({
  label,
  segments,
  filled,
  colorClass,
}: {
  label: string;
  segments: number;
  filled: number;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <span className="game-hud-bar-label">{label}</span>
      <div className="flex gap-px">
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={`game-hud-segment ${i < filled ? colorClass : "game-hud-segment-empty"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function ZoneAnnouncer() {
  const { isAppReady } = useAppReady();
  const { zoneToast } = useGameUi();

  if (!isAppReady || !zoneToast) return null;

  return (
    <div className="game-hud-zone-toast" role="status" aria-live="polite">
      Entering: {zoneToast}
    </div>
  );
}

export function GameHud() {
  const { isAppReady } = useAppReady();
  const {
    money,
    respect,
    wantedLevel,
    activeLocation,
    scrollProgress,
    activeSection,
    hpFilled,
    arFilled,
    visitedSections,
  } = useGameUi();
  const { cinematicEnabled } = useCinematicMotion();

  if (!isAppReady) return null;

  const weapon = activeLocation?.weapon ?? "Resume";
  const blips = MAP_LOCATIONS.filter((loc) => loc.sectionId !== "top");

  const playerX = 12 + scrollProgress * 76;
  const playerY = 78 - scrollProgress * 58;

  return (
    <div className="game-hud pointer-events-none fixed inset-0 z-[var(--z-hud)]" aria-hidden>
      <div className="game-hud-panel game-hud-top-right">
        <SessionClock />
        <div className="relative">
          <p className="game-hud-money">{formatMoney(money)}</p>
          {cinematicEnabled && <MoneyTicker visitedCount={visitedSections.length} />}
        </div>
        <WantedStars level={wantedLevel} />
        <StatusBar
          label="HP"
          segments={10}
          filled={hpFilled}
          colorClass="game-hud-hp"
        />
        <StatusBar
          label="AR"
          segments={10}
          filled={arFilled}
          colorClass="game-hud-ar"
        />
        <div className="game-hud-weapon">
          <svg
            className="game-hud-weapon-icon"
            viewBox="0 0 16 16"
            width="12"
            height="12"
            aria-hidden
          >
            <path
              d="M8 1l1.8 4.2H14l-3.5 2.6 1.3 4.2L8 11.2 4.2 12l1.3-4.2L2 5.2h4.2z"
              fill="currentColor"
            />
          </svg>
          <span className="game-hud-weapon-name">{weapon}</span>
        </div>
        <p className="game-hud-respect">Respect: {respect}</p>
      </div>

      <div className="game-hud-radar-wrap">
        <div
          className={`game-hud-radar ${cinematicEnabled ? "game-hud-radar-spin" : ""}`}
        >
          <div className="game-hud-radar-inner">
            {blips.map((loc) => (
              <span
                key={loc.id}
                className={`game-hud-blip game-hud-blip-${loc.type} ${
                  activeSection === loc.sectionId ? "game-hud-blip-active" : ""
                }`}
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              />
            ))}
            <span
              className="game-hud-player"
              style={{ left: `${playerX}%`, top: `${playerY}%` }}
            />
          </div>
        </div>
        <p className="game-hud-radar-label">RADAR</p>
      </div>
    </div>
  );
}
