import { timingSafeEqual } from 'node:crypto';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { z } from 'zod';

const env = z
  .object({
    PORT: z.coerce.number().default(8080),
    INTERNAL_TOKEN: z.string().min(32),
  })
  .parse(process.env);

const app = new Hono();

app.get('/healthz', (c) => c.text('ok'));

app.use('/jobs/*', async (c, next) => {
  const token = c.req.header('x-internal-token') ?? '';
  const expected = env.INTERNAL_TOKEN;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return c.text('unauthorized', 401);
  }
  await next();
});

const transcodeJob = z.object({
  jobId: z.string(),
  sourceKey: z.string(),
  outputKey: z.string(),
});

app.post('/jobs/transcode', async (c) => {
  const body = transcodeJob.parse(await c.req.json());
  // TODO: download from R2, ffmpeg, upload, callback to /api/internal/jobs/:id/complete
  return c.json({ accepted: true, jobId: body.jobId });
});

serve({ fetch: app.fetch, port: env.PORT }, ({ port }) => {
  console.log(`worker listening on :${port}`);
});
