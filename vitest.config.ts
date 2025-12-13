import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules",
        ".next",
        "tests",
        "**/*.config.*",
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "!/": path.resolve(__dirname, "./"),
      "@/": path.resolve(__dirname, "./src/"),
      "~/": path.resolve(__dirname, "./src/app/"),
      "&/": path.resolve(__dirname, "./src/app/_components/"),
      "#/": path.resolve(__dirname, "./src/app/_components/ui/"),
      "^/": path.resolve(__dirname, "./src/app/_components/logos/"),
      "+/": path.resolve(__dirname, "./src/server/api/"),
    },
  },
});
