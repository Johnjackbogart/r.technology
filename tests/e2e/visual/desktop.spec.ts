import { test, expect, type Page } from "@playwright/test";
import { VIEWPORTS } from "../../fixtures/viewports";

async function waitForPageReady(page: Page) {
  await page.waitForLoadState("networkidle");
  // Hide the 3D canvas to prevent animation instability
  await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) canvas.style.visibility = "hidden";
  });
  await page.waitForTimeout(500);
}

test.describe("Visual Regression - Desktop", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test("navigation bar", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
    await expect(page).toHaveScreenshot("nav-desktop.png");
  });

  test("about section", async ({ page }) => {
    await page.goto("/#about");
    await waitForPageReady(page);
    await expect(page).toHaveScreenshot("about-desktop.png");
  });
});

test.describe("Visual Regression - Desktop Large", () => {
  test.use({ viewport: VIEWPORTS.desktopLarge });

  test("full page at 1920x1080", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
    await expect(page).toHaveScreenshot("full-desktop-large.png");
  });
});
