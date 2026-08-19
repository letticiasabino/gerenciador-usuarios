import { defineConfig } from "vitest/config";

process.env.DATABASE_URL =
  process.env.DATABASE_URL || "file:./test.db";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    globalSetup: ["./vitest.global-setup.ts"],
    // Evita corrida entre arquivos de teste que compartilham o mesmo test.db
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
