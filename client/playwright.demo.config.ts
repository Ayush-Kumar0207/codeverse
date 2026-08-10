import { defineConfig, devices } from "@playwright/test";

const clientUrl = "http://127.0.0.1:3100";
const serverUrl = "http://127.0.0.1:5100";

export default defineConfig({
  testDir: "./tests/demo",
  outputDir: "../docs/demo/raw",
  timeout: 180_000,
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: clientUrl,
    colorScheme: "dark",
    locale: "en-US",
    trace: "off",
    screenshot: "off",
    video: {
      mode: "on",
      size: { width: 1440, height: 900 },
    },
    viewport: { width: 1440, height: 900 },
  },
  projects: [{ name: "launch-demo", use: { browserName: "chromium" } }],
  webServer: [
    {
      command: "npm start",
      cwd: "../server",
      url: `${serverUrl}/api/health`,
      reuseExistingServer: true,
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
      reuseExistingServer: true,
      timeout: 180_000,
      env: { NEXT_PUBLIC_API_BASE_URL: serverUrl },
    },
  ],
});
