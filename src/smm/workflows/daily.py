from smm.ai.provider import StubAIProvider
from smm.content.planner import ContentPlanner
from smm.domain.models import BrandProfile

def build_daily_draft(topic: str, brand: BrandProfile, draft_id: str):
    planner = ContentPlanner(StubAIProvider())
    plan = planner.plan(topic, brand, platforms=("meta",))
    return planner.generate_draft(plan, brand, draft_id)
