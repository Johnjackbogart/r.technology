import { test, expect } from "@playwright/test";
import { VIEWPORTS } from "../../fixtures/viewports";

test.describe("Text Rendering - Desktop", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test("navigation text is readable", async ({ page }) => {
    await page.goto("/");

    const teamLink = page.getByRole("link", { name: "Team" });
    const aboutLink = page.getByRole("link", { name: "About" });
    const portfolioLink = page.getByRole("link", { name: "Portfolio" });

    await expect(teamLink).toBeVisible();
    await expect(aboutLink).toBeVisible();
    await expect(portfolioLink).toBeVisible();

    // Check font size is appropriate for desktop
    const fontSize = await teamLink.evaluate(
      (el) => window.getComputedStyle(el).fontSize,
    );
    const fontSizeNum = parseFloat(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(16);
  });
});

test.describe("Text Rendering - Mobile", () => {
  test.use({ viewport: VIEWPORTS.mobileIPhoneSE });

  test("navigation is visible on mobile", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Team" })).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  });

  test("no horizontal scroll on mobile", async ({ page }) => {
    await page.goto("/");

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test("touch targets are appropriately sized", async ({ page }) => {
    await page.goto("/");

    const themeButton = page.getByRole("button", { name: /toggle theme/i });
    const box = await themeButton.boundingBox();

    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(40);
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });
});

test.describe("Text Rendering - Tablet", () => {
  test.use({ viewport: VIEWPORTS.tabletPortrait });

  test("navigation is visible on tablet", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Team" })).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Portfolio" })).toBeVisible();
  });
});
