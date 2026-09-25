"""Verify that all imports in src/smm/ resolve correctly."""

import pytest

from smm.analytics.feedback import engagement_rate, summarize
from smm.domain.models import BrandProfile, ContentDraft, AnalyticsSnapshot, PublishResult
from smm.moderation.policy import ModerationResult, ModerationService
from smm.workflows.daily import build_daily_draft
from smm.ai.provider import AIProvider, GenerationRequest, GenerationResult, StubAIProvider
from smm.content.planner import ContentPlan, ContentPlanner
from smm.publishing.service import PublishingService
from smm.publishing.ports import Publisher
from smm.research.signals import rank_signals, Signal
from smm.wasm.signals import rank_signals as wasm_rank_signals, Signal as wasm_Signal
from smm.wasm.feedback import engagement_rate as wasm_engagement_rate, summarize as wasm_summarize
from smm.integrations.adapters import MetaAdapter


def test_engagement_rate_import():
    assert engagement_rate is not None


def test_summarize_import():
    assert summarize is not None


def test_brand_profile_import():
    brand = BrandProfile("Test Brand", "audience", "voice")
    assert brand.name == "Test Brand"


def test_content_draft_import():
    draft = ContentDraft(
        id="test",
        topic="test",
        platform="meta",
        text="test",
    )
    assert draft.id == "test"


def test_analytics_snapshot_import():
    snapshot = AnalyticsSnapshot("meta", impressions=100, engagements=12)
    assert snapshot.impressions == 100


def test_publish_result_import():
    result = PublishResult("meta", True, None, "success", True)
    assert result.platform == "meta"


def test_moderation_result_import():
    result = ModerationResult(approved=True, reasons=())
    assert result.approved is True


def test_moderation_service_import():
    service = ModerationService()
    assert service is not None


def test_build_daily_draft_import():
    from smm.domain.models import BrandProfile
    brand = BrandProfile("Test Brand", "audience", "voice")
    draft = build_daily_draft("test topic", brand, "test-draft")
    assert draft.topic == "test topic"


def test_ai_provider_protocol_import():
    assert AIProvider is not None


def test_generation_request_import():
    req = GenerationRequest("test", "meta", "voice", "audience")
    assert req.topic == "test"


def test_generation_result_import():
    result = GenerationResult("text", ["#meta"], "concept")
    assert result.text == "text"


def test_stub_ai_provider_import():
    provider = StubAIProvider()
    assert provider is not None


def test_content_plan_import():
    plan = ContentPlan(topic="test", platforms=("meta",), content_type="post")
    assert plan.topic == "test"


def test_content_planner_import():
    from smm.ai.provider import StubAIProvider
    planner = ContentPlanner(StubAIProvider())
    assert planner is not None


def test_publishing_service_import():
    from smm.moderation.policy import ModerationService
    from smm.publishing.ports import Publisher
    svc = PublishingService(  # type: ignore[call-overload]
        lambda draft, *, dry_run=True: None(),  # type: ignore[arg-type]
        ModerationService(),
    )
    assert svc is not None


def test_publisher_protocol_import():
    from smm.publishing.ports import Publisher
    assert Publisher is not None


def test_rank_signals_import():
    signals = [
        Signal(topic="a", source="x", relevance=0.5),
        Signal(topic="b", source="y", relevance=0.8),
    ]
    ranked = rank_signals(signals)
    assert ranked[0].relevance == 0.8


def test_wasm_rank_signals_import():
    assert wasm_rank_signals is not None


def test_wasm_signal_import():
    assert wasm_Signal is not None


def test_wasm_engagement_rate_import():
    assert wasm_engagement_rate is not None


def test_wasm_summarize_import():
    assert wasm_summarize is not None


def test_meta_adapter_import():
    adapter = MetaAdapter()
    assert adapter is not None
    assert adapter.platform == "meta"


def test_meta_adapter_publish_dry_run_import():
    adapter = MetaAdapter()
    result = adapter.publish(
        ContentDraft(
            id="test",
            topic="test",
            platform="meta",
            text="test",
        ),
        dry_run=True,
    )
    assert result.success is True


def test_meta_adapter_publish_no_credentials_import():
    adapter = MetaAdapter()
    result = adapter.publish(
        ContentDraft(
            id="test",
            topic="test",
            platform="meta",
            text="test",
        ),
        dry_run=False,
    )
    assert result.success is False


def test_config_import():
    from smm.config import get_settings, Settings
    settings = get_settings()
    assert isinstance(settings, Settings)


def test_cli_import():
    from smm.cli import main
    assert main is not None


def test_main_app_import():
    try:
        from smm.main import app
        assert app is not None
    except ModuleNotFoundError:
        pytest.skip("fastapi not installed")


def test_fastapi_import():
    try:
        from fastapi import FastAPI
        assert FastAPI is not None
    except ModuleNotFoundError:
        pytest.skip("fastapi not installed")


def test_file_response_import():
    try:
        from fastapi.responses import FileResponse
        assert FileResponse is not None
    except ModuleNotFoundError:
        pytest.skip("fastapi not installed")


def test_argparse_import():
    import argparse
    assert argparse is not None