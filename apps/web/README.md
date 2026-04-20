# @kodhub-design/web

Next.js 15 (App Router) deployed to Cloudflare via `@opennextjs/cloudflare`.

## Local dev

```sh
cp .env.example .env.local
pnpm dev
```

## Cloudflare preview / deploy

```sh
pnpm preview      # build + run locally via wrangler
pnpm deploy       # build + deploy to Cloudflare
pnpm cf-typegen   # regenerate cloudflare-env.d.ts from wrangler.jsonc bindings
```

## Bindings

Wired in `wrangler.jsonc`:

- `DB` — Cloudflare D1 (schema in `packages/db`)
- `ASSETS_BUCKET` — R2 bucket for uploaded assets

Replace `REPLACE_WITH_D1_DATABASE_ID` and `REPLACE_WITH_CLOUD_RUN_URL` before first deploy. Secrets (`INTERNAL_TOKEN`, `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`) go through `wrangler secret put`.
