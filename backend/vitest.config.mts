import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Lingkungan Node.js (bukan browser)
    environment: "node",

    // Aktifkan global API (describe, it, expect, vi) tanpa perlu import
    globals: true,

    // File setup yang dijalankan sebelum setiap test suite
    setupFiles: ["src/test/setup.ts"],

    // Pattern file test yang dicari Vitest
    include: ["src/**/*.test.ts"],

    // Coverage menggunakan V8 (built-in Node, tidak perlu babel)
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/test/**",
        "src/server.ts",
        "src/**/*.test.ts",
      ],
    },
  },
});
