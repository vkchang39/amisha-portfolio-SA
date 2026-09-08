"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppReady } from "@/context/AppReadyContext";
import { useGameUi } from "@/context/GameUiContext";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useCinematicMotion } from "@/hooks/useCinematicMotion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useResume } from "@/hooks/useResume";

const MENU_ITEMS = [
  { id: "resume", label: "Resume", action: "resume" as const },
  { id: "map", label: "Map", action: "map" as const },
  { id: "stats", label: "Stats", action: "stats" as const },
  { id: "brief", label: "Brief", action: "brief" as const },
  { id: "settings", label: "Settings", action: "settings" as const },
];

const BRIEF_BULLETS = [
  "IT Project Coordinator — 1.6+ years shipping web, mobile, and enterprise software.",
  "Agile/Scrum & Waterfall SDLC coordination across dev, design, and QA teams.",
  "Delivered CERT-IN aligned DMS platform and mobile apps for high-growth brands.",
];

/** Escape toggles the pause menu. Letter hotkeys and cheat codes live in GlobalHotkeys. */
export function PauseMenuHotkey() {
  const { isAppReady } = useAppReady();
  const { pauseOpen, openPause, closePause, mapOpen } = useGameUi();

  useEffect(() => {
    if (!isAppReady) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (mapOpen) return; // MapScreen owns Escape while open

      e.preventDefault();
      if (pauseOpen) closePause();
      else openPause();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAppReady, pauseOpen, mapOpen, openPause, closePause]);

  return null;
}

function PauseMenuPanel() {
  const {
    closePause,
    openMap,
    navigateToSection,
    audioMuted,
    toggleMute,
    skipAnimations,
    toggleSkipAnimations,
    plainLabels,
    togglePlainLabels,
  } = useGameUi();
  const { play } = useGameAudio();
  const { cinematicEnabled, reducedMotion } = useCinematicMotion();
  const { data } = useResume();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleAction = useCallback(
    (action: (typeof MENU_ITEMS)[number]["action"]) => {
      play("menuSelect");
      switch (action) {
        case "resume":
          closePause();
          break;
        case "map":
          openMap();
          break;
        case "stats":
          navigateToSection("stats");
          break;
        case "brief":
          setBriefOpen(true);
          setSettingsOpen(false);
          break;
        case "settings":
          setSettingsOpen((s) => !s);
          setBriefOpen(false);
          break;
        default: {
          const exhaustive: never = action;
          return exhaustive;
        }
      }
    },
    [closePause, openMap, navigateToSection, play]
  );

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    return () => {
      previousFocus.current?.focus();
    };
  }, []);

  useFocusTrap(menuRef, true);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (briefOpen) {
          setBriefOpen(false);
        } else if (settingsOpen) {
          setSettingsOpen(false);
        } else {
          closePause();
        }
        return;
      }

      if (settingsOpen && e.key === "Enter") {
        const target = document.activeElement as HTMLElement;
        if (target.dataset.setting === "sound") {
          toggleMute();
          play("menuSelect");
        } else if (target.dataset.setting === "animations") {
          toggleSkipAnimations();
          play("menuSelect");
        } else if (target.dataset.setting === "labels") {
          togglePlainLabels();
          play("menuSelect");
        }
        return;
      }

      if (briefOpen || settingsOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % MENU_ITEMS.length);
        play("menuMove");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
        play("menuMove");
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleAction(MENU_ITEMS[selectedIndex].action);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    selectedIndex,
    settingsOpen,
    briefOpen,
    handleAction,
    toggleMute,
    toggleSkipAnimations,
    togglePlainLabels,
    play,
    closePause,
  ]);

  return (
    <div
      className="pause-menu-backdrop"
      role="presentation"
      onClick={closePause}
    >
      <div
        ref={menuRef}
        className={`pause-menu ${!cinematicEnabled ? "pause-menu-reduced" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Pause menu"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="pause-menu-title gta-title text-sand text-3xl md:text-4xl mb-6">
          Paused
        </p>

        {!briefOpen && !settingsOpen && (
          <ul className="pause-menu-list" role="menu">
            {MENU_ITEMS.map((item, i) => (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={`pause-menu-item ${i === selectedIndex ? "pause-menu-item-active" : ""}`}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => handleAction(item.action)}
                >
                  {i === selectedIndex && <span className="pause-menu-arrow">&gt;</span>}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {briefOpen && (
          <div className="pause-menu-brief">
            <p className="meta-label mb-3 tracking-[0.14em]">Mission Brief</p>
            <ul className="pause-menu-brief-list">
              {BRIEF_BULLETS.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            {data && (
              <p className="mt-4 text-sm text-sand/80 leading-relaxed">{data.summary}</p>
            )}
            <button
              type="button"
              className="pause-menu-settings-btn mt-4"
              onClick={() => {
                navigateToSection("about");
              }}
            >
              Read full story →
            </button>
            <button
              type="button"
              className="pause-menu-settings-btn mt-2"
              onClick={() => setBriefOpen(false)}
            >
              Back
            </button>
          </div>
        )}

        {settingsOpen && (
          <div className="pause-menu-settings">
            <p className="meta-label mb-3 tracking-[0.14em]">Display, Audio &amp; Motion</p>
            <button
              type="button"
              data-setting="labels"
              className="pause-menu-settings-btn"
              onClick={() => {
                togglePlainLabels();
                play("menuSelect");
              }}
            >
              Plain section labels: {plainLabels ? "On" : "Off"}
            </button>
            <button
              type="button"
              data-setting="sound"
              className="pause-menu-settings-btn mt-2"
              onClick={() => {
                toggleMute();
                play("menuSelect");
              }}
            >
              Sound: {audioMuted ? "Off" : "On"}
            </button>
            <button
              type="button"
              data-setting="animations"
              className="pause-menu-settings-btn mt-2"
              onClick={() => {
                toggleSkipAnimations();
                play("menuSelect");
              }}
            >
              Animations: {skipAnimations ? "Off" : "On"}
            </button>
            <p className="meta-subtle text-xs mt-3 leading-relaxed">
              {reducedMotion
                ? "Reduced motion is enabled in your system settings."
                : "Toggle animations off to skip scroll effects site-wide."}
            </p>
            <button
              type="button"
              className="pause-menu-settings-btn mt-3"
              onClick={() => setSettingsOpen(false)}
            >
              Back
            </button>
          </div>
        )}

        <p className="pause-menu-hint meta-subtle text-xs mt-6 tracking-[0.12em]">
          ↑↓ Navigate · Enter Select · Esc Resume
        </p>
        <p className="pause-menu-hint meta-subtle text-xs mt-1 tracking-[0.12em]">
          Anywhere: <kbd>Esc</kbd> Pause · <kbd>M</kbd> Map · <kbd>R</kbd> Radio
        </p>
      </div>
    </div>
  );
}

export function PauseMenu() {
  const { isAppReady } = useAppReady();
  const { pauseOpen } = useGameUi();

  if (!isAppReady || !pauseOpen) return null;

  return <PauseMenuPanel />;
}
