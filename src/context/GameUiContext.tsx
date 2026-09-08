"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAppReady } from "@/context/AppReadyContext";
import { usePersistedPrefs } from "@/context/gameUi/usePersistedPrefs";
import { useSectionTracking } from "@/context/gameUi/useSectionTracking";
import {
  useMissionOverlays,
  type MissionOverlayPayload,
} from "@/context/gameUi/useMissionOverlays";
import type { MapLocation } from "@/lib/mapLocations";
import { RADIO_STATIONS } from "@/lib/radioStations";
import { getWantedLevel } from "@/lib/sectionAccents";
import { scrollToElement, shouldUseInstantScroll } from "@/lib/smoothScroll";

export type { MissionOverlayPayload };

interface GameUiContextValue {
  activeSection: string;
  zoneName: string;
  activeLocation: MapLocation | undefined;
  scrollProgress: number;
  pauseOpen: boolean;
  mapOpen: boolean;
  radioStationIndex: number;
  radioExpanded: boolean;
  audioMuted: boolean;
  skipAnimations: boolean;
  plainLabels: boolean;
  saveFlashSeen: boolean;
  money: number;
  respect: number;
  wantedLevel: number;
  hpFilled: number;
  arFilled: number;
  visitedSections: string[];
  missionOverlay: MissionOverlayPayload | null;
  zoneToast: string | null;
  openPause: () => void;
  closePause: () => void;
  openMap: () => void;
  closeMap: () => void;
  toggleMute: () => void;
  toggleSkipAnimations: () => void;
  togglePlainLabels: () => void;
  markSaveFlashSeen: () => void;
  setRadioStationIndex: (index: number) => void;
  setRadioExpanded: (expanded: boolean) => void;
  nextRadioStation: () => void;
  prevRadioStation: () => void;
  addRespect: (amount: number) => void;
  showMissionOverlay: (payload: MissionOverlayPayload) => void;
  completeMissionOverlay: () => void;
  navigateToSection: (sectionId: string) => void;
}

const GameUiContext = createContext<GameUiContextValue | null>(null);

const BASE_MONEY = 750_000;
export const MONEY_PER_SECTION = 125_000;
const MONEY_SCROLL_BONUS = 400_000;

export function GameUiProvider({ children }: { children: ReactNode }) {
  const { isAppReady } = useAppReady();
  const prefs = usePersistedPrefs();
  const tracking = useSectionTracking(isAppReady);
  const missions = useMissionOverlays();

  const [pauseOpen, setPauseOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [radioStationIndex, setRadioStationIndex] = useState(0);
  const [radioExpanded, setRadioExpanded] = useState(false);
  const [saveFlashSeen, setSaveFlashSeen] = useState(false);

  const { activeSection, scrollProgress, visitedSections } = tracking;
  const { respect } = missions;
  const { skipAnimations } = prefs;

  const wantedLevel = getWantedLevel(activeSection);

  const money = useMemo(() => {
    const sectionBonus = Math.max(0, visitedSections.length - 1) * MONEY_PER_SECTION;
    const scrollBonus = Math.round(scrollProgress * MONEY_SCROLL_BONUS);
    return BASE_MONEY + sectionBonus + scrollBonus;
  }, [visitedSections.length, scrollProgress]);

  const hpFilled = Math.min(10, Math.max(3, Math.ceil(scrollProgress * 10)));
  const arFilled = Math.min(10, Math.max(2, Math.round((respect / 600) * 10)));

  const openPause = useCallback(() => setPauseOpen(true), []);
  const closePause = useCallback(() => setPauseOpen(false), []);
  const openMap = useCallback(() => {
    setMapOpen(true);
    setPauseOpen(false);
  }, []);
  const closeMap = useCallback(() => setMapOpen(false), []);
  const markSaveFlashSeen = useCallback(() => setSaveFlashSeen(true), []);

  const stationCount = RADIO_STATIONS.length;
  const nextRadioStation = useCallback(() => {
    setRadioStationIndex((i) => (i + 1) % stationCount);
  }, [stationCount]);
  const prevRadioStation = useCallback(() => {
    setRadioStationIndex((i) => (i - 1 + stationCount) % stationCount);
  }, [stationCount]);

  const navigateToSection = useCallback(
    (sectionId: string) => {
      const el = document.getElementById(sectionId);
      if (el) {
        scrollToElement(el, {
          immediate: shouldUseInstantScroll(skipAnimations),
          offset: -8,
        });
      }
      setPauseOpen(false);
      setMapOpen(false);
    },
    [skipAnimations]
  );

  const value = useMemo<GameUiContextValue>(
    () => ({
      ...tracking,
      ...prefs,
      ...missions,
      pauseOpen,
      mapOpen,
      radioStationIndex,
      radioExpanded,
      saveFlashSeen,
      money,
      wantedLevel,
      hpFilled,
      arFilled,
      openPause,
      closePause,
      openMap,
      closeMap,
      markSaveFlashSeen,
      setRadioStationIndex,
      setRadioExpanded,
      nextRadioStation,
      prevRadioStation,
      navigateToSection,
    }),
    [
      tracking,
      prefs,
      missions,
      pauseOpen,
      mapOpen,
      radioStationIndex,
      radioExpanded,
      saveFlashSeen,
      money,
      wantedLevel,
      hpFilled,
      arFilled,
      openPause,
      closePause,
      openMap,
      closeMap,
      markSaveFlashSeen,
      nextRadioStation,
      prevRadioStation,
      navigateToSection,
    ]
  );

  return (
    <GameUiContext.Provider value={value}>{children}</GameUiContext.Provider>
  );
}

export function useGameUi() {
  const context = useContext(GameUiContext);
  if (!context) {
    throw new Error("useGameUi must be used within GameUiProvider");
  }
  return context;
}
