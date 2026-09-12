# Phase 2 Clarity + Light CI Implementation Plan

> **For agentic workers:** Implement task-by-task.

**Goal:** Nav dual labels, integration docs, mobile Lighthouse warn run.

**Architecture:** Prefer existing `plainLabels` pref; add `lighthouserc.mobile.json` + CI step.

**Tech Stack:** Next.js, existing GameUi prefs, LHCI.

## Global Constraints

- Name-from-content for nav (no conflicting aria-label)
- Mobile LH assertions are warn-only
- Do not invent form/analytics credentials

---

### Task 1: Nav dual labels

**Files:** `src/components/Nav.tsx`, nav-related CSS if needed

- [ ] Add `plain` to `LINKS`
- [ ] Read `plainLabels` from `useGameUi`
- [ ] Render subtitle when on; e2e smoke optional

### Task 2: Docs

**Files:** `README.md`, `.env.example`

- [ ] Checklist for Variables + redeploy

### Task 3: Mobile Lighthouse

**Files:** `lighthouserc.mobile.json`, `package.json`, `.github/workflows/deploy-github-pages.yml`

- [ ] Mobile preset, warn assertions
- [ ] `pnpm lighthouse:mobile` + CI after desktop

### Task 4: Verify

- [ ] `pnpm check`
