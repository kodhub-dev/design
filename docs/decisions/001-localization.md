# Decision 001 — Localization Strategy

**Status:** Accepted
**Date:** 2026-04-18

## Decision

The product is **English-first**, but Arabic-aware where it matters commercially.

| Surface | Language |
|---|---|
| Editor app (creators' workspace) | English only |
| Reviewer / client portal | Bilingual (English + Arabic toggle) |
| Comments, mentions, file names, search | Full Arabic + RTL support, bidi-correct |
| Marketing site | Bilingual |
| Billing, invoices, contracts | Arabic-capable; ZATCA-compliant invoicing for KSA |

## Rationale

- Creatives in the region work in English-native tools (Figma, Adobe, Premiere). Forcing Arabic UI on them feels foreign and adds permanent translation debt to every UI change.
- Reviewers/clients are a different persona — brand managers, gov comms, marketing leads at regional enterprises — many of whom genuinely prefer Arabic. This is where Frame.io feels alien, and it's our wedge.
- Comment content will be typed in Arabic regardless of UI language; rendering must handle bidi correctly from day one.
- KSA ZATCA e-invoicing is a legal requirement, not a preference, for selling into Saudi enterprises.

## Implications

- Build the content/comment layer with proper RTL/bidi handling from the start (retrofitting later is painful).
- Reviewer portal needs i18n infrastructure; editor app does not.
- Choose Arabic-friendly fonts (e.g. IBM Plex Sans Arabic, Noto Sans Arabic) for content rendering even when chrome is English.
- Invoicing system must support Arabic + ZATCA fields when we open KSA sales.
