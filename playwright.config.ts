import { defineConfig, devices } from "@playwright/test";

const PORT = 3111;
const skipBuild = process.env.PLAYWRIGHT_SKIP_BUILD === "true";
const basePath = (process.env.PLAYWRIGHT_BASE_PATH || "").replace(/\/$/, "");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  timeout: 45_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}${basePath}`,
    trace: "retain-on-failure",
  },
  webServer: {
    // CI reuses the workflow's single static export; locally we build then serve.
    command: skipBuild
      ? `node scripts/serve-export.mjs ${PORT}`
      : `pnpm exec next build && node scripts/serve-export.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}${basePath || ""}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
