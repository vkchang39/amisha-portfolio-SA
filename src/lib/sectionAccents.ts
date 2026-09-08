export const SECTION_ACCENTS: Record<string, string> = {
  top: "var(--accent-grove)",
  about: "var(--accent-grove)",
  missions: "var(--accent-money)",
  projects: "var(--accent-sunset)",
  stats: "var(--accent-hud)",
  education: "var(--accent-vice)",
  contact: "var(--accent-blood)",
};

export const WANTED_BY_SECTION: Record<string, number> = {
  top: 0,
  about: 1,
  missions: 3,
  projects: 4,
  stats: 3,
  education: 2,
  contact: 6,
};

export function getSectionAccent(sectionId: string): string {
  return SECTION_ACCENTS[sectionId] ?? "var(--accent-money)";
}

export function getWantedLevel(sectionId: string): number {
  return WANTED_BY_SECTION[sectionId] ?? 0;
}
