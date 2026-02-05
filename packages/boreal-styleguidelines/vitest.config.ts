import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    reporters: ["junit", "json", "verbose", "html"],
    outputFile: {
      junit: "__test__/junit-report.xml",
      json: "__test__/json-report.json",
      html: "__test__/html/html-report.html",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: ["**/__test__/**", "**/*.spec.ts", "node_modules"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
