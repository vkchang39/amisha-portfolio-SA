export type BlipType = "mission" | "property" | "save" | "skill";

export interface MapLocation {
  id: string;
  sectionId: string;
  label: string;
  zoneName: string;
  x: number;
  y: number;
  type: BlipType;
  weapon?: string;
}

export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: "top",
    sectionId: "top",
    label: "Grove Street",
    zoneName: "Grove Street — Home",
    x: 42,
    y: 78,
    type: "save",
    weapon: "Resume",
  },
  {
    id: "about",
    sectionId: "about",
    label: "The Story",
    zoneName: "The Introduction",
    x: 38,
    y: 65,
    type: "property",
    weapon: "Brief",
  },
  {
    id: "missions",
    sectionId: "missions",
    label: "Missions",
    zoneName: "Mission District",
    x: 55,
    y: 52,
    type: "mission",
    weapon: "JIRA",
  },
  {
    id: "projects",
    sectionId: "projects",
    label: "Projects",
    zoneName: "Downtown Los Santos",
    x: 68,
    y: 40,
    type: "mission",
    weapon: "React Native",
  },
  {
    id: "stats",
    sectionId: "stats",
    label: "Player Stats",
    zoneName: "Gym & Stats",
    x: 72,
    y: 58,
    type: "skill",
    weapon: "Agile/Scrum",
  },
  {
    id: "education",
    sectionId: "education",
    label: "Education",
    zoneName: "University District",
    x: 48,
    y: 32,
    type: "skill",
    weapon: "MBA",
  },
  {
    id: "contact",
    sectionId: "contact",
    label: "Contact",
    zoneName: "Phone Booth",
    x: 82,
    y: 72,
    type: "save",
    weapon: "Email",
  },
];

export const SECTION_IDS = MAP_LOCATIONS.map((loc) => loc.sectionId);

export function getLocationBySection(sectionId: string): MapLocation | undefined {
  return MAP_LOCATIONS.find((loc) => loc.sectionId === sectionId);
}
