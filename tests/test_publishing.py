from smm.domain.models import BrandProfile, ContentDraft, DraftStatus
from smm.integrations.adapters import MetaAdapter
from smm.moderation.policy import ModerationService
from smm.publishing.service import PublishingService

def test_live_publish_requires_human_approval():
    brand = BrandProfile("Brand", "audience", "helpful")
    draft = ContentDraft("1", "topic", "meta", "hello")
    service = PublishingService(MetaAdapter(None, None), ModerationService())
    result = service.publish(draft, brand, approved=False, dry_run=False)
    assert result.success is False
    assert "approval" in result.message
    assert draft.status == DraftStatus.DRAFT

def test_moderation_runs_before_publish():
    brand = BrandProfile("Brand", "audience", "helpful", prohibited_topics=("secret",))
    draft = ContentDraft("1", "topic", "meta", "secret information")
    service = PublishingService(MetaAdapter(None, None), ModerationService())
    result = service.publish(draft, brand, approved=True, dry_run=True)
    assert result.success is False
    assert draft.status == DraftStatus.REJECTED
