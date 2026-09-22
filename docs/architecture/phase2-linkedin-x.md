# Phase 2: LinkedIn + X

## Overview

Expand platform support beyond Meta to include LinkedIn and X (formerly Twitter). This phase adds two new platform adapters while keeping the planner and moderation layers platform-neutral.

## Goals

- LinkedIn adapter: sponsored content and article publishing
- X adapter: post publishing with reply and media support
- Cross-platform content planning that selects optimal platforms per topic
- Shared moderation rules apply across all platforms
- Dry-run mode for both new adapters

## Adapter Requirements

### LinkedIn Adapter

- Authentication: OAuth 2.0 with organization or personal account
- Publish: article or post creation
- Supported content: text, image, article links
- Dry-run: simulate post creation without API call
- Analytics: impressions, engagements, clicks, reactions

### X Adapter

- Authentication: Bearer token OAuth 2.0
- Publish: post creation with optional media
- Supported content: text, images, videos up to limit
- Dry-run: simulate post creation without API call
- Analytics: impressions, engagements, clicks, likes, retweets, replies

## Cross-Platform Planning

The content planner should support selecting multiple platforms per topic:

```python
plan = planner.plan("product update", brand, platforms=("meta", "linkedin", "x"))
```

Platform selection logic considers:

- Audience demographics per platform
- Content type suitability (text vs. visual vs. long-form)
- Campaign objectives (brand awareness vs. lead generation vs. engagement)
- Posting frequency limits per account

## Migration from Phase 1

- Existing moderation and approval workflow carries over unchanged
- Meta adapter remains active alongside new adapters
- Draft status and publishing service unchanged
- CI tests extended for new adapter publish methods

## Risks and Constraints

- Each platform has different API constraints and rate limits
- Content formatting varies significantly across platforms
- Compliance regulations differ (e.g., financial disclosures vary by jurisdiction)
- Authentication flows differ (OAuth 2.0 variants per platform)

## Success Criteria

- Both adapters support dry-run mode without credentials
- Moderation validates content for each platform's policies
- Human approval gate works for all platforms
- CLI can generate drafts targeting specific platforms or all platforms