/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.tsx",

    // 👇 Solo incluye tests dentro de src/
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    // 👇 Excluye e2e explícitamente de la ejecución
    exclude: [
      "e2e/**",
      "node_modules/**",
      ".next/**",
      "coverage/**",
      "public/**",
    ],
    coverage: {
      include: [
        "src/lib/**/*.{ts,tsx}",
        "src/components/**/*.{ts,tsx}",
        "src/app/api/**/*.{ts,tsx}",
        // "src/app/**/*.{ts,tsx}",
      ],
      exclude: [
        "node_modules/**",
        ".next/**",
        "coverage/**",
        "public/**",
        "next.config.js",
        "postcss.config.mjs",
        "tailwind.config.ts",
        "vitest.config.ts",
        "e2e/**",
        "src/app/admin/**/*.{ts,tsx}",
        "src/app/global-error.tsx",
      ],
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
