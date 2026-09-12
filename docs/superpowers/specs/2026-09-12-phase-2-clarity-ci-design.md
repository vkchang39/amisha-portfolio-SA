# Phase 2 — Clarity + light CI — Design

**Goal:** Recruiter-clear navigation and safer mobile perf signal without HeroScene work.

## In scope

1. **Nav dual labels** — Each nav link has a game `label` and recruiter `plain`. When `plainLabels` is on (default), show a small subtitle under the game label on desktop and mobile. Accessible name from content (both strings visible).
2. **Integrations docs** — Clarify that contact form + GoatCounter only ship after GitHub Actions Variables are set and a deploy runs; no credentials invented.
3. **Mobile Lighthouse** — Separate mobile collect config with **warn**-level assertions; desktop hard floors unchanged.

## Out of scope

- HeroScene modularization
- Raising desktop performance to hard-fail
- Setting live Form/GoatCounter secrets for the user
- Pause menu dual labels (nav is the first-click surface)

## Mapping

| Game | Plain |
|------|--------|
| Missions | Work experience |
| Projects | Selected projects |
| Stats | Skills & tools |
| Education | Education |
| Contact | Contact |
