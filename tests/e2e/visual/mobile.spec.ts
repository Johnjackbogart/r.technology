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

test.describe("Visual Regression - Mobile iPhone SE", () => {
  test.use({ viewport: VIEWPORTS.mobileIPhoneSE });

  test("navigation", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
    await expect(page).toHaveScreenshot("nav-mobile-se.png");
  });
});

test.describe("Visual Regression - Tablet", () => {
  test.use({ viewport: VIEWPORTS.tabletPortrait });

  test("navigation", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
    await expect(page).toHaveScreenshot("nav-tablet.png");
  });
});
