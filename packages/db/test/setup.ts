import { env } from "cloudflare:workers";
import { applyD1Migrations } from "cloudflare:test";
import { beforeAll, beforeEach } from "vitest";

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

// vitest-pool-workers isolates storage per file, not per test, so wipe rows
// between tests. Order respects FK: workspaces before users.
beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM workspaces"),
    env.DB.prepare("DELETE FROM users"),
  ]);
});
