from dataclasses import dataclass
from smm.domain.models import BrandProfile, ContentDraft

@dataclass(frozen=True)
class ModerationResult:
    approved: bool
    reasons: tuple[str, ...]

class ModerationService:
    def validate(self, draft: ContentDraft, brand: BrandProfile) -> ModerationResult:
        reasons: list[str] = []
        text = draft.text.strip()

        if not text:
            reasons.append("caption is empty")

        lowered = text.lower()
        for topic in brand.prohibited_topics:
            if topic.lower() in lowered:
                reasons.append(f"prohibited topic detected: {topic}")

        for disclosure in brand.required_disclosures:
            if disclosure.lower() not in lowered:
                reasons.append(f"required disclosure missing: {disclosure}")

        return ModerationResult(approved=not reasons, reasons=tuple(reasons))
