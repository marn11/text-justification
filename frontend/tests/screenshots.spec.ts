import path from "path";

import { expect, test } from "@playwright/test";

const screenshotsDir = path.resolve(process.cwd(), "docs", "screenshots");

test("capture homepage screenshot", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /justifier/i })).toBeVisible();
  await page.screenshot({
    path: path.join(screenshotsDir, "home.png"),
    fullPage: true,
  });
});

test("capture token page screenshot", async ({ page }) => {
  await page.route("**/api/token", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        token: "550e8400-e29b-41d4-a716-446655440000",
      }),
    });
  });

  await page.goto("/token");
  await page.getByLabel("Email address").fill("marin@example.com");
  await page.getByRole("button", { name: /generate token/i }).click();
  await expect(
    page.getByText("550e8400-e29b-41d4-a716-446655440000"),
  ).toBeVisible();

  await page.screenshot({
    path: path.join(screenshotsDir, "token.png"),
    fullPage: true,
  });
});

test("capture workspace screenshot", async ({ page }) => {
  await page.route("**/api/justify", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/plain",
      body: `Typography in a product is most convincing when the tool disappears and the
output feels effortlessly readable.

This small workspace sends plain text to the backend and renders the justified
response without inventing extra formatting.`,
    });
  });

  await page.goto("/workspace");
  await page.evaluate(() =>
    window.localStorage.setItem(
      "justifier-token",
      "550e8400-e29b-41d4-a716-446655440000",
    ),
  );
  await page.reload();
  await page.getByRole("button", { name: /justify text/i }).click();
  await expect(page.locator(".editor-output pre")).toContainText(
    /output feels effortlessly readable/i,
  );

  await page.screenshot({
    path: path.join(screenshotsDir, "workspace.png"),
    fullPage: true,
  });
});
