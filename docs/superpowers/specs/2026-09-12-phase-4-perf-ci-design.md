# Phase 4 — Perf + CI — Design

**Goal:** Cut below-fold WebGL cost, pause hero when unused, and build the static export once in CI.

## In scope

1. Near-viewport gate for StatsPillars + PhoneBooth (`useNearViewport`)
2. Hero `frameloop` off when hidden, pause, or map open
3. Remove About portrait `priority`
4. CI: one `GITHUB_PAGES` build → e2e + LH + Pages artifact; `scripts/serve-export.mjs` strips basePath for local servers

## Out of scope

Theme/mobile pack, resume content TODOs, styled-components removal
