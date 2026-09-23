# Component specs

Exact structure + styling for each component. Values reference the tokens in
`tokens.css`. Markup is framework-agnostic (plain class names) — map to JSX/
Vue/Svelte or Tailwind utilities as needed, but keep the values identical.

Every component sits inside the shared **card shell** unless noted.

## Card shell

```html
<section class="card">
  <header class="card-head">
    <div>
      <p class="card-eyebrow">Revenue</p>
      <h3 class="card-title">Monthly recurring revenue</h3>
    </div>
    <button class="icon-btn" aria-label="More options">⋯</button>
  </header>
  <div class="card-body"><!-- component content --></div>
</section>
```

- `.card`: `background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: var(--space-6); box-shadow: var(--shadow-card);`
- `.card-head`: flex, `justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-5);`
- `.card-eyebrow`: `font-size: var(--text-sm); color: var(--text-secondary); font-weight: 500;` — sentence case, **not** all-caps.
- `.card-title`: `font-size: var(--text-base); color: var(--text-primary); font-weight: 600;`
- `.icon-btn`: 28px square, `border-radius: var(--radius-sm); color: var(--text-tertiary);`, hover → `background: var(--bg-surface-raised); color: var(--text-primary);` over `var(--dur-fast)`.

## Metric (KPI) card

Structure: eyebrow label → big value → delta pill → optional sparkline.

```html
<div class="metric">
  <p class="metric-label">Active users</p>
  <p class="metric-value">24,801</p>
  <span class="metric-delta metric-delta--up">↑ 12.4%</span>
  <svg class="metric-spark" viewBox="0 0 100 28"><polyline points="…"/></svg>
</div>
```

- `.metric-value`: `font-size: var(--text-3xl); font-weight: 800; letter-spacing: var(--tracking-tight); font-variant-numeric: tabular-nums; line-height: var(--lh-tight); color: var(--text-primary);`
- `.metric-delta`: pill, `font-size: var(--text-xs); font-weight: 600; padding: 2px var(--space-2); border-radius: var(--radius-full);`
  - `--up`: `color: var(--positive); background: var(--positive-soft);`
  - `--down`: `color: var(--negative); background: var(--negative-soft);`
  - Always pair the color with an ↑/↓ glyph — never rely on color alone.
- `.metric-spark`: 100×28 viewBox, `stroke: var(--accent); stroke-width: 2; fill: none;`, no axis, no dots — it's texture, not a readable chart.

## Bar chart card

- Bars sit in a flex row, `align-items: flex-end; gap: var(--space-2); height: 160px;`
- Each bar: `flex: 1; border-radius: var(--radius-sm) var(--radius-sm) 0 0; background: var(--accent-soft);`
- The **single highlighted bar** (current period / hovered) uses solid `background: var(--accent);` — this is the one place accent appears as a fill, and only one bar at a time.
- Baseline: `border-top: 1px solid var(--border-subtle);`
- X-axis labels below bars: `font-size: var(--text-xs); color: var(--text-tertiary);`

## Line / area chart card

SVG, viewBox `0 0 400 160` (scale to container).

- Gridlines: 3–4 horizontal `<line>`s, `stroke: var(--border-subtle); stroke-dasharray: 3 4;`
- Line: `<path>` stroke `var(--accent)`, `stroke-width: 2.5; fill: none; stroke-linecap: round; stroke-linejoin: round;`
- Area fill under the line: `<linearGradient>` from `var(--accent)` at 22% opacity (top) to 0% (bottom), applied to a closed path back to the baseline.
- Last/current point: `<circle r="4" fill="var(--accent)" stroke="var(--bg-surface)" stroke-width="2"/>`
- No legend box unless there are 2+ series; if there are, use a small inline dot + label row above the chart, not a bordered legend card.

## Radial gauge

SVG, two concentric `<circle>` arcs using `stroke-dasharray`/`stroke-dashoffset`.

- Track circle: `stroke: var(--border-subtle); stroke-width: 10;`
- Progress circle: `stroke: var(--accent); stroke-width: 10; stroke-linecap: round;`, rotated -90° so it starts at 12 o'clock.
- Center content (absolutely/flex centered over the SVG): big tabular-nums value at `--text-2xl`/800 weight, small label below at `--text-sm`/`--text-secondary`.
- Linear progress variant (for inline use, not its own card): track `height: 6px; border-radius: var(--radius-full); background: var(--bg-surface-raised);`, fill same height/radius, `background: var(--accent);`, width = percentage.

## Category / device breakdown list

```html
<ul class="breakdown">
  <li class="breakdown-row">
    <span class="breakdown-icon">🖥️</span>
    <span class="breakdown-label">Desktop</span>
    <span class="breakdown-track"><span class="breakdown-fill" style="width:64%"></span></span>
    <span class="breakdown-value">64%</span>
  </li>
</ul>
```

- `.breakdown-row`: grid, `grid-template-columns: 28px 88px 1fr 44px; align-items: center; gap: var(--space-3); padding: var(--space-2) 0;`
- `.breakdown-icon`: 28px square, `border-radius: var(--radius-sm); background: var(--bg-surface-raised); display: grid; place-items: center;`
- `.breakdown-track` / `.breakdown-fill`: same spec as the linear progress variant above.
- `.breakdown-value`: tabular-nums, `color: var(--text-secondary); text-align: right;`

## Pagination control

```html
<nav class="pagination">
  <button class="page-btn" aria-label="Previous">‹</button>
  <button class="page-btn is-active">1</button>
  <button class="page-btn">2</button>
  <button class="page-btn">3</button>
  <button class="page-btn" aria-label="Next">›</button>
</nav>
```

- `.page-btn`: 32×32px, `border-radius: var(--radius-md); color: var(--text-secondary); font-size: var(--text-sm); font-weight: 600;`
- Hover: `background: var(--bg-surface-raised); color: var(--text-primary);`
- `.is-active`: `background: var(--accent); color: var(--accent-on);`
- Prev/Next glyphs use the same size but `color: var(--text-tertiary)`, disabled state at 40% opacity + `pointer-events: none`.

## Layout grid

- 12-column grid, `gap: var(--space-6)`.
- Page container: `max-width: 1280px; margin-inline: auto; padding: var(--space-10);`
- Common spans: metric cards = 3 or 4 cols each; chart cards = 6 or 8 cols; breakdown/side cards = 4 cols.
- Collapse to a single column under 640px; drop the page gutter to `--space-5` at that breakpoint.
