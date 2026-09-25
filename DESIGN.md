# DESIGN.md — S M M A I Brand Direction

> Written from user answers + Zyno (horizonx.so/explore/zyno) inspiration.
> This file is the source of truth for all visual decisions on this project.
> antislop agents: read this before any UI change.

> **Pattern library:** `skills/antislop-ui/patterns/INDEX.md` — proven implementations
> of every major visual pattern used in this project (hero card, storytelling pairs,
> highlights strip, border glow, typography system, CTA band, scroll reveal).
> Start there before writing any new section from scratch.

---


## Brand Identity

**Name:** S M M A I (spoken: "SMMAI")
**Wordmark:** `S M M AI` — spaced-letter capitals, 800 weight, "AI" in primary emerald
**Tagline:** Social media AI, built for control.
**Category:** B2B SaaS — AI-powered social media automation platform for agencies and marketers

---

## Personality

Professional and trustworthy. Calm, clear, built for business.
**Zyno energy layer:** High-energy, bold typographic presence — the product is powerful; the brand should read that way without shouting.

Not: playful, cute, casual, startup-bro, hype.
Not: corporate-grey, boring, interchangeable.

---

## Dials (antislop)

| Dial | Value | Reason |
|---|---|---|
| ENERGY | 3 | Zyno: "high-energy, bold, premium landing-page structure" |
| RHYTHM | 2 | Sections vary in layout — not every section is eyebrow + grid |
| MOTION | 1 | Purposeful only (border glow on hover; no ambient animation) |

---

## Palette

| Token | Dark | Light | Role |
|---|---|---|---|
| `--bg` | `#070c09` | `#f8faf9` | Page background — deep green-cast black (Zyno-level depth) |
| `--panel` | `#0e1812` | `#ffffff` | Card surfaces |
| `--surface` | `#0b1310` | `#f0f4f2` | Raised layer |
| `--text` | `#f2f6f3` | `#0d1a14` | Primary text |
| `--muted` | `#637669` | `#4a5e52` | Secondary text |
| `--line` | `#162618` | `#d1e0d6` | Borders |
| `--primary` | `#059669` | `#047857` | Emerald — brand primary, "AI" in wordmark |
| `--accent` | `#f59e0b` | — | Amber — roadmap status badges only |

**Why this palette:** emerald on deep-black creates the contrast punch Zyno achieves. The green cast is our brand differentiator — not blue-midnight (generic SaaS), not purple (AI cliché).

---

## Typography

**Font:** Plus Jakarta Sans — warm geometric, professional. Chosen over Inter (AI default) for its rounder terminals and more human feel. Loaded at weights 400/500/600/700/800.

### Type Scale

| Token | Size | Role |
|---|---|---|
| `--text-hero` | clamp(44px–80px) | Hero h1 — single page statement |
| `--text-3xl` | 44px | Section h2 cap |
| `--text-2xl` | 32px | Section h2 floor |
| `--text-lg` | 20px | Featured card title |
| `--text-md` | 18px | Card titles, step titles, phase labels |
| `--text-base` | 16px | Body copy |
| `--text-sm` | 14px | Descriptions, captions, buttons |
| `--text-xs` | 12px | Eyebrows, badges, nav links, wordmark in footer |

### Letter Spacing

| Token | Value | Role |
|---|---|---|
| `--ls-wordmark` | 0.38em | S M M AI brand wordmark only |
| `--ls-label` | 0.10em | Eyebrows, nav links (uppercase) |
| `--ls-tight` | -0.03em | Hero h1 |
| `--ls-snug` | -0.02em | Section h2 |

---

## Layout

**Max-width:** 1120px centered (`--wrap`)
**Radius:** 4px (small), 8px (medium), 16px (large) — not pill-shaped everywhere
**Sections alternate:** step list / card grid / card grid / phase list — not all grids (RHYTHM 2)

---

## Identity Motif

**The approval gate (step 04):** hollow circle with primary ring glow — the product's core value proposition. Appears in the workflow step list. This is the one element that gets a distinct visual beyond the standard step pip.

**The hero ambient glow:** A single static `radial-gradient` behind the hero headline. Purpose: spatial anchor for the eye at the product's primary statement. One element only — not repeated elsewhere (R-13 dose cap).

**Border Glow on arch cards:** Pointer-tracking `conic-gradient` lamp on architecture card borders (horizonx.so/tools/border-glow). Applied to arch-grid cards only — the primary discovery section. (R-13 dose cap)

---

## Antislop Constraints Active

- **R-01:** No decorative gradients. Hero glow is documented with purpose.
- **R-06:** No AI-default Inter. Plus Jakarta Sans only.
- **R-07:** No blue-midnight. Green-cast dark bg only.
- **R-11:** No everything-pill-shaped. Radius is deliberate.
- **R-13:** Glow dose cap: hero ambient (1) + arch border glow (1) = 2 elements max. No other glows.
- **R-19:** Motion has UX purpose only — border glow signals card interactivity.
- **R-21:** Light/dark toggle is functional, both modes WCAG verified.
- **R-32:** Skip link present for keyboard users.
