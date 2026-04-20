import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Minimal config — no ISR / revalidateTag yet. Add R2 incremental cache,
// D1 tag cache, and a queue when we start using those Next.js features.
export default defineCloudflareConfig({});
