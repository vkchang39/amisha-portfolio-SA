# Hire-ready pack Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Ship Phase 1 recruiter-conversion polish (SEO, CTAs, Contact, loadout label, Pause Controls).

**Architecture:** Copy and a11y tweaks in existing section/layout/pause components; no new packages.

**Tech Stack:** Next.js App Router, React 19, existing PauseMenu / GtaButtonSound patterns.

## Global Constraints

- Do not invent resume metrics or project URLs
- Prefer name-from-content for CTAs (no conflicting `aria-label` on dual-label buttons)
- Preserve GTA SA visual identity

---

### Task 1: SEO description

**Files:** `src/app/layout.tsx`

- [ ] Rewrite `SITE_DESCRIPTION` hire-first + one SA closer
- [ ] Expand `keywords` with coordinator / Agile / SDLC terms as needed

### Task 2: CTA hints accessible

**Files:** `src/components/sections/Hero.tsx`, `src/components/sections/Contact.tsx`

- [ ] Remove `aria-hidden` from `.cta-hint` spans on Hero and Contact CTAs

### Task 3: Contact subtitle

**Files:** `src/components/sections/Contact.tsx`

- [ ] Soften always-on subtitle under “Wasted?” toward hiring CTA

### Task 4: Loadout Tool label

**Files:** `src/components/sections/Skills.tsx`

- [ ] Change display `Weapon` → `Tool`

### Task 5: Pause Settings Controls

**Files:** `src/components/PauseMenu.tsx`, optionally `src/app/styles/pause-menu.css`

- [ ] Add Controls block listing Esc, M, R, HIREME

### Task 6: Verify

- [ ] `pnpm check`
- [ ] Spot-check e2e selectors still match (Settings / CV links)
