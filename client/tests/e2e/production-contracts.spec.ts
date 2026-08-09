import { expect, test } from "@playwright/test";

test("public status presents API, database, and collaboration health without authentication", async ({ page }) => {
  await page.goto("/status");
  await expect(page.getByRole("heading", { name: /Operating with reduced redundancy|All systems operational/i })).toBeVisible();
  await expect(page.getByText("API Core", { exact: true })).toBeVisible();
  await expect(page.getByText("Durable Storage", { exact: true })).toBeVisible();
  await expect(page.getByText("Collaboration Mesh", { exact: true })).toBeVisible();
  await expect(page.getByText(/SLO: .* availability/i)).toBeVisible();
});

test("OAuth provider start uses a redirect and invalid callbacks return safely to login", async ({ page, request }) => {
  const start = await request.get("/api/auth/github", { maxRedirects: 0 });
  expect([302, 307]).toContain(start.status());
  const location = start.headers().location || "";
  expect(
    location.startsWith("https://github.com/login/oauth/authorize") || location.includes("/login?oauth_error=")
  ).toBe(true);

  await page.goto("/api/auth/not-a-provider/callback?code=untrusted&state=untrusted");
  await expect(page).toHaveURL(/\/login\?oauth_error=Unsupported/);
});

test("hosted deployment API rejects anonymous writes", async ({ request }) => {
  const response = await request.post("http://127.0.0.1:5100/api/deploy", {
    data: { projectId: "unauthorized", files: { "index.html": "<h1>blocked</h1>" } },
  });
  expect(response.status()).toBe(401);
});
