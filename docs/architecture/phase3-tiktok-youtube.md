# Phase 3: TikTok + YouTube

## Overview

Expand platform support to include short-form video (TikTok) and long-form video (YouTube). This phase adds video-specific adapters and extends the content planning layer to handle video content types, aspect ratios, and duration constraints.

## Goals

- TikTok adapter: short-form video (15s-60s) and photo post publishing
- YouTube adapter: long-form video upload and scheduling
- Video content planning: scripts, hooks, visual sequences, background audio
- Extended moderation for video-specific policies (copyright, music licensing)
- Dry-run mode for video preview and draft generation

## Adapter Requirements

### TikTok Adapter

- Authentication: OAuth 2.0 with creator/business account
- Publish: short-form video (up to 60s with music) or photo post
- Supported content: vertical video, images, captions, hashtags, sounds
- Dry-run: generate preview URL or metadata without upload
- Analytics: views, likes, shares, comments, average watch duration

### YouTube Adapter

- Authentication: OAuth 2.0 with YouTube Data API
- Publish: long-form video upload or short (Shorts)
- Supported content: vertical or horizontal video, title, description, tags, privacy status
- Dry-run: generate upload URL or metadata without actual upload
- Analytics: views, watch time, likes, dislikes, comments, traffic sources

## Video Content Planning

The content planner extends to support video-specific planning:

```python
plan = planner.plan("how-to guide", brand, platforms=("tiktok", "youtube"))
```

Video planning considerations:

- Aspect ratio per platform (9:16 TikTok, 16:9 YouTube/Shorts)
- Duration limits (TikTok: 15-60s typical, YouTube: up to 15 min unverified, hours for verified)
- Script structure: hook at 0-3s, value in middle, CTA at end
- Visual sequence: B-roll, overlays, captions, branding
- Audio: original music, licensed tracks, voiceover style

## Cross-Platform Considerations

- Repurposing content across TikTok and YouTube Shorts
- Different audience expectations per platform
- Compliance: music licensing, copyright, platform-specific community guidelines
- Posting frequency: TikTok favors frequent posting, YouTube favors quality over quantity

## Migration from Phase 2

- LinkedIn and X adapters remain active
- New video content types added to ContentPlan and ContentDraft models
- Moderation extended with video-specific policy checks
- Publishing service supports video drafts alongside text/image drafts
- Analytics feedback includes video-specific metrics

## Risks and Constraints

- Video production requires more resources than text/image posts
- Music licensing and copyright varies by region and platform
- Upload sizes and encoding requirements differ significantly
- Algorithm behavior and best practices evolve rapidly
- YouTube API has stricter quota limits than other platforms

## Success Criteria

- Both adapters support dry-run mode without credentials
- Video content planning generates appropriate scripts and sequences
- Moderation checks video-specific policies (copyright, length, etc.)
- Human approval gate works for video drafts
- CLI can generate video-focused drafts per platform