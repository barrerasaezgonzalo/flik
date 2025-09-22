import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000", // 👈 tu Flik en dev
    headless: true, // cambia a false para ver el browser
  },
});
