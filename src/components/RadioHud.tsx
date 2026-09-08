"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppReady } from "@/context/AppReadyContext";
import { useGameUi } from "@/context/GameUiContext";
import { RADIO_STATIONS } from "@/lib/radioStations";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";

function RadioIcon() {
  return (
    <svg
      className="radio-hud-icon-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="4" y="8" width="16" height="10" rx="1.5" />
      <path d="M8 8V5a4 4 0 018 0v3" />
      <circle cx="12" cy="13" r="2.5" />
      <path d="M7 18h10" strokeLinecap="round" />
    </svg>
  );
}

function RadioWaveform({
  stationIndex,
  animated,
}: {
  stationIndex: number;
  animated: boolean;
}) {
  const heights = useMemo(() => {
    const seed = stationIndex * 17 + 3;
    return Array.from({ length: 12 }, (_, i) => {
      const v = Math.sin(seed + i * 1.7) * 0.5 + 0.5;
      return 20 + v * 80;
    });
  }, [stationIndex]);

  return (
    <div className="radio-waveform" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={`radio-waveform-bar ${animated ? "radio-waveform-bar-active" : ""}`}
          style={{
            ["--bar-height" as string]: `${h}%`,
            ["--bar-delay" as string]: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}

function RadioHudPanel({ stationIndex }: { stationIndex: number }) {
  const station = RADIO_STATIONS[stationIndex];
  const [trackIndex, setTrackIndex] = useState(0);
  const { play } = useGameAudio();
  const { cinematicEnabled } = useCinematicMotion();
  const {
    radioExpanded,
    setRadioExpanded,
    nextRadioStation,
    prevRadioStation,
  } = useGameUi();

  const track = station.tracks[trackIndex % station.tracks.length];

  useEffect(() => {
    const id = window.setInterval(() => {
      setTrackIndex((i) => (i + 1) % station.tracks.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, [station.tracks.length]);

  return (
    <div className={`radio-hud ${radioExpanded ? "radio-hud-expanded" : ""}`}>
      <button
        type="button"
        className="radio-hud-toggle"
        aria-expanded={radioExpanded}
        aria-label={`${station.name} — ${radioExpanded ? "collapse" : "expand"} radio`}
        onClick={() => setRadioExpanded(!radioExpanded)}
      >
        <RadioIcon />
        <span className="radio-hud-station-name">{station.name}</span>
      </button>

      {radioExpanded && (
        <div className="radio-hud-panel">
          <p className="meta-label text-xs tracking-[0.14em]">{station.tagline}</p>
          <p className="radio-hud-fx-note">UI FX only — no live stream</p>
          <RadioWaveform
            stationIndex={stationIndex}
            animated={cinematicEnabled}
          />
          <p className="radio-hud-track" aria-live="polite">
            {track}
          </p>
          <div className="radio-hud-controls">
            <button
              type="button"
              className="radio-hud-btn"
              aria-label="Previous station"
              onClick={() => {
                prevRadioStation();
                play("menuMove");
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
                <path d="M6 6h2v12H6zm3.5 6L18 18V6z" />
              </svg>
            </button>
            <button
              type="button"
              className="radio-hud-btn"
              aria-label="Next station"
              onClick={() => {
                nextRadioStation();
                play("menuMove");
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
                <path d="M16 6h2v12h-2zm-9 6l8.5 6V6z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function RadioHud() {
  const { isAppReady } = useAppReady();
  const { radioStationIndex } = useGameUi();

  if (!isAppReady) return null;

  return <RadioHudPanel key={radioStationIndex} stationIndex={radioStationIndex} />;
}
