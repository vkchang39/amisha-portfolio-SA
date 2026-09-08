"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppReady } from "@/context/AppReadyContext";
import { useGameUi } from "@/context/GameUiContext";
import { MAP_LOCATIONS } from "@/lib/mapLocations";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import "@/lib/gsap";

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
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

export function GameHud() {
  const { isAppReady } = useAppReady();
  const {
    money,
    respect,
    wantedLevel,
    activeLocation,
    scrollProgress,
    zoneToast,
    activeSection,
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
        <p className="game-hud-money">{formatMoney(money)}</p>
        <WantedStars level={wantedLevel} />
        <StatusBar label="HP" segments={10} filled={10} colorClass="game-hud-hp" />
        <StatusBar label="AR" segments={10} filled={8} colorClass="game-hud-ar" />
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

      {zoneToast && (
        <div className="game-hud-zone-toast" role="status">
          Entering: {zoneToast}
        </div>
      )}
    </div>
  );
}
