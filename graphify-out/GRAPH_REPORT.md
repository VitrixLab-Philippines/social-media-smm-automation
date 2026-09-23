# Graph Report - smma  (2026-09-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 205 nodes · 301 edges · 25 communities (11 shown, 14 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `77c5a744`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContentDraft
- nextjs-dashboard/package.json
- AnalyticsSnapshot
- BrandProfile
- compilerOptions
- contrast-check.py
- package.json
- contrast-mcp.py
- devDependencies
- layout.tsx
- vercel.json
- config.py
- wasm/signals.py
- lib.rs
- eslint.config.mjs
- postcss.config.mjs
- __init__.py
- smm-wasm
- social-media-smm-automation
- waspy_test

## God Nodes (most connected - your core abstractions)
1. `ContentDraft` - 22 edges
2. `BrandProfile` - 20 edges
3. `compilerOptions` - 16 edges
4. `ContentPlanner` - 12 edges
5. `ModerationService` - 11 edges
6. `PublishingService` - 11 edges
7. `AnalyticsSnapshot` - 11 edges
8. `PublishResult` - 10 edges
9. `MetaAdapter` - 10 edges
10. `Publisher` - 8 edges

## Surprising Connections (you probably didn't know these)
- `test_engagement_rate()` --uses--> `AnalyticsSnapshot`  [INFERRED]
  tests/test_analytics.py → src/smm/domain/models.py
- `test_zero_impressions_is_safe()` --uses--> `AnalyticsSnapshot`  [INFERRED]
  tests/test_analytics.py → src/smm/domain/models.py
- `test_empty_caption_is_rejected()` --uses--> `BrandProfile`  [INFERRED]
  tests/test_moderation.py → src/smm/domain/models.py
- `test_prohibited_topic_is_rejected()` --uses--> `BrandProfile`  [INFERRED]
  tests/test_moderation.py → src/smm/domain/models.py
- `test_live_publish_requires_human_approval()` --uses--> `BrandProfile`  [INFERRED]
  tests/test_publishing.py → src/smm/domain/models.py

## Import Cycles
- None detected.

## Communities (25 total, 14 thin omitted)

### Community 0 - "ContentDraft"
Cohesion: 0.15
Nodes (18): Enum, ContentDraft, DraftStatus, PublishResult, MetaAdapter, Meta publishing boundary. Live API calls are intentionally not implemented yet., ModerationResult, ModerationService (+10 more)

### Community 1 - "nextjs-dashboard/package.json"
Cohesion: 0.08
Nodes (22): dependencies, next, react, react-dom, name, private, scripts, build (+14 more)

### Community 2 - "AnalyticsSnapshot"
Cohesion: 0.15
Nodes (18): get, post, engagement_rate(), summarize(), AnalyticsSnapshot, compute_engagement_rate(), compute_rank_signals(), health() (+10 more)

### Community 3 - "BrandProfile"
Cohesion: 0.20
Nodes (12): AIProvider, GenerationRequest, GenerationResult, Protocol, Deterministic provider for local development and tests., StubAIProvider, main(), ContentPlan (+4 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 5 - "contrast-check.py"
Cohesion: 0.28
Nodes (12): contrast_ratio(), linearize(), luminance(), main(), parse_hex(), parse_pairing(), parse_reference_rows(), WCAG 2.x contrast checker, home of the antislop-human contrast checker. Usage:… (+4 more)

### Community 6 - "package.json"
Cohesion: 0.17
Nodes (11): dependencies, serve, sirv, name, private, scripts, dev, start (+3 more)

### Community 7 - "contrast-mcp.py"
Cohesion: 0.33
Nodes (10): _channel(), check_contrast(), contrast_ratio(), _error(), main(), Minimal MCP stdio server exposing the antislop contrast checker as a tool. All…, relative_luminance(), _reply() (+2 more)

### Community 8 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 9 - "layout.tsx"
Cohesion: 0.25
Nodes (5): nextConfig, geistMono, geistSans, metadata, next

### Community 10 - "vercel.json"
Cohesion: 0.50
Nodes (3): buildCommand, framework, outputDirectory

## Knowledge Gaps
- **65 isolated node(s):** `next`, `react`, `react-dom`, `name`, `private` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 93 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AnalyticsSnapshot` connect `AnalyticsSnapshot` to `ContentDraft`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `ContentDraft` connect `ContentDraft` to `BrandProfile`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `BrandProfile` connect `BrandProfile` to `ContentDraft`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `ContentDraft` (e.g. with `ContentPlanner` and `MetaAdapter`) actually correct?**
  _`ContentDraft` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `BrandProfile` (e.g. with `ContentPlanner` and `ModerationService`) actually correct?**
  _`BrandProfile` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `ContentPlanner` (e.g. with `AIProvider` and `GenerationRequest`) actually correct?**
  _`ContentPlanner` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `ModerationService` (e.g. with `BrandProfile` and `ContentDraft`) actually correct?**
  _`ModerationService` has 7 INFERRED edges - model-reasoned connections that need verification._