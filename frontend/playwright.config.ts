import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e",
  fullyParallel: true,
  retries: 0,
  workers: 4,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
