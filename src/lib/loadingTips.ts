import { withBasePath } from "@/lib/basePath";

export const LOADING_SPLASHES = [
  "/images/bg-grove-street.jpg",
  "/images/bg-desert-highway.jpg",
  "/images/bg-city-night.jpg",
] as const;

export const LOADING_TIPS = [
  "Press ESC to open the pause menu and browse stats.",
  "Deliver projects on time to max your respect bar.",
  "Use the radar in the bottom-left to navigate San Andreas.",
  "Switch radio stations for portfolio highlights.",
  "Mission Passed overlays appear as you scroll through experience.",
  "Download the CV from the nav — no cheat codes required.",
  "Agile sprints are like wanted levels: plan your escape route.",
  "Stakeholder communication is the real endgame boss.",
  "Check the map from the pause menu to jump between sections.",
  "Grove Street. Home. At least it was, before you scrolled away.",
] as const;

export const DEFAULT_LOADING_TIP = LOADING_TIPS[0];
export const DEFAULT_LOADING_SPLASH = withBasePath(LOADING_SPLASHES[0]);

export function getRandomTip(): string {
  return LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)];
}

export function getRandomSplash(): string {
  return withBasePath(
    LOADING_SPLASHES[Math.floor(Math.random() * LOADING_SPLASHES.length)]
  );
}
