# MVP Scope

**Status:** Draft v1
**Date:** 2026-04-18
**Target ship:** ~4 months from kickoff
**Anchored to:** Decisions 001 (Localization), 002 (Workflow), 003 (Pricing)

## 1. Goal

Ship the smallest product that lets a Middle East creative agency run **one real client project end-to-end** — from brief to approved deliverable — and pay us for it.

We are not building Frame.io. We are validating three bets:

1. Task-centric workflow with structured briefs is more useful than asset-centric review.
2. Free unlimited reviewers + flat pricing converts agencies that bounce off Frame.io's per-seat model.
3. A bilingual reviewer portal with proper Arabic/RTL handling is a real wedge in the region.

## 2. Success criteria

By end of MVP we want:

- **5 paying design-partner agencies** running active client projects in the tool.
- **≥1 fully approved deliverable per agency** (the golden path completed at least once, by real users, not us).
- **≥10 external reviewers/clients** invited across those agencies (validates the "free reviewer" thesis).
- **Gross margin ≥ 60%** on the Studio tier at design-partner usage levels (validates pricing math).

If we hit 3/4 of these, we proceed to v1.1. If we don't, we re-evaluate before scaling sales.

## 3. Personas in scope

| Persona | In MVP? | Notes |
|---|---|---|
| Editor (agency creative) | Yes | Pays. Uploads, manages tasks, requests reviews. English UI. |
| Reviewer (client / brand) | Yes | Free. Comments, approves. Bilingual portal. |
| Workspace admin | Yes | Same person as editor at MVP scale; no separate admin UI yet. |
| Enterprise IT / SSO admin | **No** | Defer with SSO to post-MVP. |
| Freelancer with seat across multiple workspaces | Partial | Can be invited as editor in multiple workspaces; no unified identity yet. |

## 4. The Golden Path (must work end-to-end)

This is the single flow the MVP exists to support. Every feature decision is judged against it.

```
1.  Editor signs up → creates workspace → starts free trial
2.  Editor creates Project → creates Task with structured Brief
3.  Editor uploads Asset (video, image, or PDF) to the Task
4.  Editor invites Reviewer (client) by email — no account required
5.  Reviewer opens link → sees branded portal → toggles AR/EN if desired
6.  Reviewer plays video / views image → leaves time-coded or pinned comments (in Arabic or English)
7.  Editor receives notification → replies to comments → uploads V2
8.  Reviewer compares V2 vs V1 (basic version switcher) → approves
9.  Approval is recorded with timestamp, reviewer identity, version hash
```

## 5. Feature scope — IN

### Identity & workspaces
- Email + password auth, magic link login
- Single workspace per account at signup; can create more
- Workspace-level subscription (Stripe)
- Editor / Reviewer hard role boundary (per Decision 003)

### Projects & tasks
- Project = container with name, description, members
- Task = unit of work with: title, structured Brief (objective, deliverables, brand refs/links, deadline, assignee), status
- Task status: `Draft → In Review → Changes Requested → Approved`
- Flat tasks only — **no subtasks in MVP** (deferred to v1.1; revisit if 3+ design partners ask)

### Assets & versions
- Upload: video (MP4, MOV up to 5GB, **source resolution capped at 1080p in MVP** — 4K rejected with a clear error message; revisit when worker box is upgraded), image (PNG, JPG, WebP), PDF
- Server-side processing for video: FFmpeg normalizes to H.264 MP4 with `+faststart` (moov atom at front for instant playback) + extracts a poster thumbnail + reads metadata via `ffprobe`. No HLS in MVP — direct MP4 playback via signed URL through CDN. Native `<video>` tag, frame-accurate scrubbing comes free.
- Version stack per asset: V1, V2, V3 … with version notes
- Basic version switcher (dropdown). **No side-by-side compare in MVP** (deferred to v1.1 — high-effort, not blocking the golden path)

### Review & comments
- Video player with frame-accurate timecode comments
- Image annotations: pin comments + freehand draw (single color OK)
- PDF: pin comments per page
- Threaded replies, @mentions, emoji reactions
- Full RTL/bidi rendering, Arabic search, Arabic-friendly fonts (IBM Plex Sans Arabic)
- Comment resolution (resolved / unresolved filter)

### Approval flow
- Reviewer can: approve, request changes
- Approval captures: who, when, version hash, optional note
- Immutable audit log per task

### Reviewer portal
- Public share link per task (token-based, optional password, expiry)
- Bilingual UI toggle (EN / AR) with full RTL layout when Arabic
- No signup required to comment or approve (email captured on first action)
- Workspace-branded (logo + accent color) — counts as "custom branding" for paid tiers

### Notifications
- In-app notification center
- Email notifications for: review requested, comment added, @mention, approval, changes requested
- **WhatsApp notifications: NOT in MVP** — first post-MVP feature (v1.1) since it's a regional wedge but needs Meta Cloud API onboarding + template approval (~2 weeks lead time)

### Billing
- Stripe (USD) for Free / Studio / Agency tiers
- 14-day Studio trial on signup
- Storage usage tracking + tier enforcement (soft warning at 80%, hard cap at 100%)
- **Regional payment rails (Tap/Paymob): NOT in MVP** — add in v1.1 once we have buyers asking
- **ZATCA invoicing: NOT in MVP** — add when first KSA enterprise deal is in pipeline

## 6. Feature scope — OUT (with target version)

| Feature | Defer to | Why not MVP |
|---|---|---|
| Subtasks | v1.1 | Single-level tasks cover the golden path; add only if design partners ask |
| Side-by-side compare mode | v1.1 | High-effort, not blocking; basic switcher is enough to validate |
| WhatsApp notifications | v1.1 | Regional wedge but Meta Cloud API + template approval has lead time |
| Regional payment rails (Tap, Paymob, HyperPay) | v1.1 | Stripe USD covers design partners; add when buyers demand it |
| ZATCA-compliant Arabic invoicing | v1.2 / when needed | Add when first KSA enterprise pipeline opens |
| Custom workflow stages per project | v1.2+ | Fixed Brief→Review→Approve covers 90% of agency work |
| Client portals (multi-project branded subdomain) | v1.2 | Single-task share links are enough for design partners |
| SSO / SAML | Enterprise tier (post-MVP) | Not blocking SMB design partners |
| After Effects / Premiere plugins | Indefinite | Validate pull before building |
| Native mobile apps | Indefinite | PWA covers reviewer-on-phone use case |
| AI auto-tagging, auto-summarization | Indefinite | Cost + scope risk; revisit once core is stable |
| Asset management / DAM features | Out of scope | Different product; integrate, don't build |
| Gantt, dependencies, time tracking | Never | Per Decision 002 guardrails |

## 7. Technical scope

- **Frontend + API:** Next.js 15 (App Router) deployed to **Cloudflare Pages** via `@opennextjs/cloudflare`. Runs on Cloudflare Workers (V8 isolates with `nodejs_compat`). React, TanStack Query, Tailwind, shadcn/ui. Logical CSS properties for RTL.
- **Database:** **Cloudflare D1** (SQLite at the edge, native Workers binding, no auto-pause). Free tier covers MVP scale (5 GB storage, 5M reads/day, 100K writes/day). Schema + migrations via **Drizzle ORM** (best D1 support). A `transcode_jobs` table doubles as the worker queue. Permissions enforced in the API layer (D1 has no row-level security — discipline matters).
- **Auth:** **Clerk** (10K MAU free at MVP scale).
- **Payments:** **Stripe** (USD).
- **Storage + CDN:** **Cloudflare R2** ($0 egress, ~$0.015/GB/mo storage). Cloudflare CDN in front. Browser uploads directly to R2 via signed URLs (uploads bypass Workers — no 30s/128MB function limits in play).
- **Video processor:** **Google Cloud Run** (pay-per-execution serverless container). Container image = Bun runtime + FFmpeg binary + worker code. Sized at 2 vCPU / 4 GB per instance, max-instances=5, container concurrency=1 (FFmpeg pegs CPU). **Event-triggered, not polling**: when Next.js inserts a row in D1 `transcode_jobs`, it POSTs `{jobId, sourceKey, outputKey}` to the Cloud Run service URL. The container downloads the source from R2, runs FFmpeg, uploads outputs back to R2, then POSTs `/api/internal/jobs/{id}/complete` to Next.js with the result. Both directions authenticated via shared HMAC token in `X-Internal-Token` header (no public access; `--allow-unauthenticated` on Cloud Run with HMAC enforcement in app code). FFmpeg invoked with `nice -n 19 ionice -c 3 -threads 2 -bufsize 8M -maxrate 8M`. **MVP source resolution capped at 1080p** (4K rejected with clear error in API validation; revisit when worker memory is bumped).
- **Video pipeline:** `ffprobe` (metadata) → `ffmpeg -movflags +faststart` (H.264 MP4 normalize) → poster thumbnail. **No HLS in MVP.** Direct MP4 playback served through Cloudflare CDN; native HTML5 `<video>` element with a thin custom UI for timecode comments.
- **Realtime:** Defer Liveblocks/Yjs. Polling + optimistic updates is enough for MVP comment threads. If realtime becomes necessary, use Cloudflare Durable Objects for per-task channels.
- **Email:** **Resend** (3K/mo free).
- **Monitoring:** **Sentry** + **PostHog** (free tiers).
- **Worker deploy:** Dockerfile + `gcloud run deploy` from CI (GitHub Actions). No process management to own; Cloud Run handles cold start, scale-to-zero, and concurrency.

**Estimated MVP infra cost: ~$5–15/mo total** (D1 free + Cloud Run free-tier compute + ~$5–8 GCP egress for uploads from Cloud Run → R2 + R2 ~$1–5 + Cloudflare Pages free + Clerk free + Resend free). Add ~$5/mo for D1 paid tier if write volume crosses 100K/day. Cloud Run free tier (360K vCPU-sec, 180K GB-sec, 2M req/mo) covers ~600 5-min transcodes; well past MVP scale.

**Plan B triggers:**
- **Cloud Run instance bump** (2 vCPU / 4 GB → 4 vCPU / 8 GB) when 4K support is added or transcode times feel slow.
- **Switch to always-on compute** (DO Droplet or GKE) when monthly transcode volume crosses ~2,000/mo and Cloud Run cost surpasses ~$25/mo.
- **720p mobile rendition** added when first mobile-playback complaint lands.
- **HLS** only when (a) we start serving long-form (>15 min) videos, OR (b) monthly R2 egress is meaningful enough that adaptive bitrate would cut it.

## 8. Non-functional requirements

- **Upload reliability:** browser → R2 multipart uploads with retry (using AWS S3 SDK against R2's S3-compatible endpoint). Agencies upload large files on flaky networks.
- **Video playback:** must work on Safari iOS (clients often review on phones). H.264 MP4 + `+faststart` covers this natively.
- **RTL/bidi:** all comment input/display passes a bidi test suite from day one.
- **Performance budget:** task page interactive in < 2s on 4G; video first-frame < 4s.
- **Data retention:** assets retained for full subscription period; 30-day grace on cancel before deletion.
- **Backups:** D1 Time Travel for point-in-time restore (built-in). R2 has versioning enabled on critical buckets. Weekly off-Cloudflare export of D1 to R2 as a safety net.

## 9. What we are explicitly NOT promising in MVP

- Uptime SLA (best-effort; add SLA at Enterprise tier later)
- Data residency (us/eu region only at MVP; UAE region added when Enterprise demands it)
- Compliance certifications (SOC 2, ISO — start the path post-MVP)
- API / webhooks for third parties (add in v1.2 once shape stabilizes)
- White-label
- Audit log for every action (only approval audit log in MVP)

## 10. 4-month build plan (indicative)

| Month | Focus |
|---|---|
| 1 | Auth, workspaces, projects, tasks + brief, asset upload pipeline, basic player + image viewer |
| 2 | Frame-accurate comments, image/PDF annotations, versioning, approval state machine, audit log |
| 3 | Reviewer portal (bilingual, RTL), share links, notifications, Stripe billing + tier enforcement |
| 4 | Polish, performance, Sentry/PostHog, onboard 5 design partners, iterate on golden path |

## 11. Open questions to resolve before kickoff

- Design-partner pipeline — do we have 5 agencies already lined up, or does GTM run in parallel?
- Edge-runtime audit — confirm every npm dependency we plan to use works under Cloudflare Workers' `nodejs_compat`. Build a small spike before committing.
- D1 write-volume audit — sketch writes per active workspace per day (comments, status changes, audit log, transcode-job updates) and confirm we stay under 100K/day on free tier at 5 design partners; otherwise budget D1 paid from day one.
- Direct browser → R2 upload mechanics — settle on AWS S3 multipart vs tus + a tus server (latter requires a separate process the worker box could host).
- Cloud Run sizing — starting at 2 vCPU / 4 GB per instance, max-instances=5, container concurrency=1; bump to 4 vCPU / 8 GB when 4K support is added.
- Cloud Run cold-start UX — measure typical cold start with a real container (FFmpeg + Bun) and decide whether `min-instances=1` (~$5–10/mo always-on baseline) is worth eliminating cold starts for first transcodes after idle.
- GCP egress monitoring — Cloud Run charges $0.12/GB egress to internet (R2 counts as external). Watch the bill; if it grows uncomfortably, consider Cloudflare Workers + Container Workers (when GA) to keep traffic on Cloudflare.
- Internal API auth — confirm HMAC-with-shared-secret is enough for worker → Next.js calls, or upgrade to short-lived signed JWTs.
