"use client";

import { useCallback, useMemo, useRef, useState } from "react";

export interface MissionOverlayPayload {
  id: string;
  title: string;
  respect: number;
  period?: string;
}

const INITIAL_RESPECT = 245;

/** Mission-passed overlay queue and the respect counter it feeds. */
export function useMissionOverlays() {
  const [respect, setRespect] = useState(INITIAL_RESPECT);
  const [missionOverlay, setMissionOverlay] = useState<MissionOverlayPayload | null>(
    null
  );
  const pendingRespectRef = useRef<MissionOverlayPayload[]>([]);
  const shownOverlayIdsRef = useRef(new Set<string>());

  const addRespect = useCallback((amount: number) => {
    setRespect((r) => r + amount);
  }, []);

  const showMissionOverlay = useCallback((payload: MissionOverlayPayload) => {
    if (shownOverlayIdsRef.current.has(payload.id)) return;

    setMissionOverlay((current) => {
      if (current?.id === payload.id) return current;
      shownOverlayIdsRef.current.add(payload.id);
      if (current !== null) {
        // Another overlay is on screen; bank the respect and skip the duplicate flash.
        pendingRespectRef.current = [...pendingRespectRef.current, payload];
        return current;
      }
      return payload;
    });
  }, []);

  const completeMissionOverlay = useCallback(() => {
    setMissionOverlay((current) => {
      const bonus =
        (current?.respect ?? 0) +
        pendingRespectRef.current.reduce((sum, item) => sum + item.respect, 0);
      pendingRespectRef.current = [];
      if (bonus > 0) setRespect((r) => r + bonus);
      return null;
    });
  }, []);

  return useMemo(
    () => ({
      respect,
      missionOverlay,
      addRespect,
      showMissionOverlay,
      completeMissionOverlay,
    }),
    [respect, missionOverlay, addRespect, showMissionOverlay, completeMissionOverlay]
  );
}
