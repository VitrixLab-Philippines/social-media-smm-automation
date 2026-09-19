# Social Media SMM Automation

AI-assisted social media management platform with a human approval gate.

## MVP

The first implementation is intentionally **Meta-first**:

1. Research/signals
2. AI content planning and draft generation
3. Deterministic moderation and brand-policy validation
4. Human approval
5. Meta adapter with dry-run by default
6. Analytics feedback
7. Tests and GitHub Actions CI

The planner does not depend on a specific social network. Platform-specific behavior belongs behind adapters.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
pytest -q
python -m smm.cli "your content topic"
```

Windows PowerShell activation:

```powershell
.venv\Scripts\Activate.ps1
```

## Security

Never commit OAuth tokens, API keys, refresh tokens, or `.env` files. Use environment variables locally and GitHub Actions Secrets for CI/production workflows.

Live publishing is not enabled by default. `DRY_RUN=true` is the safe default.

## Architecture

- `docs/architecture/ai-automation-architecture.md`
- `docs/architecture/mvp-implementation.md`

## Roadmap

- Phase 1: Meta / Instagram + Facebook Page
- Phase 2: LinkedIn + X
- Phase 3: TikTok + YouTube
- Phase 4: analytics-driven recommendation loop

## Development

CI runs Ruff and pytest. The daily workflow performs a scheduled dry-run planning job and can also be started manually.
