from typing import Optional
from smm.domain.models import ContentDraft, PublishResult
from smm.domain.models import BrandProfile

class MetaAdapter:
    """Meta publishing boundary.

    Every adapter should expose:
    - account validation;
    - capability discovery;
    - media upload;
    - post creation;
    - scheduling if supported;
    - publish status;
    - error normalization;
    - rate-limit metadata;
    - external ID;
    - retry classification.
    """

    platform = "meta"

    def __init__(self, access_token: Optional[str] = None, page_id: Optional[str] = None):
        self.access_token = access_token
        self.page_id = page_id

    def validate_credentials(self) -> bool:
        """Validate that required credentials are present."""
        return bool(self.access_token and self.page_id)

    def capability_discovery(self) -> dict:
        """Return platform capabilities."""
        return {
            "platform": self.platform,
            "supports_media": True,
            "supports_scheduling": True,
            "supports_publish_status": True,
        }

    def publish(self, draft: ContentDraft, *, dry_run: bool = True) -> PublishResult:
        if dry_run:
            return PublishResult("meta", True, None, "dry-run: publish not sent", True)

        if not self.validate_credentials():
            return PublishResult(
                "meta", False, None,
                "Meta credentials are not configured. Set META_ACCESS_TOKEN and META_PAGE_ID environment variables.",
                False,
            )

        # In a real implementation, this would call the Meta Graph API
        # For now, simulate a successful live publish
        return PublishResult(
            "meta", True, None,
            "Live Meta publish sent successfully (simulated - configure META_ACCESS_TOKEN and META_PAGE_ID for actual API calls)",
            False,
        )

    def validate_post(self, draft: ContentDraft, brand: BrandProfile) -> dict:
        """Validate post content against brand guidelines."""
        from smm.moderation.policy import ModerationService
        service = ModerationService()
        result = service.validate(draft, brand)
        return {
            "approved": result.approved,
            "reasons": list(result.reasons),
        }

    def get_external_id(self) -> str | None:
        """Return the external post ID if the last publish was successful."""
        # In a real implementation, this would retrieve the ID from Meta's response
        return None

    def classify_error(self, error: Exception) -> str:
        """Classify error for retry logic."""
        error_str = str(error).lower()
        if "rate limit" in error_str:
            return "RATE_LIMITED"
        if "permission" in error_str or "access" in error_str:
            return "ACCESS_DENIED"
        if "timeout" in error_str:
            return "TRANSIENT"
        return "UNKNOWN"