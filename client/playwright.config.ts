import { defineConfig, devices } from "@playwright/test";

const clientUrl = "http://127.0.0.1:3100";
const serverUrl = "http://127.0.0.1:5100";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120_000,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: clientUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    {
      command: "npm start",
      cwd: "../server",
      url: `${serverUrl}/api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        PORT: "5100",
        DEPLOY_PORT: "5101",
        CLIENT_URL: clientUrl,
        FRONTEND_URL: clientUrl,
        NODE_ENV: "test",
      },
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
      url: clientUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: {
        NEXT_PUBLIC_API_BASE_URL: serverUrl,
      },
    },
  ],
});
