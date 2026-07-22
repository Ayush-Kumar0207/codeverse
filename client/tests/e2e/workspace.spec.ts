import { expect, test } from "@playwright/test";

test("public demo workspace exposes its core editor surfaces", async ({ page }) => {
  await page.goto("/editor/demo-sandbox");
  await expect(page.getByText("ScoreLens", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Run" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Assistant" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Team" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Trace" })).toBeVisible();
});

test("cinematic 3D presentation lazy-loads with accessible navigation", async ({ page }) => {
  await page.goto(
    "/editor/demo-sandbox?mode=demo&algo=roman-number-to-integer&viz=3d&presentation=1&narrate=0"
  );
  await expect(page.getByTestId("universal-cinematic-canvas")).toBeVisible({ timeout: 30_000 });
  await expect(
    page.getByRole("button", { name: "Previous step" }).filter({ visible: true }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to explanation and solutions" }).filter({ visible: true }).first()
  ).toBeVisible();
});

test("two browser sessions synchronize collaboration access in real time", async ({ browser }) => {
  const organizerContext = await browser.newContext();
  const collaboratorContext = await browser.newContext();
  const organizer = await organizerContext.newPage();
  const collaborator = await collaboratorContext.newPage();

  try {
    await organizer.goto("/editor/demo-sandbox");
    await organizer.getByRole("tab", { name: "Team" }).click();
    await expect(organizer.getByTestId("workspace-team-panel")).toContainText("Demo Organizer");

    await collaborator.goto("/editor/demo-sandbox?demoRole=collaborator&demoUser=Reviewer");
    await collaborator.getByRole("tab", { name: "Team" }).click();

    await expect(organizer.getByTestId("workspace-team-panel")).toContainText("Reviewer", { timeout: 15_000 });
    await expect(collaborator.getByTestId("workspace-team-panel")).toContainText("Demo Organizer", { timeout: 15_000 });

    await organizer.getByRole("switch").click();
    await expect(organizer.getByRole("switch")).toHaveText("Owner edit");
    await expect(collaborator.getByTestId("workspace-team-panel")).toContainText("View only", { timeout: 15_000 });

    await organizer.getByRole("switch").click();
    await expect(collaborator.getByTestId("workspace-team-panel")).toContainText("Can edit", { timeout: 15_000 });
  } finally {
    await organizerContext.close();
    await collaboratorContext.close();
  }
});
