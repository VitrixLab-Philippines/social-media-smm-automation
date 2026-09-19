from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True)
class GenerationRequest:
    topic: str
    platform: str
    brand_voice: str
    audience: str

@dataclass(frozen=True)
class GenerationResult:
    text: str
    hashtags: list[str]
    creative_concept: str

class AIProvider(Protocol):
    def generate(self, request: GenerationRequest) -> GenerationResult: ...

class StubAIProvider:
    """Deterministic provider for local development and tests."""

    def generate(self, request: GenerationRequest) -> GenerationResult:
        text = f"{request.topic} — a practical update for {request.audience}."
        return GenerationResult(
            text=text,
            hashtags=[f"#{request.platform.lower()}", "#content"],
            creative_concept=f"Simple branded visual explaining {request.topic}.",
        )
