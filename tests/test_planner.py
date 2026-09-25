from smm.ai.provider import StubAIProvider
from smm.content.planner import ContentPlanner
from smm.domain.models import BrandProfile

def test_planner_generates_meta_draft():
    brand = BrandProfile("Brand", "small businesses", "clear and practical")
    planner = ContentPlanner(StubAIProvider())
    plan = planner.plan("product update", brand)
    draft = planner.generate_draft(plan, brand, "draft-1")
    assert draft.platform == "meta"
    assert draft.text
