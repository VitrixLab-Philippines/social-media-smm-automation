# DESIGN.md — SMM Automation

## Identity

**Product:** SMM Automation — AI-assisted social media management tool with human approval gates.
**Audience:** Social media agencies, in-house marketing teams, and marketers who run content operations at volume.
**Value:** Takes the chaos out of content at scale: AI plans and drafts, humans approve, the system publishes.

## Personality

Professional and trustworthy. Calm, clear, built for business. Not a startup trying to look cool; a tool that serious teams rely on. Authority comes from clarity and structure, not from visual loudness.

## Palette

**Primary accent:** Emerald green — grounded, not neon. `#059669` (Tailwind emerald-600) as the primary.
**Reason:** Distinct from blue-dominant SaaS tools; green signals "go" and approval, which matches the product's core metaphor (human approval gates). Saturated enough to own the page but not harsh.

- `--primary: #059669` (emerald-600, replacing the neon #10b981)
- `--primary-hover: #047857` (emerald-700, for hover states)
- `--primary-light: rgba(5, 150, 105, 0.12)` (tint for backgrounds, replacing rgba(16,185,129,0.15))

**Dark theme (default):**
- `--bg: #0a0f0d` (near-black with a faint green cast, not pure midnight blue)
- `--panel: #111a14` (panel surfaces, green-tinted dark)
- `--surface: #0d1510` (raised surfaces)
- `--text: #f0f4f1` (warm-neutral white)
- `--muted: #6b7f73` (muted text, green-leaning grey)
- `--line: #1a2b1f` (border lines)
- `--secondary: #2563eb` (blue accent, used sparingly for links/badges only)
- `--accent: #f59e0b` (amber, one deliberate accent for the roadmap phase-badge states only)

**Light theme (toggle):**
- `--bg: #f8faf9`
- `--panel: #ffffff`
- `--surface: #f0f4f2`
- `--text: #0d1a14`
- `--muted: #4a5e52`
- `--line: #d1e0d6`
- Background has a very subtle warm-green tint, not clinical white.

**Palette cap:** 2 core colours (emerald + near-black/white) + 1 accent (amber for status badges only). Blue is a functional colour for secondary actions only, not decorative. *(R-29)*

## Typography

**Heading font:** Plus Jakarta Sans — geometric, warm, modern. Chosen because it reads as professional but not corporate; the rounded geometry suits the product's approachability without abandoning seriousness.
**Body font:** Plus Jakarta Sans (same family, weight variation). Consistent and clean.
**Source:** Google Fonts CDN.

**Why not Inter:** Inter is the AI default (R-06). Plus Jakarta Sans is a deliberate choice for its warmth; it distinguishes this product from generic SaaS without relying on a display quirk.

**Scale:**
- `h1`: `clamp(2.75rem, 6vw, 5rem)` — reduced from the current 10rem max (which was oversized)
- `h2`: `clamp(1.75rem, 3.5vw, 2.75rem)`
- Body: `1rem / 1.65`
- Eyebrow labels: `.75rem`, `letter-spacing: .12em`, `text-transform: uppercase` — tightly tracked, not extreme

## Theme Toggle

A functional dark/light toggle must be shipped. Both modes must pass full contrast checks. *(R-21, R-34)*

## Dials

- **ENERGY: 2** — Confident and purposeful. Sections lead with clear hierarchy. Not shouting, not whispering.
- **RHYTHM: 2** — Mostly consistent structure with 1-2 deliberate composition breaks. Workflow section uses a column list (not a grid). Roadmap section has a different visual treatment from the card grid sections.
- **MOTION: 1** — Hover states and theme-toggle transitions only. No scroll-reveal, no floating elements, no endless pulses.

## Identity Motif

The **approval gate** metaphor: the product's defining feature is the human in the loop. This motif appears visually as a subtle vertical "gate" or checkpoint marker in the workflow section — each step number is rendered in a way that implies a sequence with a gate at step 04. Not decorative; it maps to the product's real function.

## What This Is Not

- Not a Vercel / Linear clone (those are dark + minimal + blue).
- Not neon gamer aesthetics.
- Not a startup "move fast" brand.
- The page is a serious operations tool. Visuals should look like something a marketing director would trust.
