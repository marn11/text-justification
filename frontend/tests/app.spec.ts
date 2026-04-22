import { expect, test } from "@playwright/test";

test.describe("justifier frontend", () => {
  test("shows the product overview", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /justifier turns a backend technical test into a clean, usable writing tool/i,
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /open workspace/i })).toBeVisible();
    await expect(page.getByText("Quiet interface")).toBeVisible();
  });

  test("requests a token and persists the result", async ({ page }) => {
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
    await expect
      .poll(async () =>
        page.evaluate(() => window.localStorage.getItem("justifier-token")),
      )
      .toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  test("submits text and renders justified output", async ({ page }) => {
    await page.route("**/api/justify", async (route) => {
      const body = route.request().postData() ?? "";

      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: `${body}\n\nFormatted to 80 columns.`,
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

    await page
      .getByLabel("Input text")
      .fill("A short paragraph that we can use to validate the workspace flow.");
    await page.getByRole("button", { name: /justify text/i }).click();

    await expect(page.getByText(/formatted to 80 columns\./i)).toBeVisible();
    await expect(page.getByText("Returned lines")).toBeVisible();
  });
});
