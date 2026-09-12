# Phase 3 — HeroScene modularization — Design

**Goal:** Split `HeroScene.tsx` (~1276 lines) into focused modules without changing visuals or quality gates.

## Approach

Mechanical extract under `src/components/three/hero/`. Keep `@/components/three/HeroScene` as the stable default export for `Hero.tsx` dynamic import.

## File map

| File | Responsibility |
|------|----------------|
| `hero/utils.ts` | `seededRand`, `makeLabelTexture` |
| `hero/SkyAtmosphere.tsx` | GLSL + Sky, Sun, DepthHaze, Mountains |
| `hero/City.tsx` | SuburbBlocks, skyline Building helpers |
| `hero/Roadside.tsx` | PowerLines, StreetLamps, Signage, Overpass |
| `hero/Palms.tsx` | Palm geometry + PalmForest |
| `hero/HighwayTraffic.tsx` | InstancedRepeat, Highway, Traffic |
| `hero/CameraAndPost.tsx` | CameraRig, BloomPost, PostEffects |
| `hero/HeroScene.tsx` | Canvas, adaptive quality, composition |
| `three/HeroScene.tsx` | Re-export default |

## Constraints

- No visual / behavior change
- Preserve `lowQuality` gates (StreetLamps, Traffic, PostEffects, stars, DPR)
- Acyclic imports; utils has no scene deps
- Bloom stays three.js UnrealBloomPass (not @react-three/postprocessing)

## Out of scope

- Further quality modes beyond existing adaptive path
- Sharing modules with PhoneBooth / StatsPillars
- Raising Lighthouse hard floors
