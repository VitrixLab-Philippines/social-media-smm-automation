from smm.domain.models import ContentDraft
from smm.integrations.adapters import MetaAdapter

def test_meta_dry_run_never_requires_credentials():
    draft = ContentDraft("1", "topic", "meta", "hello")
    result = MetaAdapter(None, None).publish(draft, dry_run=True)
    assert result.success is True
    assert result.dry_run is True

def test_meta_live_mode_requires_credentials():
    draft = ContentDraft("1", "topic", "meta", "hello")
    result = MetaAdapter(None, None).publish(draft, dry_run=False)
    assert result.success is False
