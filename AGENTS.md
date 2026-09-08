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
- Use original San Andreas loading-screen-style generated artwork; do not use actual Rockstar copyrighted game screenshots or official art.
- Preferred stack for this project: Three.js/R3F, GSAP, Lenis, styled-components, Tailwind CSS, TanStack Query, TypeScript.

## Learned Workspace Facts

- Personal portfolio site for Amisha Sharma (IT Project Coordinator).
- Next.js 16.2.9 with React 19; resume data in `src/lib/resume.ts`; downloadable CV at `public/Amisha_Sharma_CV.pdf`.
- Sections use GTA metaphors: Missions (experience), Projects, Stats/Skills, Education, Contact.
- Section backgrounds use SA loading-screen-style JPEG art in `public/images/` at low opacity with gradient overlays.
- Game UI layer includes persistent HUD, ESC pause menu, mission-passed overlays, map screen, and radio HUD via `GameUiContext`.
- Pricedown font (`public/fonts/pricedown.woff`) is the primary GTA display typeface.
