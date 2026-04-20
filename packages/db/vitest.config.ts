import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  cloudflareTest,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    cloudflareTest(async () => {
      const migrations = await readD1Migrations(path.join(dirname, "drizzle"));
      return {
        miniflare: {
          compatibilityDate: "2026-04-20",
          compatibilityFlags: ["nodejs_compat"],
          d1Databases: ["DB"],
          bindings: { TEST_MIGRATIONS: migrations },
        },
      };
    }),
  ],
  test: {
    setupFiles: ["./test/setup.ts"],
  },
});
