---
name: analytics-dashboard-ui
description: Design system and exact component specs for building bold analytics/admin dashboard UI — metric (KPI) cards, bar charts, line/area charts, radial gauges, category or device breakdown lists, and pagination controls, in a dark-first orange-accent aesthetic with a full light-mode variant. Use whenever the task is to build a dashboard, admin panel, analytics/reporting page, KPI cards, or an "orange accent dark dashboard kit" style UI.
license: MIT
---

# Analytics Dashboard UI

An original design system for bold, data-dense dashboard UI: dark surfaces by
default, one orange accent used sparingly, and a full light-mode token swap.
It targets the same genre as premium "analytics dashboard" Figma kits
(metric cards, charts, gauges, breakdown lists, pagination) — built from
scratch as a precise, reusable spec, not traced from any specific paid file.

## When to use this skill

- Building or restyling a dashboard, admin panel, or analytics/reporting screen.
- Adding KPI/metric cards, bar or line charts, gauges, progress bars, a
  device/category breakdown list, or pagination controls.
- The user references "that orange dashboard kit" look, or asks for a
  dark-mode-first analytics UI with light mode support.

## Before building anything

1. Read `references/tokens.css` and install the custom properties verbatim
   into the project (global stylesheet, Tailwind `theme.extend`, or a
   CSS-in-JS theme object). Do not invent new hex values — every color,
   radius, and spacing value a component uses must trace back to a token.
2. Read `references/component-specs.md` for the exact structure and styling
   of whichever component you're building.
3. Open `examples/preview.html` in a browser as the visual ground truth.
   Build to match it, at the token level, not by eyeballing a screenshot.

## Core rules (what makes this "precise" instead of ad hoc)

- **Dark is the default surface**, not a `prefers-color-scheme` afterthought.
  Light mode is a complete token swap (`[data-theme="light"]`), never a CSS
  filter or opacity trick over the dark palette.
- **Orange (`--accent`) is used sparingly**: one primary CTA, active states,
  the current/highlighted data point, the primary chart series. It is never
  a large background fill or used on more than one element in the same
  view for emphasis.
- **One radius per nesting depth** — `--radius-lg` for cards, `--radius-md`
  for buttons/inputs/inner blocks, `--radius-sm` for chips — and never mix
  radii within the same depth.
- **Numbers are tabular-nums**, weight 700–800, slightly tight tracking.
  Labels are sentence case at a muted secondary color — avoid tracked-out
  ALL-CAPS labels, which read as generic template chrome rather than this
  system's voice.
- **Deltas pair color with a glyph** (↑/↓), never color alone.
- **Shadows are structural**, not decorative — one soft elevation token per
  surface level, no gradient washes for decoration.
- Card padding is always `--space-6`; page gutter is `--space-10` (down to
  `--space-5` on mobile).

## Components covered

See `references/component-specs.md` for full markup + styling on each:

- Card shell (shared header pattern all other components sit inside)
- Metric / KPI card, with optional inline sparkline
- Bar chart card
- Line / area chart card
- Radial gauge + linear progress variant
- Category / device breakdown list
- Pagination control

## Workflow

1. If the target stack isn't obvious from the project, ask (plain CSS,
   Tailwind, React/Vue/Svelte component, etc.) rather than guessing.
2. Install the tokens first, once, at the theme root.
3. Build one component at a time straight from `component-specs.md`,
   checking each against `examples/preview.html`.
4. Compose the page on a 12-column grid, `--space-6` gap: metric cards span
   3–4 columns, chart cards 6–8, breakdown/side cards 4.
5. Verify: dark and light both look intentional (not just inverted), text
   passes contrast on both, layout collapses to one column under 640px.
