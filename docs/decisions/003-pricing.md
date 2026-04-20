# Decision 003 — Pricing Model

**Status:** Accepted
**Date:** 2026-04-18

## Decision

**Flat per-workspace pricing.** Reviewers and clients are always free and unlimited. Editor seats are bundled into tiers, not charged per-seat.

| Tier | Price (indicative) | Editor seats | Storage | Notes |
|---|---|---|---|---|
| Free | $0 | 1 | 2 GB | Watermarked, 1 workspace |
| Studio | $39 / mo | 10 | 250 GB | Custom branding |
| Agency | $129 / mo | 30 | 1 TB | Client portals, WhatsApp notifications |
| Enterprise | Custom | Custom | Custom | SSO, data residency, ZATCA invoicing |

Roughly **~70% cheaper than Frame.io** at equivalent headcount.

Billed in USD globally; AED/SAR/EGP via local payment rails (Tap, HyperPay, Paymob) for regional buyers.

## Rationale

- Frame.io's per-seat model ($15–$25/seat/mo) penalizes agencies with rotating freelancers and external collaborators — exactly the workflow we want to enable.
- Free unlimited reviewers removes the single biggest objection to inviting clients in. More clients in = more stickiness.
- Flat tiers are predictable for agency CFOs and easier to sell than usage-based pricing.
- Pricing is a **wedge**, not a permanent moat — but it gets us in the door for design partners and the first 100 paying agencies.

## Guardrails

- **Don't race to the bottom.** Pricing should land us at "obviously cheaper" not "suspiciously cheap." $39/$129 reads as a real product, not a side project.
- **Storage is the cost lever.** Use Cloudflare R2 (no egress fees) and aggressive transcoding/cleanup of unused proxies to keep gross margin healthy. Egress is what kills video startups.
- **Don't offer unlimited storage.** Cap clearly per tier; sell overages or upsell to next tier.
- **Avoid per-seat creep.** If we ever need to charge per-seat (enterprise), do it only above the bundled count, never as the base model.

## Implications

- Billing system needs: workspace-level subscriptions, regional payment rails, USD + multi-currency display, ZATCA-compliant invoicing for KSA enterprise.
- Editor vs reviewer is a hard role boundary in the permission system from day one — pricing depends on it.
- Track gross margin per workspace (storage + egress + transcoding cost) as a first-class metric, not an afterthought.
