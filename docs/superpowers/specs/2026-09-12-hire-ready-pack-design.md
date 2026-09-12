# Hire-ready pack (Phase 1) — Design

**Goal:** Improve recruiter conversion without inventing resume metrics or touching WebGL/CI.

## In scope

1. **SEO copy** — `SITE_DESCRIPTION` (and keywords if thin) lead with IT Project Coordinator + delivery outcomes; one short SA closer max.
2. **CTA accessibility** — Keep game button text and visible `.cta-hint`s; remove `aria-hidden` from hints so accessible name comes from content (avoids `label-content-name-mismatch` from conflicting `aria-label`s).
3. **Contact H1** — Keep “Wasted?”; strengthen always-on plain subtitle toward hiring CTA.
4. **Loadout label** — UI string `Weapon` → `Tool` in Skills; data `kind` stays `"tool"`.
5. **Pause Controls** — In Settings, list Esc / M / R / HIREME (CV download).
6. **Projects** — No invented links or metrics.

## Out of scope

- Resume `TODO(Amisha)` placeholder figures
- Nav dual labels, env form/analytics wiring, HeroScene split, mobile Lighthouse

## Success

- Link previews read hire-first
- Screen readers announce recruiter CTA meaning
- Contact and loadout feel serious without killing SA theme
- Hotkeys discoverable from Settings
- Existing e2e / LH a11y pattern preserved
