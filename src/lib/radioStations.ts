export interface RadioStation {
  id: string;
  name: string;
  tagline: string;
  tracks: string[];
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "los-santos",
    name: "Radio Los Santos",
    tagline: "West Coast highlights",
    tracks: [
      "Mission Passed + Respect — Amisha Sharma",
      "Grove Street — Home (Portfolio Mix)",
      "15+ Projects Delivered — Extended Cut",
      "Concurrent Missions — Live Session",
    ],
  },
  {
    id: "playback",
    name: "Playback FM",
    tagline: "Selected project drops",
    tracks: [
      "THE HEIST — DMS Government Platform",
      "BIG SMOKE'S ORDER — DLF India",
      "CLUCKIN' BELL RUN — Coffee Pass India",
      "SHARK TANK SPECIAL — Go Devil",
    ],
  },
  {
    id: "k-jah",
    name: "K-JAH",
    tagline: "Skills & stats rotation",
    tracks: [
      "Project Management — 95% Mastery",
      "Agile/Scrum — Sprint Anthem",
      "Development Stack — React & Flutter",
      "Player Stats — No Cheat Codes",
    ],
  },
  {
    id: "wctr",
    name: "WCTR",
    tagline: "Talk radio & career tips",
    tracks: [
      "Stakeholder Communication Hour",
      "SRS/BRD Deep Dive with Amisha",
      "UAT: User Acceptance Truth",
      "Change Management After Dark",
    ],
  },
];
