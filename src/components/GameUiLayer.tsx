"use client";

import { GameUiProvider } from "@/context/GameUiContext";
import { GameHud, HudCvButton, ZoneAnnouncer } from "@/components/hud/GameHud";
import { PauseMenu, PauseMenuHotkey } from "@/components/PauseMenu";
import { MissionPassedOverlay } from "@/components/MissionPassedOverlay";
import { MapScreen } from "@/components/MapScreen";
import { RadioHud } from "@/components/RadioHud";
import { SaveGameFlash } from "@/components/SaveGameFlash";
import { PageClickBurst } from "@/components/PageClickBurst";
import { GlobalHotkeys } from "@/components/GlobalHotkeys";
import { ZoneChangeSfx } from "@/components/ZoneChangeSfx";

export function GameUiLayer({ children }: { children: React.ReactNode }) {
  return (
    <GameUiProvider>
      {children}
      <PauseMenuHotkey />
      <GlobalHotkeys />
      <ZoneChangeSfx />
      <PageClickBurst />
      <GameHud />
      <HudCvButton />
      <ZoneAnnouncer />
      <PauseMenu />
      <MapScreen />
      <RadioHud />
      <MissionPassedOverlay />
      <SaveGameFlash />
    </GameUiProvider>
  );
}
