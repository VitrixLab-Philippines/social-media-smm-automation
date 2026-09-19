from typing import Protocol
from smm.domain.models import ContentDraft, PublishResult

class PlatformAdapter(Protocol):
    platform: str
    def publish(self, draft: ContentDraft, *, dry_run: bool = True) -> PublishResult: ...

class MetaAdapter:
    """Meta publishing boundary. Live API calls are intentionally not implemented yet."""

    platform = "meta"

    def __init__(self, access_token: str | None, page_id: str | None):
        self.access_token = access_token
        self.page_id = page_id

    def publish(self, draft: ContentDraft, *, dry_run: bool = True) -> PublishResult:
        if dry_run:
            return PublishResult("meta", True, None, "dry-run: publish not sent", True)
        if not self.access_token or not self.page_id:
            return PublishResult("meta", False, None, "Meta credentials are not configured", False)
        return PublishResult(
            "meta", False, None,
            "Live Meta publishing adapter requires API permission validation and endpoint implementation",
            False,
        )
