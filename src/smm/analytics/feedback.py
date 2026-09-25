from smm.domain.models import AnalyticsSnapshot

def engagement_rate(snapshot: AnalyticsSnapshot) -> float:
    if snapshot.impressions <= 0:
        return 0.0
    return snapshot.engagements / snapshot.impressions

def summarize(snapshot: AnalyticsSnapshot) -> dict:
    return {
        "platform": snapshot.platform,
        "engagement_rate": engagement_rate(snapshot),
        "clicks": snapshot.clicks,
        "followers_gained": snapshot.followers_gained,
    }
