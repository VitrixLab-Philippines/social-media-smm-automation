from smm.domain.models import ContentDraft, DraftStatus, PublishResult
from smm.moderation.policy import ModerationService
from smm.domain.models import BrandProfile
from smm.publishing.ports import Publisher

class PublishingService:
    def __init__(self, publisher: Publisher, moderation: ModerationService):
        self.publisher = publisher
        self.moderation = moderation

    def publish(self, draft: ContentDraft, brand: BrandProfile, *, approved: bool, dry_run: bool = True) -> PublishResult:
        moderation = self.moderation.validate(draft, brand)
        if not moderation.approved:
            draft.status = DraftStatus.REJECTED
            return PublishResult(draft.platform, False, None, "; ".join(moderation.reasons), dry_run)
        if not approved:
            return PublishResult(draft.platform, False, None, "human approval required", dry_run)
        draft.status = DraftStatus.APPROVED
        result = self.publisher.publish(draft, dry_run=dry_run)
        if result.success and not result.dry_run:
            draft.status = DraftStatus.PUBLISHED
        return result
