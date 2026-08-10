import { expect, test, type Page } from "@playwright/test";

const pause = (page: Page, milliseconds: number) => page.waitForTimeout(milliseconds);

test("record the public CodeVerse product walkthrough", async ({ page }) => {
  test.setTimeout(180_000);
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "no-preference" });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "CodeVerse", exact: true })).toBeVisible();
  await pause(page, 4_000);

  await page.goto("/demo");
  await expect(page.getByRole("heading", { name: "Try the workspace before signing in." })).toBeVisible();
  await pause(page, 4_000);

  await page.getByRole("button", { name: "Run Demo" }).click();
  await expect(page.getByText("Run finished successfully")).toBeVisible();
  await pause(page, 4_000);

  await page.getByRole("button", { name: "Deploy Preview" }).click();
  await expect(page.getByText("ScoreLens preview is interactive")).toBeVisible();
  await page.getByRole("button", { name: "View Preview" }).click();
  await pause(page, 5_000);

  await page.getByLabel("Scores").fill("91, 84, 97, 88, 93");
  await page.getByRole("button", { name: "Recalculate Preview" }).click();
  await expect(page.getByText("Best").locator("..").getByText("97")).toBeVisible();
  await pause(page, 3_000);

  await page.goto("/editor/demo-sandbox?mode=demo");
  await expect(page.getByText("ScoreLens", { exact: true }).first()).toBeVisible();
  await pause(page, 4_000);

  await page.getByRole("tab", { name: "Proof" }).click();
  await expect(page.getByRole("heading", { name: "Proof Center" })).toBeVisible({ timeout: 30_000 });
  await pause(page, 6_000);

  await page.getByRole("button", { name: /Replay changes/ }).click();
  await expect(page.getByRole("heading", { name: "Replay changes" })).toBeVisible();
  await pause(page, 5_000);

  await page.goto(
    "data:text/html," +
      encodeURIComponent(`<!doctype html><html><head><meta charset="utf-8"><style>
        html,body{height:100%;margin:0;background:#06090d;color:#f8fafc;font-family:Inter,Segoe UI,sans-serif}
        body{display:grid;place-items:center}.wrap{max-width:980px;padding:72px;text-align:center}
        .eyebrow{color:#5eead4;font-size:18px;font-weight:700;letter-spacing:.22em;text-transform:uppercase}
        h1{font-size:76px;line-height:1.05;margin:24px 0 28px}p{color:#94a3b8;font-size:28px;line-height:1.5}
        .url{display:inline-block;margin-top:34px;padding:18px 28px;border:1px solid rgba(94,234,212,.35);border-radius:16px;background:rgba(94,234,212,.08);color:#99f6e4;font:600 24px ui-monospace,monospace}
      </style></head><body><div class="wrap"><div class="eyebrow">Open source · MIT licensed</div><h1>Try it. Break it.<br>Help improve it.</h1><p>CodeVerse is feature-frozen while the community focuses on reliability, accessibility, and contributor experience.</p><div class="url">github.com/Ayush-Kumar0207/codeverse</div></div></body></html>`)
  );
  await pause(page, 7_000);
});
