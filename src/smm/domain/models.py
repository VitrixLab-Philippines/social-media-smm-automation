from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

class DraftStatus(str, Enum):
    DRAFT = "draft"
    APPROVED = "approved"
    REJECTED = "rejected"
    PUBLISHED = "published"

@dataclass(frozen=True)
class BrandProfile:
    name: str
    audience: str
    voice: str
    prohibited_topics: tuple[str, ...] = ()
    required_disclosures: tuple[str, ...] = ()

@dataclass
class ContentDraft:
    id: str
    topic: str
    platform: str
    text: str
    hashtags: list[str] = field(default_factory=list)
    status: DraftStatus = DraftStatus.DRAFT
    metadata: dict = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)

@dataclass(frozen=True)
class PublishResult:
    platform: str
    success: bool
    external_id: str | None
    message: str
    dry_run: bool

@dataclass(frozen=True)
class AnalyticsSnapshot:
    platform: str
    impressions: int = 0
    engagements: int = 0
    clicks: int = 0
    followers_gained: int = 0
