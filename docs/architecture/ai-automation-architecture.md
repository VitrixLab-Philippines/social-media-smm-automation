# AI Automation Architecture for SMM

This document defines the AI automation architecture for the social media management (SMM) platform. The design keeps AI as an assistive layer, while human approval and platform-specific safety rules remain in control of publishing.

## Goals

- Turn raw signals into high-probability, brand-safe content ideas
- Generate drafts for multiple platforms from a single content plan
- Support Meta, LinkedIn, X, TikTok, and YouTube through platform adapters
- Enforce moderation and approval before publishing
- Keep credentials and secrets outside the repository
- Support dry-run testing, scheduled automation, and analytics-driven optimization

## High-level architecture

```text
Brand strategy + goals
        |
        v
Signal ingestion (trends, search, audience behavior, CRM, web, internal briefs)
        |
        v
AI topic scoring and content planning
        |
        v
Content generation (captions, hooks, hashtags, creative concepts)
        |
        v
Moderation + brand policy validation
        |
        v
Human approval / review gate
        |
        v
Platform adapters -> scheduler -> publisher
        |
        v
Delivery events + audit logging
        |
        v
Analytics collection
        |
        +-------------------> Feedback loop for future planning
```

## Core design principles

### 1. AI is advisory, not autonomous

AI is used to generate candidate content ideas, draft copy, and recommend posting strategies. It does not directly publish content unless the workflow explicitly permits it and an approval gate confirms it.

### 2. Platform logic is isolated

Campaign planning and content approval do not depend on a specific social platform SDK. Platform adapters handle authentication, posting/scheduling, analytics retrieval, payload formatting, and error/retry behavior.

### 3. Safety is enforced in the domain layer

Every content draft is checked against prohibited topics, disclosures/compliance, invalid copy, brand voice, and platform restrictions.

### 4. Local-first development with cloud scheduling

Develop and test locally; use GitHub Actions or a scheduler for automated runs. Secrets remain outside source control.

### 5. Dry-run is the default

All publishing flows support dry-run before live publishing.

## Components

### Brand and policy layer

Responsible for brand voice, audience, prohibited topics, required disclosures, and content risk rules.

### Signal and research layer

Collects campaign briefs, product notes/promotions, market/search trends, audience engagement patterns, and competitor activity to produce ranked topics.

### Content planning layer

Determines topics, target platforms, content type, publish window, conversation angle, and CTA strategy.

### AI generation layer

Generates post text, hooks, CTAs, hashtags, creative concepts, and A/B variations through a provider interface supporting OpenAI-compatible APIs, Azure OpenAI, Anthropic, custom models, and a local stub/mock provider.

### Moderation and approval layer

Validates quality, policy, disclaimers, claims, and platform restrictions. Failed content remains draft/rejected.

### Publishing and scheduling layer

Schedules/publishes approved content with platform constraints, permissions, posting limits, rate controls, retries, failures, and audit events.

### Platform adapters

Stable contracts for Meta (Instagram/Facebook Pages), LinkedIn, X, TikTok, and YouTube.

### Analytics and feedback layer

Collects reach, impressions, engagement, clicks, saves, shares, watch time, follower growth, and conversion events to inform future planning.

## Workflow lifecycle

1. Intake
2. Signal enrichment
3. Planning
4. Draft generation
5. Policy check
6. Human review
7. Schedule or publish
8. Measure and optimize

## Domain model

```text
BrandProfile
  - name
  - audience
  - voice
  - prohibited_topics
  - required_disclosures

ContentDraft
  - id
  - topic
  - platform
  - text
  - hashtags
  - status
  - metadata
  - created_at

PublishResult
  - platform
  - success
  - external_id
  - message
  - dry_run

AnalyticsSnapshot
  - platform
  - impressions
  - engagements
  - clicks
  - followers_gained
```

## Safety and compliance

- Credentials must use environment variables or GitHub Secrets
- Never commit API tokens or OAuth secrets
- Dry-run is the default
- Publishing is blocked when moderation fails
- Every scheduled/published item is auditable
- Required disclosures are enforced where applicable
- Unsubstantiated product claims require human review
- Empty captions are rejected

## Technology boundaries

Keep AI orchestration, content planning, moderation, scheduling, platform integrations, analytics, and infrastructure/secrets management separate.

## Suggested implementation layers

```text
src/smm/
├── ai/
│   ├── prompts.py
│   └── provider.py
├── analytics/
│   └── feedback.py
├── cli.py
├── config.py
├── content/
│   └── planner.py
├── domain/
│   └── models.py
├── integrations/
│   └── adapters.py
├── moderation/
│   └── policy.py
├── publishing/
│   ├── ports.py
│   └── service.py
├── research/
│   └── signals.py
├── workflows/
│   └── daily.py
└── __init__.py
```

## Implementation phases

### Phase 1: Foundation

- Project structure
- Configuration and secrets
- Dry-run publishing flow
- Approval gate
- Tests and CI

### Phase 2: Meta-first launch

- Instagram/Facebook Pages integration
- Content planning
- AI-generated captions
- Image caption variations
- Approval workflow

### Phase 3: Multi-platform expansion

- LinkedIn
- X
- TikTok
- YouTube
- Cross-platform scheduling

### Phase 4: Intelligence loop

- Analytics ingestion
- Performance scoring
- Best-post recommendation engine
- Topic prioritization from historical results

## Operational notes

- Use GitHub Actions for scheduled planning and dry runs
- Use a queue/job runner for live publishing jobs
- Log timestamps, platform, account, status, and draft ID
- Keep last-approved and last-published states
- Retry safely; never silently republish without new approval

## Summary

This architecture creates a safe, scalable, extensible SMM automation system. AI reduces content-production workload while approval, moderation, and platform layers maintain control, compliance, and reliability.
