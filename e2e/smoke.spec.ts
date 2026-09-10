import { expect, test, type Page } from "@playwright/test";

/** Wait for the SA loading screen to finish and the game UI to mount. */
async function waitForGameReady(page: Page) {
  await page.goto("/");
  await expect(page.locator(".loading-screen")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByRole("link", { name: /CV.*PDF/i }).first()).toBeVisible();
}

test("loading screen finishes and hero renders", async ({ page }) => {
  await waitForGameReady(page);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Amisha/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Sharma/);
  await expect(page.getByText("Scroll to continue")).toBeVisible();
});

test("ESC opens and closes the pause menu", async ({ page }) => {
  await waitForGameReady(page);
  await page.keyboard.press("Escape");
  const dialog = page.getByRole("dialog", { name: "Pause menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("menuitem", { name: "Resume" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("pause menu Stats jumps to the skills section", async ({ page }) => {
  await waitForGameReady(page);
  await page.keyboard.press("Escape");
  await page.getByRole("menuitem", { name: "Stats" }).click();
  await expect(page.getByRole("dialog", { name: "Pause menu" })).toBeHidden();
  await expect(page.locator("#stats")).toBeInViewport({ timeout: 10_000 });
});

test("M hotkey opens the map", async ({ page }) => {
  await waitForGameReady(page);
  await page.keyboard.press("m");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("plain section labels are on by default and can be toggled off", async ({ page }) => {
  await waitForGameReady(page);
  const plainLabel = page.locator(".section-plain-label", { hasText: "Work experience" });
  await plainLabel.scrollIntoViewIfNeeded();
  await expect(plainLabel).toBeVisible();

  await page.keyboard.press("Escape");
  await page.getByRole("menuitem", { name: "Settings" }).click();
  await page.getByRole("button", { name: /Plain section labels: On/ }).click();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(plainLabel).toHaveCount(0);
});

test("CV download links point at the PDF", async ({ page }) => {
  await waitForGameReady(page);
  const hudCv = page.getByRole("link", { name: /CV.*PDF/i }).first();
  await expect(hudCv).toHaveAttribute("href", /Amisha_Sharma_CV\.pdf$/);
  await expect(hudCv).toHaveAttribute("download", "");
  const res = await page.request.get((await hudCv.getAttribute("href")) ?? "");
  expect(res.ok()).toBeTruthy();
  expect(res.headers()["content-type"]).toContain("pdf");
});

test("recruiter surface: availability, impact chips, loadout", async ({ page }) => {
  await waitForGameReady(page);
  await expect(page.locator(".availability-badge").first()).toContainText(/Open to work/i);
  const chip = page.locator(".impact-chip").first();
  await chip.scrollIntoViewIfNeeded();
  await expect(chip).toBeVisible();
  const loadout = page.locator(".loadout-slot").first();
  await loadout.scrollIntoViewIfNeeded();
  await expect(loadout).toBeVisible();
});

test("HESOYAM cheat boosts respect and shows a toast", async ({ page }) => {
  await waitForGameReady(page);
  const respect = page.locator(".game-hud-respect");
  const before = Number((await respect.textContent())?.replace(/\D/g, "") ?? "0");
  await page.keyboard.type("hesoyam", { delay: 30 });
  await expect(page.locator(".cheat-toast")).toContainText(/Respect \+250/);
  await expect
    .poll(async () => Number((await respect.textContent())?.replace(/\D/g, "") ?? "0"))
    .toBe(before + 250);
});

test("PWA surface: manifest and icons", async ({ request }) => {
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBeTruthy();
  const json = await manifest.json();
  expect(json.name).toContain("Amisha Sharma");
  expect((await request.get("/icon.svg")).ok()).toBeTruthy();
  expect((await request.get("/icon-192.png")).ok()).toBeTruthy();
  expect((await request.get("/apple-icon.png")).ok()).toBeTruthy();
});

test("SEO surface: JSON-LD, sitemap, robots, 404", async ({ page, request }) => {
  await page.goto("/");
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(ld).toBeTruthy();
  const parsed = JSON.parse(ld ?? "{}");
  expect(parsed["@type"]).toBe("Person");
  expect(parsed.name).toBe("Amisha Sharma");

  expect((await request.get("/sitemap.xml")).ok()).toBeTruthy();
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("sitemap.xml");

  const notFound = await request.get("/404.html");
  expect(notFound.ok()).toBeTruthy();
  expect(await notFound.text()).toContain("Wasted");
});
