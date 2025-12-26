import { test, expect, type Page } from "@playwright/test";

// Helper to scroll to portfolio section and wait for content
async function scrollToPortfolio(page: Page) {
  // Scroll to the very bottom of the page where portfolio lives
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
  });

  // Dispatch scroll event to trigger IntersectionObserver updates
  await page.evaluate(() => {
    window.dispatchEvent(new Event("scroll"));
  });

  // Wait for React/Three.js to process the scroll and render content
  await page.waitForTimeout(2500);

  // Wait for the portfolio heading to appear (indicates 3D scene rendered the content)
  await page.getByRole("heading", { name: /portfolio/i }).waitFor({
    state: "visible",
    timeout: 20000,
  });
}

test.describe("Portfolio Section", () => {
  // Increase timeout for 3D rendering tests
  test.setTimeout(90000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for page to fully load and 3D scene to initialize
    await page.waitForLoadState("networkidle");
    // Give the 3D scene time to initialize
    await page.waitForTimeout(1000);
  });

  test("portfolio navigation link is visible", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Portfolio" })).toBeVisible();
  });

  test("portfolio section content becomes visible after scrolling", async ({
    page,
  }) => {
    await scrollToPortfolio(page);

    // The portfolio heading should now be visible
    await expect(
      page.getByRole("heading", { name: /portfolio/i }),
    ).toBeVisible();
  });

  test("portfolio links are rendered with correct attributes", async ({
    page,
  }) => {
    await scrollToPortfolio(page);

    // Verify through.tech link
    const throughTechLink = page.getByRole("link", { name: /through\.tech/i });
    await expect(throughTechLink).toBeVisible();
    await expect(throughTechLink).toHaveAttribute(
      "href",
      "https://through.tech",
    );
    await expect(throughTechLink).toHaveAttribute("target", "_blank");
    await expect(throughTechLink).toHaveAttribute("rel", "noopener noreferrer");

    // Verify braign.io link
    const braignLink = page.getByRole("link", { name: /braign\.io/i });
    await expect(braignLink).toBeVisible();
    await expect(braignLink).toHaveAttribute("href", "https://braign.io");
    await expect(braignLink).toHaveAttribute("target", "_blank");
    await expect(braignLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("portfolio taglines are displayed", async ({ page }) => {
    await scrollToPortfolio(page);

    // Verify taglines
    await expect(page.getByText("need to keep the lights on")).toBeVisible();
    await expect(
      page.getByText("tools for the technical marketer"),
    ).toBeVisible();
  });

  test("both portfolio links are present", async ({ page }) => {
    await scrollToPortfolio(page);

    // Count the portfolio links
    const portfolioLinks = page.locator(
      'a[href="https://through.tech"], a[href="https://braign.io"]',
    );
    await expect(portfolioLinks).toHaveCount(2);
  });
});
