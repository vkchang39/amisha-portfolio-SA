"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAppReady } from "@/context/AppReadyContext";
import {
  getLocationBySection,
  SECTION_IDS,
  type MapLocation,
} from "@/lib/mapLocations";
import { RADIO_STATIONS } from "@/lib/radioStations";
import { getWantedLevel } from "@/lib/sectionAccents";

const MUTE_KEY = "portfolio-audio-muted";
const SKIP_ANIMATIONS_KEY = "portfolio-skip-animations";

export interface MissionOverlayPayload {
  id: string;
  title: string;
  respect: number;
  period?: string;
}

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
  saveFlashSeen: boolean;
  money: number;
  respect: number;
  wantedLevel: number;
  missionOverlay: MissionOverlayPayload | null;
  zoneToast: string | null;
  openPause: () => void;
  closePause: () => void;
  openMap: () => void;
  closeMap: () => void;
  toggleMute: () => void;
  toggleSkipAnimations: () => void;
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

const INITIAL_MONEY = 1_500_000;
const INITIAL_RESPECT = 245;

export function GameUiProvider({ children }: { children: ReactNode }) {
  const { isAppReady } = useAppReady();
  const [activeSection, setActiveSection] = useState("top");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [radioStationIndex, setRadioStationIndex] = useState(0);
  const [radioExpanded, setRadioExpanded] = useState(false);
  const [audioMuted, setAudioMuted] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(MUTE_KEY);
    return stored !== null ? stored === "true" : true;
  });
  const [skipAnimations, setSkipAnimations] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SKIP_ANIMATIONS_KEY) === "true";
  });
  const [saveFlashSeen, setSaveFlashSeen] = useState(false);
  const [money] = useState(INITIAL_MONEY);
  const [respect, setRespect] = useState(INITIAL_RESPECT);
  const [missionOverlay, setMissionOverlay] = useState<MissionOverlayPayload | null>(
    null
  );
  const [zoneToast, setZoneToast] = useState<string | null>(null);
  const zoneToastTimer = useRef<number | null>(null);
  const pendingRespectRef = useRef<MissionOverlayPayload[]>([]);
  const shownOverlayIdsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!isAppReady) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAppReady]);

  useEffect(() => {
    if (!isAppReady) return;

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0];
        if (top?.target.id) {
          setActiveSection(top.target.id);
          const loc = getLocationBySection(top.target.id);
          if (loc) {
            setZoneToast(loc.zoneName);
            if (zoneToastTimer.current) {
              window.clearTimeout(zoneToastTimer.current);
            }
            zoneToastTimer.current = window.setTimeout(
              () => setZoneToast(null),
              2800
            );
          }
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => {
      observer.disconnect();
      if (zoneToastTimer.current) {
        window.clearTimeout(zoneToastTimer.current);
      }
    };
  }, [isAppReady]);

  const activeLocation = useMemo(
    () => getLocationBySection(activeSection),
    [activeSection]
  );

  const zoneName = activeLocation?.zoneName ?? "San Andreas";

  const wantedLevel = getWantedLevel(activeSection);

  const openPause = useCallback(() => setPauseOpen(true), []);
  const closePause = useCallback(() => setPauseOpen(false), []);
  const openMap = useCallback(() => {
    setMapOpen(true);
    setPauseOpen(false);
  }, []);
  const closeMap = useCallback(() => setMapOpen(false), []);

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
      return next;
    });
  }, []);

  const markSaveFlashSeen = useCallback(() => {
    setSaveFlashSeen(true);
  }, []);

  const stationCount = RADIO_STATIONS.length;

  const nextRadioStation = useCallback(() => {
    setRadioStationIndex((i) => (i + 1) % stationCount);
  }, [stationCount]);

  const prevRadioStation = useCallback(() => {
    setRadioStationIndex((i) => (i - 1 + stationCount) % stationCount);
  }, [stationCount]);

  const addRespect = useCallback((amount: number) => {
    setRespect((r) => r + amount);
  }, []);

  const showMissionOverlay = useCallback((payload: MissionOverlayPayload) => {
    if (shownOverlayIdsRef.current.has(payload.id)) return;

    setMissionOverlay((current) => {
      if (current?.id === payload.id) return current;
      if (current !== null) {
        shownOverlayIdsRef.current.add(payload.id);
        pendingRespectRef.current = [...pendingRespectRef.current, payload];
        return current;
      }
      shownOverlayIdsRef.current.add(payload.id);
      return payload;
    });
  }, []);

  const completeMissionOverlay = useCallback(() => {
    setMissionOverlay((current) => {
      const bonus =
        (current?.respect ?? 0) +
        pendingRespectRef.current.reduce((sum, item) => sum + item.respect, 0);

      pendingRespectRef.current = [];

      if (bonus > 0) {
        setRespect((r) => r + bonus);
      }

      return null;
    });
  }, []);

  const navigateToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setPauseOpen(false);
    setMapOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      activeSection,
      zoneName,
      activeLocation,
      scrollProgress,
      pauseOpen,
      mapOpen,
      radioStationIndex,
      radioExpanded,
      audioMuted,
      skipAnimations,
      saveFlashSeen,
      money,
      respect,
      wantedLevel,
      missionOverlay,
      zoneToast,
      openPause,
      closePause,
      openMap,
      closeMap,
      toggleMute,
      toggleSkipAnimations,
      markSaveFlashSeen,
      setRadioStationIndex,
      setRadioExpanded,
      nextRadioStation,
      prevRadioStation,
      addRespect,
      showMissionOverlay,
      completeMissionOverlay,
      navigateToSection,
    }),
    [
      activeSection,
      zoneName,
      activeLocation,
      scrollProgress,
      pauseOpen,
      mapOpen,
      radioStationIndex,
      radioExpanded,
      audioMuted,
      skipAnimations,
      saveFlashSeen,
      money,
      respect,
      wantedLevel,
      missionOverlay,
      zoneToast,
      openPause,
      closePause,
      openMap,
      closeMap,
      toggleMute,
      toggleSkipAnimations,
      markSaveFlashSeen,
      nextRadioStation,
      prevRadioStation,
      addRespect,
      showMissionOverlay,
      completeMissionOverlay,
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
