import { test, expect } from "@playwright/test";
import { VIEWPORTS } from "../../fixtures/viewports";

test.describe("Navigation - Cross Viewport", () => {
  const viewportsToTest = [
    { name: "desktop", viewport: VIEWPORTS.desktop },
    { name: "tablet", viewport: VIEWPORTS.tabletPortrait },
    { name: "mobile", viewport: VIEWPORTS.mobileIPhoneSE },
  ];

  for (const { name, viewport } of viewportsToTest) {
    test.describe(`${name} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport });

      test("all nav links are visible", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByRole("link", { name: "Team" })).toBeVisible();
        await expect(page.getByRole("link", { name: "About" })).toBeVisible();
        await expect(
          page.getByRole("link", { name: "Portfolio" }),
        ).toBeVisible();
      });

      test("theme toggle opens menu", async ({ page }) => {
        await page.goto("/");

        const themeButton = page.getByRole("button", { name: /toggle theme/i });
        await expect(themeButton).toBeVisible();

        // Open menu
        await themeButton.click();

        // Verify menu items appear
        await expect(
          page.getByRole("menuitem", { name: "Dark" }),
        ).toBeVisible();
        await expect(
          page.getByRole("menuitem", { name: "Light" }),
        ).toBeVisible();
        await expect(
          page.getByRole("menuitem", { name: "System" }),
        ).toBeVisible();
      });

      test("R logo is visible", async ({ page }) => {
        await page.goto("/");

        // The R logo links to home/hero
        const logoLink = page.locator('a[href="/"]').first();
        await expect(logoLink).toBeVisible();
      });
    });
  }
});
