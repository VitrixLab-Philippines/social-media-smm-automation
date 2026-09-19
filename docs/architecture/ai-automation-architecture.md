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

The system is designed so campaign planning and content approval do not depend on a specific social platform SDK. Platform adapters handle:

- authentication
- posting and scheduling
- analytics retrieval
- payload formatting
- error handling and retry behavior

### 3. Safety is enforced in the domain layer

Every content draft is checked against:

- banned or prohibited topics
- required disclosures and legal compliance
- empty or invalid copy
- brand tone and voice standards
- platform-specific restrictions

### 4. Local-first development with cloud scheduling

The system is designed to be developed and tested locally, with GitHub Actions or a scheduler used only for automated runs. This allows fast iteration without exposing secrets.

### 5. Dry-run is the default

Everything should support a dry-run mode before live publishing. This enables safe QA, content review, and workflow validation.

## Components

### 1. Brand and policy layer

Responsible for:

- brand voice definition
- audience definition
- prohibited topics
- required disclosures
- content risk rules

Example fields:

- brand name
- target audience
- voice/tone
- prohibited topics
- mandatory disclosures
- allowed content types

### 2. Signal and research layer

Collects relevant input for decisions such as:

- internal campaign briefs
- product notes and promotions
- market trends
- search trends
- audience engagement patterns
- competitor activity

This layer produces ranked topic ideas and candidate themes.

### 3. Content planning layer

The planner decides:

- which topics to pursue
- which platform(s) each piece should target
- ideal content type (image, carousel, short video, static post, story)
- ideal publish window
- conversation angle
- CTA strategy

It produces a content plan ready for draft generation.

### 4. AI generation layer

The AI layer takes a content plan and creates:

- post text
- hooks and openings
- CTA options
- hashtags
- image or short-form video concepts
- variation sets for A/B testing

This layer should expose a provider interface so the system can switch between:

- OpenAI-compatible APIs
- Azure OpenAI
- Anthropic
- custom internal models
- a stub/mock provider for local dev and tests

### 5. Moderation and approval layer

Before content is published, the system validates:

- empty or low-quality copy
- policy violations
- missing required disclaimer
- unsupported claims
- platform-specific restrictions

If moderation fails, the content stays in draft or rejected state.

### 6. Publishing and scheduling layer

Takes approved content and schedules or publishes it based on:

- planned time
- platform constraints
- content type
- account permissions
- posting limits and rate controls

This layer is responsible for retry logic, failure capture, and audit events.

### 7. Platform adapters

Platform adapters create a stable contract for each network, such as:

- Meta (Instagram/Facebook Pages)
- LinkedIn
- X
- TikTok
- YouTube Shorts or regular video uploads

Each adapter provides:

- authentication setup
- post creation
- scheduled publish support
- media upload support
- analytics retrieval
- error translation to system errors

### 8. Analytics and feedback layer

After publishing, analytics are collected for:

- reach
- impressions
- engagement rate
- clicks
- saves
- shares
- watch time
- follower growth
- conversion events

These metrics feed future scoring and planning decisions.

## Workflow lifecycle

### Stage 1: Intake

The system receives one or more of the following:

- campaign brief
- launch objective
- product update
- seasonal campaign
- content request from marketing or sales

### Stage 2: Signal enrichment

Research passes through the signal collector and topic scoring logic.

### Stage 3: Planning

The planner builds a recommended set of content ideas and priorities.

### Stage 4: Draft generation

AI creates multiple variations with different hooks and angles.

### Stage 5: Policy check

The moderation layer validates the draft before approval.

### Stage 6: Human review

A human reviews and approves or rejects the draft.

### Stage 7: Schedule or publish

The approved post is sent to the scheduler and then to the platform adapter.

### Stage 8: Measure and optimize

Analytics are retrieved and fed back into the scoring engine to improve the next cycle.

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

## Safety and compliance rules

### Required controls

- Credentials must be stored in environment variables or GitHub Secrets
- No API tokens or OAuth secrets should be committed
- Dry-run is default until explicit approval
- Publishing is blocked if moderation fails
- Each scheduled and published item is auditable
- Disclosures are required where applicable

### Example validation rules

- If a draft contains prohibited claim language, reject it
- If a product claim is unsubstantiated, require human review
- If a platform requires a disclosure, ensure it is included
- If a caption is empty, reject before publishing

## Technology boundaries

The architecture should keep these concerns separate:

- AI orchestration
- content planning
- moderation
- scheduling
- platform integration
- analytics
- infrastructure and secrets management

This separation makes it easier to swap AI providers, add new social platforms, and improve moderation without rewriting the whole system.

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

- project structure
- config and secrets
- dry-run publishing flow
- approval gate
- tests and CI

### Phase 2: Meta-first launch

- Instagram/Facebook Pages integration
- content planning
- AI-generated captions
- image caption variations
- approval workflow

### Phase 3: Multi-platform expansion

- LinkedIn
- X
- TikTok
- YouTube
- cross-platform scheduling

### Phase 4: Intelligence loop

- analytics ingestion
- performance scoring
- best-post recommendation engine
- topic prioritization from past results

## Operational notes

- Use GitHub Actions for scheduled planning and dry runs
- Use a queue or job runner for live publishing jobs
- Log all events with timestamps, platform, account, status, and draft ID
- Keep “last approved” and “last published” states for each content record
- Support retries but never silently republish without a new approval

## Summary

This architecture creates a safe, scalable, and extensible SMM automation system. AI helps generate strong social content and reduce workload, while the approval, moderation, and platform layers maintain control, compliance, and reliability.
