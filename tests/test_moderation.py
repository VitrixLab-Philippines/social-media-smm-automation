from smm.domain.models import BrandProfile, ContentDraft
from smm.moderation.policy import ModerationService

def test_empty_caption_is_rejected():
    brand = BrandProfile("Brand", "audience", "helpful")
    draft = ContentDraft("1", "topic", "meta", "")
    result = ModerationService().validate(draft, brand)
    assert not result.approved

def test_prohibited_topic_is_rejected():
    brand = BrandProfile("Brand", "audience", "helpful", prohibited_topics=("politics",))
    draft = ContentDraft("1", "topic", "meta", "A politics update")
    result = ModerationService().validate(draft, brand)
    assert not result.approved
