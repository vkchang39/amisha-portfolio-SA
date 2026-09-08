"use client";

import { GameUiProvider } from "@/context/GameUiContext";
import { GameHud } from "@/components/hud/GameHud";
import { PauseMenu, PauseMenuHotkey } from "@/components/PauseMenu";
import { MissionPassedOverlay } from "@/components/MissionPassedOverlay";
import { MapScreen } from "@/components/MapScreen";
import { RadioHud } from "@/components/RadioHud";
import { SaveGameFlash } from "@/components/SaveGameFlash";

export function GameUiLayer({ children }: { children: React.ReactNode }) {
  return (
    <GameUiProvider>
      {children}
      <PauseMenuHotkey />
      <GameHud />
      <PauseMenu />
      <MapScreen />
      <RadioHud />
      <MissionPassedOverlay />
      <SaveGameFlash />
    </GameUiProvider>
  );
}
