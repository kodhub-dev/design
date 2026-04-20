# @kodhub-design/worker

FFmpeg transcode worker. Deployed as a container on Google Cloud Run. Event-triggered by `apps/web` via HTTP POST, authenticated with a shared token.

## Endpoints

- `GET /healthz` — liveness probe
- `POST /jobs/transcode` — accepts `{ jobId, sourceKey, outputKey }`; downloads from R2, transcodes with FFmpeg, uploads back, posts completion to `apps/web`

All `/jobs/*` routes require `x-internal-token` matching `INTERNAL_TOKEN`.

## Local dev

```sh
cp .env.example .env
pnpm dev
```

## Container

Built from the repo root so pnpm can resolve the workspace:

```sh
docker build -f apps/worker/Dockerfile -t kodhub-design-worker:local .
```
