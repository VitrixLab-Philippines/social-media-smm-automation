from smm.analytics.feedback import engagement_rate
from smm.domain.models import AnalyticsSnapshot

def test_engagement_rate():
    snapshot = AnalyticsSnapshot("meta", impressions=100, engagements=12)
    assert engagement_rate(snapshot) == 0.12

def test_zero_impressions_is_safe():
    assert engagement_rate(AnalyticsSnapshot("meta")) == 0.0
