from dataclasses import dataclass
from typing import Optional
from smm.ai.provider import AIProvider, GenerationRequest, GenerationResult
from smm.domain.models import BrandProfile, ContentDraft

@dataclass(frozen=True)
class ContentPlan:
    topic: str
    platforms: tuple[str, ...]
    content_type: str
    cta: Optional[str] = None

class ContentPlanner:
    def __init__(self, provider: AIProvider):
        self.provider = provider

    def plan(self, topic: str, brand: BrandProfile, platforms=("meta",)) -> ContentPlan:
        return ContentPlan(topic=topic, platforms=tuple(platforms), content_type="post")

    def generate_draft(self, plan: ContentPlan, brand: BrandProfile, draft_id: str) -> ContentDraft:
        result: GenerationResult = self.provider.generate(
            GenerationRequest(plan.topic, plan.platforms[0], brand.voice, brand.audience)
        )
        return ContentDraft(
            id=draft_id,
            topic=plan.topic,
            platform=plan.platforms[0],
            text=result.text,
            hashtags=result.hashtags,
            metadata={"creative_concept": result.creative_concept},
        )
