# Amisha Sharma — Portfolio (San Andreas Edition)

Personal portfolio for Amisha Sharma, IT Project Coordinator, styled as a GTA San Andreas
save file: HUD, pause menu, loading-screen collage, mission-passed overlays, and a
procedural Los Santos drive in WebGL. Recruiter clarity comes first; the game layer is
always skippable.

Live: https://vkchang39.github.io/amisha-portfolio-SA/

## Stack

Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS 4 · styled-components ·
GSAP + Lenis · React Three Fiber / drei · TanStack Query · Playwright · Lighthouse CI

## Game → résumé map

| Game UI                | What it actually is                          |
| ---------------------- | -------------------------------------------- |
| Loading screen collage | Original SA-style art (no Rockstar assets)   |
| Missions Passed        | Work experience (`resume.experience`)        |
| The Big Scores         | Projects (`resume.projects`)                 |
| Player Stats + Loadout | Skills, tools and working rituals            |
| Skill Tree Unlocked    | Education                                    |
| Wasted?                | Contact                                      |
| HUD money / respect    | Scroll progress and sections visited         |
| Pause menu (Esc)       | Map, stats, brief, settings                  |

Plain-English subtitles under each section title are on by default and can be toggled in
Pause → Settings. Hotkeys: `Esc` pause, `M` map, `R` radio. Cheat codes: type `HESOYAM`,
`HIREME`, or `GROVE` anywhere on the page.

All copy and data live in `src/lib/resume.ts`. The CV is `public/Amisha_Sharma_CV.pdf`.

## Development

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm check            # tsc --noEmit + eslint
pnpm test:e2e         # Playwright smoke tests against the static export
pnpm lighthouse       # Lighthouse CI budgets (needs a prior `next build`)
pnpm optimize:images  # JPEG/PNG in public/images → WebP
pnpm generate:icons   # Rasterise src/app/icon.svg → PNG icons
```

### Optional integrations

Copy `.env.example` to `.env.local`. Everything degrades gracefully when unset.

| Variable                      | Effect                                                  |
| ----------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_FORM_ENDPOINT`   | Renders the contact form (Web3Forms / Formspree URL)    |
| `NEXT_PUBLIC_FORM_ACCESS_KEY` | Web3Forms access key (omit for Formspree)               |
| `NEXT_PUBLIC_GOATCOUNTER`     | Loads cookieless GoatCounter analytics for that site    |

For the deployed site, set the same names as repository **Variables**
(Settings → Secrets and variables → Actions); the workflow passes them to the build.

## Deploy

Pushes to `main` run `.github/workflows/deploy-github-pages.yml`:

1. `check` — typecheck, lint, Playwright smoke tests, Lighthouse budgets
2. `build` — `next build` with `GITHUB_PAGES=true` (sets `basePath`)
3. `deploy` — GitHub Pages

Pull requests run only the `check` job.

## Project layout

```
src/app/            layout, page, not-found ("Wasted" 404), robots/sitemap/manifest
src/app/styles/     CSS split by concern (hud, pause-menu, loading, sections…)
src/components/     sections/, hud/, three/ (R3F scenes), ui/, game overlays
src/context/gameUi/ hooks composed by GameUiContext (prefs, section tracking, missions)
src/lib/            resume data, base path, structured data, smooth scroll, site config
e2e/                Playwright smoke tests
scripts/            image optimisation, icon generation, OG meta hoisting
```

## Accessibility & motion

- Pause → Settings → **Animations: Off** and `prefers-reduced-motion` disable Lenis,
  marquees, WebGL, SFX and GSAP timelines.
- `prefers-contrast: more` lifts muted text and removes translucent panels.
- Dialogs trap focus; HUD is `aria-hidden` with a separate live region for zone changes.
