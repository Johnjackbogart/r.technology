import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle("Hi :)");
  });

  test("navigation is visible", async ({ page }) => {
    // Check nav links are present
    await expect(page.getByRole("link", { name: "Team" })).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Portfolio" })).toBeVisible();
  });

  test("theme toggle is accessible", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /toggle theme/i });
    await expect(themeButton).toBeVisible();

    // Click to open dropdown (force click to bypass any overlays)
    await themeButton.click({ force: true });

    // Check theme options appear
    await expect(page.getByRole("menuitem", { name: "Light" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Dark" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "System" })).toBeVisible();
  });

  test("navigation links are clickable", async ({ page }) => {
    // Verify Team link can be clicked
    const teamLink = page.getByRole("link", { name: "Team" });
    await expect(teamLink).toBeEnabled();

    // Verify About link can be clicked
    const aboutLink = page.getByRole("link", { name: "About" });
    await expect(aboutLink).toBeEnabled();
  });
});
