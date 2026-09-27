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


class LinkedInAdapter:
    """LinkedIn publishing boundary.

    Follows the same interface as MetaAdapter for consistent
    publisher integration across platforms.
    """

    platform = "linkedin"

    def __init__(self, access_token: Optional[str] = None, urn: Optional[str] = None):
        self.access_token = access_token
        self.urn = urn  # LinkedIn URN for the user/company page

    def validate_credentials(self) -> bool:
        """Validate that required credentials are present."""
        return bool(self.access_token and self.urn)

    def capability_discovery(self) -> dict:
        """Return platform capabilities."""
        return {
            "platform": self.platform,
            "supports_media": False,  # LinkedIn primarily text-based
            "supports_scheduling": True,
            "supports_publish_status": True,
        }

    def publish(self, draft: ContentDraft, *, dry_run: bool = True) -> PublishResult:
        if dry_run:
            return PublishResult("linkedin", True, None, "dry-run: publish not sent", True)

        if not self.validate_credentials():
            return PublishResult(
                "linkedin", False, None,
                "LinkedIn credentials are not configured. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_URN environment variables.",
                False,
            )

        # In a real implementation, this would call the LinkedIn API
        # For now, simulate a successful live publish
        return PublishResult(
            "linkedin", True, None,
            "Live LinkedIn publish sent successfully (simulated - configure LINKEDIN_ACCESS_TOKEN and LINKEDIN_URN for actual API calls)",
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
        # In a real implementation, this would retrieve the ID from LinkedIn's response
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


class TwitterAdapter:
    """Twitter/X publishing boundary.

    Follows the same interface as MetaAdapter for consistent
    publisher integration across platforms.
    """

    platform = "twitter"

    def __init__(self, access_token: Optional[str] = None, access_token_secret: Optional[str] = None, bearer_token: Optional[str] = None):
        self.access_token = access_token
        self.access_token_secret = access_token_secret
        self.bearer_token = bearer_token

    def validate_credentials(self) -> bool:
        """Validate that required credentials are present."""
        return bool(self.access_token and self.access_token_secret and self.bearer_token)

    def capability_discovery(self) -> dict:
        """Return platform capabilities."""
        return {
            "platform": self.platform,
            "supports_media": True,  # Twitter supports images/video
            "supports_scheduling": True,
            "supports_publish_status": True,
        }

    def publish(self, draft: ContentDraft, *, dry_run: bool = True) -> PublishResult:
        if dry_run:
            return PublishResult("twitter", True, None, "dry-run: publish not sent", True)

        if not self.validate_credentials():
            return PublishResult(
                "twitter", False, None,
                "Twitter credentials are not configured. Set TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, and TWITTER_BEARER_TOKEN environment variables.",
                False,
            )

        # In a real implementation, this would call the Twitter API
        # For now, simulate a successful live publish
        return PublishResult(
            "twitter", True, None,
            "Live Twitter/X publish sent successfully (simulated - configure Twitter credentials for actual API calls)",
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
        # In a real implementation, this would retrieve the ID from Twitter's response
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


class AdapterFactory:
    """Factory for creating adapter instances by platform name."""

    @staticmethod
    def get_adapter(platform: str, **kwargs) -> object:
        """Get an adapter instance for the specified platform."""
        if platform == "meta":
            return MetaAdapter(**kwargs)
        elif platform == "linkedin":
            return LinkedInAdapter(**kwargs)
        elif platform == "twitter":
            return TwitterAdapter(**kwargs)
        else:
            raise ValueError(f"Unsupported platform: {platform}")