# @kodhub-design/db

Drizzle ORM schema and migrations for Cloudflare D1.

## Commands

```sh
pnpm db:generate         # Generate migration SQL from schema changes
pnpm db:migrate:local    # Apply migrations to local D1 (via wrangler)
pnpm db:migrate:remote   # Apply migrations to production D1
pnpm db:studio           # Open Drizzle Studio
```

## Notes

- Schema is the single source of truth. Edit `src/schema.ts`, run `db:generate`, commit both files.
- Migrations are owned by wrangler — the `kodhub-design` binding name must match `apps/web/wrangler.jsonc`.
- D1 has no row-level security. All permission checks live in the API layer.
