FROM node:25.6.1-bookworm-slim AS base
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

FROM base AS build
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/worker/package.json apps/worker/package.json
RUN pnpm install --frozen-lockfile --filter @kodhub-design/worker...
COPY apps/worker apps/worker
COPY tsconfig.base.json tsconfig.base.json
RUN pnpm --filter @kodhub-design/worker build \
    && pnpm deploy --filter @kodhub-design/worker --prod /app

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules node_modules
COPY --from=build /repo/apps/worker/dist dist
COPY --from=build /repo/apps/worker/package.json package.json
EXPOSE 8080
CMD ["node", "dist/index.js"]
