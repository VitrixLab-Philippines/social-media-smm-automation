# AGENTS.md

Antislop installation.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->

---
SMM Automation — AI-assisted social media management with human approval gates.

This project uses antislop to prevent AI-generated design slop and ensure
accessible, purposeful UI decisions.

## Quickstart

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
pytest -q
```

Windows PowerShell activation:
```powershell
.venv\Scripts\Activate.ps1
```

## Project structure

- **Python backend**: `src/smm/` — FastAPI app at `src/smm/main.py`
  - CLI: `src/smm/cli.py` — run with `python -m smm.cli "your content topic"`
  - API: `src/smm/main.py` — FastAPI endpoints under `/api/`
  - Domain models: `src/smm/domain/models.py` — `BrandProfile`, `ContentDraft`, `AnalyticsSnapshot`, `PublishResult`
  - Analytics: `src/smm/analytics/feedback.py` — `engagement_rate()` function
  - Moderation: `src/smm/moderation/` — `ModerationService` validates content against brand policies
  - Publishing: `src/smm/publishing/` — `PublishingService` enforces human approval gate
  - WASM modules: `src/smm/wasm/` — compiled for engagement rate and rank signals

- **Next.js dashboard**: `nextjs-setup/nextjs-dashboard/` — React app with Pages Router
  - Entry: `src/app/page.tsx` — home landing page
  - Login: `src/app/login/page.tsx` — demo auth (credentials: `admin@smmai.com` / `admin`)
  - Dashboard: `src/app/dashboard/page.tsx` — CRM and automation command center
  - API routes: `src/app/api/` — `/api/graph`, `/api/crm/drafts`, `/api/auth/login`
  - Components: `src/components/` — layout, sections, CRM, UI

## Developer commands

| Command | Description |
|---|---|
| `pytest -q` | Run all tests (Ruff + pytest via CI) |
| `ruff check .` | Lint Python source |
| `pnpm --dir nextjs-setup/nextjs-dashboard dev` | Start Next.js dev server |
| `pnpm --dir nextjs-setup/nextjs-dashboard build` | Build Next.js for production |
| `pnpm --dir nextjs-setup/nextjs-dashboard start` | Start production server |
| `python -m smm.cli "topic"` | Run CLI to generate a daily draft |
| `python -m pytest tests/` | Run tests explicitly from repo root |

## Test notes

- Tests live in `tests/` and use `TestClient` from `fastapi.testclient`
- Python path set to `src/` (via `pyproject.toml` `[tool.pytest.ini_options]`)
- CI runs: `ruff check . && pytest -q`
- Key test files:
  - `tests/test_health.py` — `GET /api/health` returns `{"status": "ok"}`
  - `tests/test_analytics.py` — `engagement_rate()` with various snapshots
  - `tests/test_approval_gate.py` — moderation + publishing approval gate
  - `tests/test_planner.py`, `tests/test_publishing.py`, `tests/test_meta_adapter.py`, `tests/test_moderation.py`, `tests/test_rank_signals.py`

## Environment

- Copy `.env.example` to `.env` and fill in required keys
- `DRY_RUN=true` is the safe default — never publish for real without explicit approval
- Key env vars: `AI_PROVIDER`, `NVIDIA_API_KEY`, `OPENROUTER_API_KEY`, `GOOGLE_CLIENT_ID/SECRET`
- Demo credentials for login: `admin@smmai.com` / `admin`

## API endpoints (Python FastAPI)

- `GET /api/health` — health check
- `POST /api/compute/engagement_rate` — compute engagement rate from impressions/engagements
- `POST /api/compute/rank_signals` — compute rank signals from topics
- `POST /api/workflow/run` — run workflow with payload

## API endpoints (Next.js)

- `GET /api/graph` — returns graphify graph data (nodes, phases, plan progress)
- `GET /api/crm/drafts` — list drafts, filter by status/platform; PATCH to update status; POST to create
- `POST /api/auth/login` — demo auth (validates `admin@smmai.com` / `admin`)

## Architecture flow

1. CLI generates a daily draft via `python -m smm.cli "topic"`
2. Draft goes through `ModerationService` validation against `BrandProfile`
3. Human approves/rejects via approval gate
4. `PublishingService` publishes to platform (dry-run by default)
5. Analytics tracks engagement via `engagement_rate()`
6. Graph reflects overall SMM pipeline state (`graphify-out/graph.json`)

## Antislop

- Read `antislop.md` for the full rule set (38 mandatory rules, 5 craftsmanship principles)
- This AGENTS.md includes an antislop pointer block at the top
- For UI work, also read the relevant skill: `skills/antislop-ui/SKILL.md`, `skills/antislop-human/SKILL.md`, `skills/antislop-layoutmobile/SKILL.md`, or `skills/antislop-code/SKILL.md`
- Before starting UI work, ask the user: "Do you want to use antislop **during** the project (while working) or **after** (audit mode)?"