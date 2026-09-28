from smm.integrations.contracts import capability_matrix, normalize_platform


def test_platform_aliases_are_normalized():
    assert normalize_platform(" Twitter ") == "x"
    assert normalize_platform("linkedin") == "linkedin"


def test_phase_two_platforms_are_present():
    platforms = {item["platform"] for item in capability_matrix()}
    assert {"meta", "facebook", "instagram", "linkedin", "x", "tiktok", "youtube"} <= platforms
