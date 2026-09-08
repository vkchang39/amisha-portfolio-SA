/** A quantified outcome shown as a metric chip (e.g. value "20%", label "faster delivery"). */
export interface ImpactMetric {
  value: string;
  label: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
  respect: number;
  /** Headline numbers recruiters scan for. Keep to 2–3 per role. */
  impact?: ImpactMetric[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  codename: string;
  role: string;
  date: string;
  link?: string;
  image: string;
  bullets: string[];
  tags: string[];
  impact?: ImpactMetric[];
}

/** Current hiring status shown in the Hero and About. */
export interface Availability {
  status: string;
  roles: string;
  location: string;
  notice: string;
}

/** "How I work" — a loadout slot: the tool or ritual and what it's used for. */
export interface LoadoutItem {
  name: string;
  use: string;
  kind: "tool" | "ritual";
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  location: string;
  period: string;
  note?: string;
}

export interface SkillStat {
  label: string;
  value: number;
  items: string[];
}

export interface Resume {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  linkedinUrl: string;
  summary: string;
  cvUrl: string;
  availability: Availability;
  loadout: LoadoutItem[];
  stats: { label: string; value: string }[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  skills: SkillStat[];
  competencies: string[];
}

export const resume: Resume = {
  name: "Amisha Sharma",
  title: "IT Project Coordinator",
  phone: "+91 873-088-8472",
  email: "amishasharma0346@gmail.com",
  linkedin: "linkedin.com/in/amisha-sharma-442aa81a0",
  linkedinUrl: "https://linkedin.com/in/amisha-sharma-442aa81a0",
  cvUrl: "/Amisha_Sharma_CV.pdf",
  // TODO(Amisha): confirm notice period and preferred locations.
  availability: {
    status: "Open to work",
    roles: "IT Project Coordinator · Junior PM · Scrum Master",
    location: "India · Remote-friendly",
    notice: "Notice period: 30 days",
  },
  loadout: [
    { name: "Jira", use: "Sprint boards, backlog grooming, burndown", kind: "tool" },
    { name: "Confluence / Docs", use: "SRS, BRD, release notes", kind: "tool" },
    { name: "Figma", use: "Flow reviews and handoff to dev", kind: "tool" },
    { name: "Gantt / WBS", use: "Timeline and dependency planning", kind: "tool" },
    { name: "Excel / Sheets", use: "Budget, resource and risk logs", kind: "tool" },
    { name: "Daily standup", use: "Blockers surfaced before they cost a day", kind: "ritual" },
    { name: "Sprint review + retro", use: "Demo to stakeholders, tune the process", kind: "ritual" },
    { name: "UAT sign-off", use: "No deploy without client acceptance", kind: "ritual" },
  ],
  summary:
    "IT Project Coordinator with 1.6 years of experience managing web, mobile, and enterprise software projects across Agile and Waterfall environments. Experienced in SDLC coordination, stakeholder communication, sprint planning, and cross-functional team management. Delivered enterprise-grade solutions including a CERT-IN aligned DMS platform and mobile applications for high-growth brands.",
  stats: [
    { label: "Years in the game", value: "1.6+" },
    { label: "Projects delivered", value: "15+" },
    { label: "Concurrent missions", value: "5+" },
    { label: "Crew members led", value: "10+" },
  ],
  experience: [
    {
      id: "invoidea",
      company: "Invoidea Technologies Pvt. Ltd.",
      role: "IT Project Coordinator",
      location: "India",
      period: "August 2025 — Present",
      respect: 100,
      // TODO(Amisha): replace with real on-time %, budget, and team-size figures.
      impact: [
        { value: "5+", label: "concurrent projects" },
        { value: "7", label: "tech stacks shipped" },
        { value: "3", label: "teams coordinated" },
      ],
      bullets: [
        "Delivered 5+ concurrent projects end-to-end, coordinating teams across development, design, and QA using Agile/Scrum and Waterfall frameworks.",
        "Delivered solutions on Laravel, Node.js, React, React Native, WordPress, Shopify, and WIX with database build-out and API integrations.",
        "Coordinated development and deployment of web and mobile solutions including API integrations and database optimization.",
      ],
    },
    {
      id: "iqsetters",
      company: "IQ Setters",
      role: "IT Project Coordinator & Client Services",
      location: "India",
      period: "November 2024 — July 2025",
      respect: 85,
      impact: [
        { value: "10+", label: "projects planned" },
        { value: "20%", label: "faster delivery" },
      ],
      bullets: [
        "Managed project timelines for 10+ web and mobile projects using WBS and Gantt charts, improving delivery efficiency by 20 percent.",
        "Deployed solutions on React, React Native, WordPress, Shopify, and WIX with database development and API integration.",
      ],
    },
    {
      id: "iqsetters-intern",
      company: "IQ Setters",
      role: "SQL Developer Intern",
      location: "India",
      period: "September 2024 — October 2024",
      respect: 60,
      bullets: [
        "Created and maintained database systems for real estate IT services.",
        "Extracted and processed information from various data sources.",
        "Implemented database connectivity with APIs for seamless data flow.",
      ],
    },
  ],
  projects: [
    {
      id: "dms",
      name: "DMS — Document Management System",
      codename: "THE HEIST",
      role: "IT Project Coordinator · Government Organization",
      date: "May 2025",
      link: "https://megadocs.in/",
      image: "/images/project-dms.webp",
      impact: [
        { value: "CERT-IN", label: "security track" },
        { value: "5-tier", label: "role hierarchy" },
      ],
      bullets: [
        "Built a secure Document Management System for a government organization, currently undergoing CERT-IN certification, featuring a multi-tier user role hierarchy (Super Admin down to Viewer).",
        "Designed a complete document workflow engine with Submit → Review → Approve/Reject cycles, bulk ZIP uploads, CSV metadata templates, and auto-suggestion features.",
        "Implemented community and collection management modules with automated ID generation, status management, and comprehensive audit trails.",
      ],
      tags: ["CERT-IN", "Workflow Engine", "RBAC", "Audit Trails"],
    },
    {
      id: "dlf",
      name: "DLF India",
      codename: "BIG SMOKE'S ORDER",
      role: "IT Project Coordinator",
      date: "April 2025",
      link: "https://www.dlfltd.in/",
      image: "/images/project-dlf.webp",
      impact: [{ value: "10+", label: "member team" }],
      bullets: [
        "Managed end-to-end coordination and delivery activities with a 10+ member team.",
        "Led project planning, requirement gathering, stakeholder communication, and SDLC execution.",
        "Oversaw website workflow management, testing cycles, issue tracking, and deployment activities with responsive design and optimized UX.",
      ],
      tags: ["Enterprise Web", "SDLC", "Stakeholders", "QA Cycles"],
    },
    {
      id: "coffeepass",
      name: "Coffee Pass India",
      codename: "CLUCKIN' BELL RUN",
      role: "IT Project Coordinator",
      date: "February 2025",
      image: "/images/project-coffee.webp",
      bullets: [
        "Coordinated end-to-end development and delivery of a cafe membership mobile app using Flutter and Laravel.",
        "Implemented location-based cafe filtering to help users discover nearby partner cafes.",
        "Managed a QR-based coupon redemption workflow enabling partner cafes to scan and validate coupons in real time.",
      ],
      tags: ["Flutter", "Laravel", "QR Redemption", "Geolocation"],
    },
    {
      id: "godevil",
      name: "Go Devil",
      codename: "SHARK TANK SPECIAL",
      role: "IT Project Coordinator",
      date: "November 2024",
      image: "/images/project-godevil.webp",
      impact: [{ value: "Shark Tank", label: "India 2025 feature" }],
      bullets: [
        "Developed a mobile application for an established Shopify business, later featured on Shark Tank India 2025.",
        "Managed development using React, React Native, Node.js, Caddy, MySQL, and Microsoft Azure.",
        "Handled Figma flow design, backend flow, SMS API integration, and payment gateway integration.",
      ],
      tags: ["React Native", "Azure", "Payments", "Shark Tank 2025"],
    },
  ],
  education: [
    {
      id: "iitp",
      school: "IIT Patna",
      degree: "Master of Business Administration (MBA)",
      location: "Patna, India",
      period: "December 2024 — Present",
    },
    {
      id: "nehu",
      school: "North Eastern Hill University",
      degree: "B.Tech in Information Technology",
      location: "Shillong, India",
      period: "November 2020 — July 2024",
      note: "GPA: 8.14",
    },
  ],
  skills: [
    {
      label: "Project Management",
      value: 95,
      items: [
        "JIRA",
        "Agile/Scrum",
        "Waterfall",
        "SDLC",
        "Risk Management",
        "Resource Planning",
        "Milestone Tracking",
        "Budget Oversight",
      ],
    },
    {
      label: "Development",
      value: 78,
      items: [
        "Flutter",
        "Laravel",
        "React",
        "React Native",
        "WordPress",
        "Shopify",
        "WIX",
      ],
    },
    {
      label: "Database",
      value: 82,
      items: ["SQL", "Database Management", "API Integration"],
    },
    {
      label: "Design & Documentation",
      value: 88,
      items: ["Figma", "Excel / Google Sheets", "Project Documentation"],
    },
    {
      label: "Soft Skills",
      value: 92,
      items: ["Teamwork", "Communication", "Leadership"],
    },
  ],
  competencies: [
    "UAT",
    "Sprint Planning",
    "Stakeholder Communication",
    "SRS/BRD",
    "Cross-functional Team Leadership",
    "Risk & Timeline Management",
    "Change Management",
  ],
};
