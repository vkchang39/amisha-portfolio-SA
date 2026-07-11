# Amisha Sharma — Portfolio (San Andreas Edition)

A GTA San Andreas–themed portfolio website for Amisha Sharma, IT Project Coordinator. Grove Street aesthetics, mission-passed work history, player-stat skill bars, and a synthwave Three.js sunset over Los Santos.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Three.js** via **@react-three/fiber**, **@react-three/drei**, and **@react-three/postprocessing** — procedural hero scene (striped sun shader, endless grid, palm silhouettes, skyline, bloom/noise/vignette)
- **GSAP + ScrollTrigger** — scroll-driven reveals, mission-passed stamps, parallax hero
- **Lenis** — smooth scrolling, synced with GSAP's ticker
- **Tailwind CSS v4** — layout and theme tokens
- **styled-components** — interactive UI primitives (GTA menu buttons, stat bars) with SSR registry
- **TanStack Query** — resume data fetched from `/api/resume` with instant local placeholder

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    api/resume/route.ts   # Resume data as JSON API
    layout.tsx            # Fonts (Pricedown, Oswald, Inter) + providers
    providers.tsx         # TanStack Query + Lenis smooth scroll + styled-components registry
    page.tsx              # Section composition
  components/
    three/HeroScene.tsx   # R3F synthwave San Andreas scene
    sections/             # Hero, About, Missions, Projects, Skills, Education, Contact
    ui/                   # GtaButton, StatBar, Reveal, SectionTitle
  hooks/useResume.ts      # TanStack Query hook
  lib/
    resume.ts             # Typed resume data (source of truth)
    registry.tsx          # styled-components SSR registry
public/
  Amisha_Sharma_CV.pdf    # Downloadable CV
  fonts/pricedown.woff    # GTA display font
```

## Updating Content

All resume content lives in `src/lib/resume.ts`. Replace `public/Amisha_Sharma_CV.pdf` to update the downloadable CV.

## Build

```bash
pnpm build
pnpm start
```
