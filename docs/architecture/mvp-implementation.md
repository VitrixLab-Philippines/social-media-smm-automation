# MVP Implementation

The MVP deliberately starts with Meta (Instagram + Facebook Page) rather than mixing multiple networks into the planner.

## Boundaries

- **Research/signals:** produces ranked topics.
- **Content planner:** converts topics into platform-neutral plans.
- **AI provider:** generates drafts through a provider interface.
- **Moderation:** applies deterministic brand/policy checks.
- **Approval:** a human must explicitly approve live publication.
- **Meta adapter:** is the only initial publishing integration.
- **Scheduler:** GitHub Actions runs planning/dry-run jobs; production publishing should use a durable job runner.
- **Analytics:** stores normalized platform metrics for feedback.

## Safety defaults

- `DRY_RUN=true`
- Missing Meta credentials cannot trigger live publishing.
- Moderation runs before approval/publishing.
- AI never receives raw OAuth secrets.
- Live Meta endpoints remain disabled until permissions and API behavior are validated.

## Expansion path

1. Meta
2. LinkedIn + X
3. TikTok + YouTube
4. Analytics-driven recommendations

The planner and domain contracts must remain platform-neutral as integrations expand.
