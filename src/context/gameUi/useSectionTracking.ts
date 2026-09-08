"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getLocationBySection,
  SECTION_IDS,
  type MapLocation,
} from "@/lib/mapLocations";

const ZONE_TOAST_MS = 2800;

interface SectionTracking {
  activeSection: string;
  activeLocation: MapLocation | undefined;
  zoneName: string;
  scrollProgress: number;
  visitedSections: string[];
  zoneToast: string | null;
}

/** Tracks scroll progress, the section in view, visited sections, and zone toasts. */
export function useSectionTracking(enabled: boolean): SectionTracking {
  const [activeSection, setActiveSection] = useState("top");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visitedSections, setVisitedSections] = useState<string[]>(["top"]);
  const [zoneToast, setZoneToast] = useState<string | null>(null);
  const zoneToastTimer = useRef<number | null>(null);
  const lastZoneRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!top?.target.id) return;

        const sectionId = top.target.id;
        setActiveSection(sectionId);
        setVisitedSections((prev) =>
          prev.includes(sectionId) ? prev : [...prev, sectionId]
        );

        const loc = getLocationBySection(sectionId);
        if (loc && lastZoneRef.current !== loc.zoneName) {
          lastZoneRef.current = loc.zoneName;
          setZoneToast(loc.zoneName);
          if (zoneToastTimer.current) window.clearTimeout(zoneToastTimer.current);
          zoneToastTimer.current = window.setTimeout(
            () => setZoneToast(null),
            ZONE_TOAST_MS
          );
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => {
      observer.disconnect();
      if (zoneToastTimer.current) window.clearTimeout(zoneToastTimer.current);
    };
  }, [enabled]);

  const activeLocation = useMemo(
    () => getLocationBySection(activeSection),
    [activeSection]
  );

  return useMemo(
    () => ({
      activeSection,
      activeLocation,
      zoneName: activeLocation?.zoneName ?? "San Andreas",
      scrollProgress,
      visitedSections,
      zoneToast,
    }),
    [activeSection, activeLocation, scrollProgress, visitedSections, zoneToast]
  );
}
