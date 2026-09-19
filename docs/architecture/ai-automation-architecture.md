# AI Automation Architecture

## 1. Purpose

This document defines the target architecture for the social-media-smm-automation platform: an AI-assisted, event-driven system that can plan, generate, validate, schedule, publish, monitor, and optimize social content across multiple networks while keeping platform credentials, business rules, and human approvals isolated from model reasoning.

## 2. Architecture principles

- **AI proposes; deterministic services execute.** LLMs generate plans/content/decisions, but publishing, permissions, rate limits, retries, and billing are enforced by application code.
- **Human-in-the-loop by policy.** Drafting can be fully automated; high-risk actions (first-time account connection, sensitive content, destructive actions, or configurable approval thresholds) require approval.
- **Provider abstraction.** Social networks are accessed through adapters so the core workflow is independent of Meta, X, LinkedIn, TikTok, etc.
- **Event-driven workflows.** Long-running jobs use durable queues/workflows rather than synchronous API requests.
- **Idempotent execution.** Every external side effect has an idempotency key and persisted execution state.
- **Observable and auditable.** AI inputs/outputs, policy decisions, approvals, tool calls, publishing results, and optimization actions are traceable.
- **Least privilege and secret isolation.** Models never receive raw OAuth secrets or unrestricted database credentials.

## 3. Logical architecture

```text
                        ┌──────────────────────────────┐
                        │          Web / API           │
                        │ Dashboard · Calendar · Inbox │
                        └──────────────┬───────────────┘
                                       │
                              Auth / Tenant / RBAC
                                       │
                        ┌──────────────▼───────────────┐
                        │       Application Layer      │
                        │ Campaigns · Content · Social │
                        │ Approvals · Analytics · Jobs │
                        └──────────────┬───────────────┘
                                       │
                         Commands / Events / Workflows
                                       │
              ┌────────────────────────▼────────────────────────┐
              │              AI Orchestration Layer             │
              │                                                 │
              │  Planner → Research → Generator → Critic        │
              │             → Policy/Brand Guard → Optimizer    │
              │                                                 │
              │  Model Gateway · Prompt Registry · AI Memory    │
              └───────┬─────────────────┬──────────────────────┘
                      │                 │
             Tool calls / data     Structured AI outputs
                      │                 │
        ┌─────────────▼───────┐   ┌────▼─────────────────┐
        │ Integration Layer   │   │ Knowledge / Data     │
        │                     │   │                      │
        │ Meta · LinkedIn     │   │ PostgreSQL           │
        │ TikTok · X · etc.   │   │ Object Storage       │
        │ Webhooks            │   │ Vector Index         │
        └─────────────┬───────┘   │ Analytics Warehouse  │
                      │            └──────────┬───────────┘
                      ▼                       ▼
               Social Networks          Metrics / Feedback
```

## 4. Core components

### 4.1 API and application layer

Responsibilities:

- tenant/account management
- user authentication and RBAC
- social account connections
- content/campaign CRUD
- calendars and scheduling
- approval queues
- analytics dashboards
- job status and audit-log access

The API should not call an LLM directly for critical workflows. It should submit a command to the workflow/job layer.

### 4.2 Workflow orchestration

Use durable workflows for:

1. content ideation
2. campaign planning
3. content generation
4. asset processing
5. validation/approval
6. scheduled publishing
7. webhook/event processing
8. analytics ingestion
9. performance analysis
10. optimization/recommendation

Each workflow stores state and can safely resume after process or provider failures.

### 4.3 AI orchestration layer

Recommended agent boundaries:

| Agent | Responsibility | Can mutate external systems? |
|---|---|---|
| Planner | Convert campaign goals into structured content plans | No |
| Researcher | Gather approved knowledge/context | No |
| Copy Generator | Create platform-specific drafts | No |
| Creative Director | Generate briefs/prompts for visual assets | No |
| Critic | Evaluate quality against explicit criteria | No |
| Policy Guard | Check safety, brand, platform, and campaign rules | No |
| Optimizer | Analyze metrics and propose changes | No |
| Publisher | Request execution through deterministic tools | Only through publish service |

Prefer small specialized agents over one unrestricted agent.

### 4.4 Model gateway

All model access should go through a single internal gateway.

Responsibilities:

- provider/model selection
- fallback models
- token and cost accounting
- structured-output enforcement
- timeout/retry policy
- prompt/version tracking
- redaction
- request/response telemetry

Suggested interface:

```text
AIRequest
  tenant_id
  workflow_id
  task_type
  model_policy
  system_prompt_version
  input_context
  output_schema
  safety_policy

AIResponse
  structured_output
  model
  usage
  latency_ms
  policy_result
  trace_id
```

### 4.5 Tool layer

AI agents should access capabilities through typed tools rather than arbitrary HTTP/database access.

Examples:

- `get_brand_profile`
- `search_content_library`
- `get_campaign`
- `create_draft`
- `request_approval`
- `generate_asset_brief`
- `get_social_metrics`
- `schedule_post`
- `publish_post`
- `reply_to_comment`

Every tool should declare:

- input schema
- output schema
- required permissions
- side-effect level
- idempotency requirements
- audit event

## 5. Content lifecycle

```text
BRIEF
  ↓
RESEARCH
  ↓
PLAN
  ↓
DRAFT
  ↓
AI CRITIC
  ↓
POLICY / BRAND VALIDATION
  ↓
┌───────────────┐
│ Approval      │────── reject ───→ REVISE
└──────┬────────┘
       │ approve
       ▼
SCHEDULE
       ↓
PUBLISH
       ↓
COLLECT METRICS
       ↓
ANALYZE
       ↓
OPTIMIZATION RECOMMENDATION
       └──────────────→ NEXT PLAN
```

## 6. Data model boundaries

Minimum domain entities:

- `Tenant`
- `User`
- `Role`
- `SocialAccount`
- `OAuthCredentialReference`
- `BrandProfile`
- `Campaign`
- `ContentPlan`
- `ContentItem`
- `Asset`
- `Approval`
- `Schedule`
- `PublishAttempt`
- `SocialPost`
- `EngagementEvent`
- `MetricSnapshot`
- `AIExecution`
- `AIArtifact`
- `PromptVersion`
- `ToolExecution`
- `WorkflowRun`
- `AuditEvent`

Keep AI execution metadata separate from business content where practical so model traces can be retained, redacted, or deleted independently.

## 7. Event architecture

Canonical events:

```text
campaign.created
content.plan.created
content.draft.created
content.validation.failed
approval.requested
approval.completed
schedule.created
publish.requested
publish.succeeded
publish.failed
social.webhook.received
engagement.received
metrics.ingested
optimization.proposed
optimization.approved
```

Events should contain a tenant ID, aggregate ID, event ID, timestamp, schema version, correlation ID, and causation ID.

## 8. Automation control plane

The automation control plane decides **when** and **whether** work runs.

It should include:

- workflow scheduler
- queue management
- concurrency limits
- provider rate-limit management
- retry/dead-letter handling
- approval gates
- feature flags
- tenant-level automation policies
- budget/token limits
- kill switches

Example policy:

```yaml
automation:
  auto_generate: true
  auto_schedule: true
  auto_publish: false
  auto_reply: false

approval:
  required_for:
    - first_publish
    - regulated_topic
    - low_confidence
    - destructive_action

limits:
  max_posts_per_day: 10
  max_ai_cost_per_campaign: 5.00
```

## 9. Safety and governance

### AI safety boundary

Never allow an LLM to directly:

- obtain raw OAuth client secrets
- execute arbitrary SQL
- execute arbitrary shell commands
- change tenant permissions
- delete production data
- bypass approval policy
- invent publishing success

### Publishing boundary

All publishing must pass:

```text
AI recommendation
      ↓
Policy engine
      ↓
Approval gate (when required)
      ↓
Publish service
      ↓
Provider adapter
      ↓
Verified provider response
      ↓
Persist result + audit event
```

The system records provider-confirmed status rather than trusting model-generated status.

## 10. Observability

Track at minimum:

- workflow success/failure rate
- queue latency
- provider API latency/errors
- publish success rate
- retry count
- AI latency
- token usage and cost
- model/provider usage
- validation rejection rate
- approval turnaround time
- content performance
- engagement rate
- attribution metrics
- tool-call errors

Every workflow should have a correlation/trace ID spanning API → workflow → AI → tool → provider.

## 11. Recommended repository structure

```text
social-media-smm-automation/
├── apps/
│   ├── api/
│   ├── web/
│   └── worker/
├── packages/
│   ├── domain/
│   ├── ai/
│   │   ├── agents/
│   │   ├── prompts/
│   │   ├── schemas/
│   │   ├── tools/
│   │   └── gateway/
│   ├── workflows/
│   ├── integrations/
│   │   ├── meta/
│   │   ├── linkedin/
│   │   ├── tiktok/
│   │   └── x/
│   ├── policy/
│   ├── analytics/
│   └── observability/
├── infrastructure/
│   ├── database/
│   ├── queues/
│   ├── storage/
│   └── deployment/
├── docs/
│   ├── architecture/
│   │   ├── ai-automation-architecture.md
│   │   ├── workflows.md
│   │   ├── integrations.md
│   │   └── security.md
│   └── adr/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── workflow/
│   └── evaluation/
└── README.md
```

This is a target structure; directories should be introduced incrementally as implementation begins.

## 12. AI evaluation layer

AI behavior should be tested independently from normal unit tests.

Maintain evaluation datasets for:

- brand voice adherence
- factuality
- platform-specific formatting
- policy violations
- hallucination resistance
- tool-selection correctness
- structured-output validity
- multilingual quality
- prompt-injection resistance

A model/prompt change should be evaluated before promotion to production.

## 13. Implementation phases

### Phase 1 — Foundation

- domain model
- tenant/RBAC
- social account abstraction
- job/workflow infrastructure
- audit logging
- provider adapter interface

### Phase 2 — AI content pipeline

- model gateway
- prompt registry
- content planner
- generator
- critic
- policy guard
- structured AI schemas

### Phase 3 — Publishing automation

- scheduler
- approval gates
- publish service
- idempotency
- provider rate limiting
- webhook ingestion

### Phase 4 — Analytics and optimization

- metric ingestion
- performance aggregation
- AI analysis
- recommendation engine
- controlled optimization experiments

### Phase 5 — Autonomous operations

Enable automation gradually using tenant-configurable policies, budgets, confidence thresholds, approval requirements, and kill switches.

## 14. Architectural decision rule

When deciding whether a capability belongs in AI or deterministic application code:

```text
Reasoning / generation / classification
            → AI layer

Authorization / validation / scheduling
            → deterministic application layer

External side effect
            → deterministic tool + provider adapter

Long-running state
            → durable workflow

Business-critical decision
            → explicit policy + auditable rule
```

This separation is the primary guardrail for scaling the platform from AI-assisted SMM into reliable AI automation.
