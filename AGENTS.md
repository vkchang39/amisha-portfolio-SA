<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- Use pnpm and current versions of Next.js and dependencies when adding packages.
- Portfolio should feel like GTA San Andreas the game (HUD, pause menu, loading tips, mission overlays), not just GTA-themed copy.
- When improving UI/UX, preserve the GTA San Andreas visual identity (Pricedown font, palette, loading-screen art, HUD language).
- Prefer balanced recruiter clarity plus cinematic game theme; prioritize hire-first meta, accessible CTAs, and Contact clarity before WebGL or theme-only work.
- Prefer systematic polish (accessibility, mobile nav, motion sync, performance, CTA clarity) over aggressive restructure or effects-first changes.
- Use original San Andreas loading-screen-style generated artwork (including the boot LoadingScreen background); do not use actual Rockstar copyrighted game screenshots or official art.
- Preferred stack for this project: Three.js/R3F, GSAP, Lenis, styled-components, Tailwind CSS, TanStack Query, TypeScript.
- Keep mission-passed and game-saved overlays very brief (~0.5–1s) so they never block the page.
- Prefer GTA SA-styled custom cursors and procedural hero 3D that reads as an unmistakable SA loading-screen / Los Santos drive (layered depth, skyline, highway, non-boxy detail)—not generic glossy WebGL.
- Prefer site-wide SA interaction FX (e.g. click bursts) over hero-only effects; skip buttons, links, and pause/map overlays.
- Respect pause-menu Animations Off / reduced-motion gates across Lenis, marquees, SFX, and WebGL.
- Do not invent resume impact metrics or project links; leave `TODO(Amisha)` placeholders until real figures are confirmed.

## Learned Workspace Facts

- Personal portfolio site for Amisha Sharma (IT Project Coordinator); resume data in `src/lib/resume.ts` (`availability`, `loadout`, per-entry `impact` chips; `TODO(Amisha)` placeholders); CV at `public/Amisha_Sharma_CV.pdf` (static; no resume API).
- Next.js 16.2.9 with React 19; static-exported for GitHub Pages (`output: "export"`); live at https://vkchang39.github.io/amisha-portfolio-SA/ with `basePath` when `GITHUB_PAGES=true`; deploy via `.github/workflows/deploy-github-pages.yml`.
- Sections use GTA metaphors: Missions (experience), Projects, Stats/Skills, Education, Contact; Plain section labels (default on) add recruiter subtitles under titles and nav dual labels (e.g. Missions → Work experience); Pause Controls list Esc / M / R / HIREME; cheats HESOYAM / HIREME / GROVE via `GlobalHotkeys`.
- Game UI layer includes persistent HUD, ESC pause menu, mission-passed overlays, map screen, radio HUD, and page-wide click bursts via `GameUiContext` (hooks in `src/context/gameUi/`).
- Pricedown (`public/fonts/pricedown.woff`) is the primary GTA display typeface; UI body uses Source Sans 3 with Oswald accents.
- Public asset URLs (including `next/image` `src`) go through `withBasePath` in `src/lib/basePath.ts`; section/boot art is SA-style WebP in `public/images/` (`loading-sa-collage.webp` for LoadingScreen); `pnpm optimize:images` converts images (only `og-share.jpg` stays JPEG).
- Desktop hero WebGL lives under `src/components/three/hero/` and re-exports from `@/components/three/HeroScene`; city-night art is the mobile/reduced-motion fallback with a sunset placeholder during chunk load; bloom uses three `UnrealBloomPass` (no `@react-three/postprocessing`); vignette/fringe are CSS; grain is page-wide.
- Link previews use Open Graph/Twitter in `src/app/layout.tsx` with `public/images/og-share.jpg` (1200×630); SEO via `robots.ts`, `sitemap.ts`, JSON-LD Person (`structuredData.ts`); `not-found.tsx` is the "Wasted" 404 as `out/404.html`; PWA via `manifest.ts` and `pnpm generate:icons`.
- CSS is split under `src/app/styles/*.css` and imported from `globals.css` (all `@import`s must stay at the top).
- `pnpm check` = typecheck + lint; `pnpm test:e2e` runs Playwright (`e2e/`) against the static export; `pnpm lighthouse` enforces desktop a11y/SEO ≥ 0.95 (perf warn); `pnpm lighthouse:mobile` is warn-only via `lighthouserc.mobile.json`; CI runs check → e2e → both LH jobs before deploy.
- Optional integrations are env-gated in `src/lib/siteConfig.ts` (`NEXT_PUBLIC_FORM_ENDPOINT`/`_ACCESS_KEY` → contact form, `NEXT_PUBLIC_GOATCOUNTER` → analytics); see `.env.example`; CI passes them from repo Variables.
