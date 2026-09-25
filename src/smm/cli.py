import argparse
from smm.domain.models import BrandProfile
from smm.workflows.daily import build_daily_draft

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("topic")
    args = parser.parse_args()
    brand = BrandProfile("Example Brand", "general audience", "clear, helpful")
    draft = build_daily_draft(args.topic, brand, "local-draft")
    print(draft.text)
    print(" ".join(draft.hashtags))

if __name__ == "__main__":
    main()
