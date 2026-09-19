from dataclasses import dataclass
import os

@dataclass(frozen=True)
class Settings:
    ai_provider: str = os.getenv("AI_PROVIDER", "stub")
    dry_run: bool = os.getenv("DRY_RUN", "true").lower() == "true"
    meta_access_token: str | None = os.getenv("META_ACCESS_TOKEN")
    meta_page_id: str | None = os.getenv("META_PAGE_ID")

def get_settings() -> Settings:
    return Settings()
