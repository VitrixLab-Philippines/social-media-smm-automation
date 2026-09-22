# Phase 4: Analytics-Driven Recommendation Loop

## Overview

Close the feedback loop by ingesting performance analytics, scoring topic effectiveness, and automatically prioritizing future content plans based on data-driven insights. This phase transforms the system from a content generation tool into an optimization engine.

## Goals

- Analytics ingestion: normalized metrics from all platform adapters
- Performance scoring: rank topics by engagement, conversion, and audience growth
- Topic prioritization: auto-suggest high-scoring topics for next planning cycle
- A/B testing support: compare variations and surface winners
- Continuous improvement: feedback loop reduces manual research time

## Analytics Ingestion

Each platform adapter publishes analytics in a normalized format consumed by the feedback layer:

### Meta Analytics

- Reach, impressions, engagements, clicks
- Post clicks (link clicks, photo views, video plays)
- Likes, comments, shares, saves
- Follower growth during campaign period

### LinkedIn Analytics

- Impressions, clicks, likes, comments, shares
- Post views and unique visitors (for articles)
- Follower net change

### X Analytics

- Impressions, engagements, likes, retweets, replies
- Link clicks, media views
- Follower growth

### TikTok Analytics

- Views, likes, shares, comments
- Average watch duration, completion rate
- Traffic source breakdown

### YouTube Analytics

- Views, watch time, average view duration
- Likes, dislikes, comments
- Traffic sources, retention graph data

## Scoring Algorithm

Topics are scored on a 0.0–1.0 scale considering:

| Factor | Weight | Description |
|---|---|---|
| Engagement rate | 40% | Engagements / Impressions |
| Click-through rate | 25% | Clicks / Impressions |
| Conversion rate | 20% | Clicks to desired action (sign-up, purchase) |
| Audience growth | 10% | Followers gained during campaign |
| Recency bonus | 5% | newer content gets slight boost |

Formula: `score = (er * 0.4) + (ctr * 0.25) + (cr * 0.2) + (ag * 0.1) + (recency * 0.05)`

## Topic Prioritization

The research/signal layer receives scored topics and re-ranks the backlog:

```python
ranked = research.prioritize_topics(raw_topics, scores)
```

Priority factors:

- Historical performance for similar topics
- Audience segment alignment
- Campaign objective mapping (awareness, consideration, conversion)
- Seasonal/trending relevance
- Content type diversity (avoid over-indexing on one format)

## A/B Testing Support

The system supports split testing by:

- Generating content variations with different hooks, CTAs, or formats
- Assigning each variation to a separate planning track
- Capturing separate analytics per variation
- Automatic winner detection after minimum threshold (e.g., 100 impressions)
- Surface winning variation parameters for future planning

## Feedback Loop Workflow

```text
Publish
  |
  v
Collect Analytics (all platforms)
  |
  v
Score Topics (engagement, CTR, conversion, growth)
  |
  v
Prioritize Research Backlog
  |
  v
Plan Next Cycle (top-ranked topics)
  |
  v
Generate Drafts (AI content planning)
  |
  v
Human Approval
  |
  v
Publish (new cycle)
```

## Migration from Phase 3

- All platform adapters (Meta, LinkedIn, X, TikTok, YouTube) send analytics in normalized format
- Existing moderation and approval workflow carries over unchanged
- ContentDraft model gains `metadata` field for scoring context
- Publishing service unchanged; analytics consumed externally
- CI tests extended for analytics feedback functions

## Risks and Constraints

- Data quality varies by platform; some provide incomplete metrics
- Attribution across channels is difficult (multi-touch attribution)
- Scoring algorithm requires sufficient data (minimum impression threshold)
- Over-optimization can reduce creative diversity
- Requires consistent tracking and tagging across all published content

## Success Criteria

- Analytics ingestion works for all 5 platforms with normalized output
- Scoring algorithm produces coherent rankings after 3+ data points
- Priority topic recommendations improve engagement vs. random selection
- A/B testing detects winners at scale (>100 impressions per variant)
- System reduces manual research time by ~40% after 3 cycles