# Kodhub Design

Task-centric creative work management for Middle East agencies.

See [docs/mvp-scope.md](./docs/mvp-scope.md) and [docs/decisions](./docs/decisions) for product context.

## Structure

```
apps/
  web/       Next.js 15 (App Router) — editor app, reviewer portal, API. Deploys to Cloudflare via @opennextjs/cloudflare.
  worker/    Node + FFmpeg container for Google Cloud Run. Event-triggered transcode service.
packages/
  db/        Drizzle ORM schema + D1 migrations. Shared types between web and worker.
docs/        Product decisions and MVP scope.
```

## Tooling

- **Node**: v25.6.1 (see `.nvmrc`)
- **Package manager**: pnpm workspaces (`pnpm@10.28.0`)
- **Task runner**: Turborepo
- **Lint + format**: Biome
- **Language**: TypeScript (strict), throughout

## Getting started

```sh
nvm use                 # pick up Node from .nvmrc
corepack enable         # if pnpm isn't already installed
pnpm install
pnpm dev                # runs web + worker in parallel via turbo
```

## Common commands

```sh
pnpm dev                              # start everything in dev
pnpm build                            # build everything
pnpm typecheck                        # type-check all workspaces
pnpm lint                             # biome check across the repo
pnpm format                           # biome format --write

pnpm --filter @kodhub-design/web dev
pnpm --filter @kodhub-design/worker dev
pnpm --filter @kodhub-design/db db:generate
```
