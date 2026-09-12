<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- Use pnpm and current versions of Next.js and dependencies when adding packages.
- Portfolio should feel like GTA San Andreas the game (HUD, pause menu, loading tips, mission overlays), not just GTA-themed copy.
- When improving UI/UX, preserve the GTA San Andreas visual identity (Pricedown font, palette, loading-screen art, HUD language).
- Prefer balanced recruiter clarity plus cinematic game theme over pure immersion or pure professionalism.
- Prefer systematic polish (accessibility, mobile nav, motion sync, performance, CTA clarity) over aggressive restructure or effects-first changes.
- Use original San Andreas loading-screen-style generated artwork (including the boot LoadingScreen background); do not use actual Rockstar copyrighted game screenshots or official art.
- Preferred stack for this project: Three.js/R3F, GSAP, Lenis, styled-components, Tailwind CSS, TanStack Query, TypeScript.
- Keep mission-passed and game-saved overlays very brief (~0.5–1s) so they never block the page.
- Prefer GTA SA-styled custom cursors and procedural hero 3D that reads as an unmistakable SA loading-screen / Los Santos drive (layered depth, skyline, highway, non-boxy detail)—not generic glossy WebGL.
- Prefer site-wide SA interaction FX (e.g. click bursts) over hero-only effects; skip buttons, links, and pause/map overlays.
- Respect pause-menu Animations Off / reduced-motion gates across Lenis, marquees, SFX, and WebGL.

## Learned Workspace Facts

- Personal portfolio site for Amisha Sharma (IT Project Coordinator).
- Next.js 16.2.9 with React 19; resume data in `src/lib/resume.ts`; downloadable CV at `public/Amisha_Sharma_CV.pdf` (static file; no resume API route).
- Sections use GTA metaphors: Missions (experience), Projects, Stats/Skills, Education, Contact.
- Section backgrounds use SA loading-screen-style WebP art in `public/images/` at low opacity with gradient overlays; boot LoadingScreen uses `loading-sa-collage.webp`.
- Game UI layer includes persistent HUD, ESC pause menu, mission-passed overlays, map screen, radio HUD, and page-wide click bursts via `GameUiContext`.
- Pricedown (`public/fonts/pricedown.woff`) is the primary GTA display typeface; UI body uses Source Sans 3 with Oswald accents.
- Static-exported for GitHub Pages (`output: "export"`); live at https://vkchang39.github.io/amisha-portfolio-SA/ with `basePath` when `GITHUB_PAGES=true`.
- Public asset URLs (including `next/image` `src`, which does not auto-apply `basePath`) go through `withBasePath` in `src/lib/basePath.ts`; deploy workflow is `.github/workflows/deploy-github-pages.yml`.
- Link previews use Open Graph/Twitter metadata in `src/app/layout.tsx` with share art at `public/images/og-share.jpg` (1200×630).
- Desktop hero uses procedural `HeroScene` WebGL; city-night art is the mobile/reduced-motion fallback, with a matching sunset placeholder during chunk load to avoid a photo→3D flash.
- Images in `public/images/` are WebP (converted via `pnpm optimize:images` → `scripts/optimize-images.mjs`); only `og-share.jpg` stays JPEG for link-preview crawlers.
- CSS is split by concern under `src/app/styles/*.css` and imported from `globals.css` (all `@import`s must stay at the top). `GameUiContext` composes hooks in `src/context/gameUi/`.
- `pnpm check` = typecheck + lint; `pnpm test:e2e` runs Playwright smoke tests (`e2e/`) against the static export; CI runs both before deploy.
- SEO: `src/app/robots.ts`, `src/app/sitemap.ts`, JSON-LD Person in `layout.tsx` (from `src/lib/structuredData.ts`); `not-found.tsx` is the "Wasted" 404 served as `out/404.html`.
- Pause menu Settings has a "Plain section labels" toggle (default on) that shows recruiter-friendly subtitles under game-styled section titles; hotkeys: Esc pause, M map, R radio; cheats HESOYAM / HIREME / GROVE via `GlobalHotkeys`.
- Optional integrations are env-gated in `src/lib/siteConfig.ts` (`NEXT_PUBLIC_FORM_ENDPOINT`/`_ACCESS_KEY` → contact form, `NEXT_PUBLIC_GOATCOUNTER` → analytics); see `.env.example`; CI passes them from repo Variables.
- Hero bloom uses three's `UnrealBloomPass` directly (no `@react-three/postprocessing`); vignette/fringe are CSS (`.hero-scene-vignette`), grain is the page-wide overlay.
- `pnpm lighthouse` runs Lighthouse CI budgets from `lighthouserc.json` against `out/` (a11y/SEO ≥ 0.95 hard-fail; perf is a warning); runs in the CI `check` job after Playwright.
- PWA surface: `src/app/manifest.ts`, `icon.svg`, `apple-icon.png`, `public/icon-{192,512}.png` (regenerate via `pnpm generate:icons`).
- `resume.ts` carries `availability`, `loadout`, and per-entry `impact` metric chips; values marked `TODO(Amisha)` are placeholders pending real figures.
