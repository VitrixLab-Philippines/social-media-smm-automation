from typing import Protocol
from smm.domain.models import ContentDraft, PublishResult

class Publisher(Protocol):
    def publish(self, draft: ContentDraft, *, dry_run: bool = True) -> PublishResult: ...
