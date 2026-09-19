from dataclasses import dataclass

@dataclass(frozen=True)
class Signal:
    topic: str
    source: str
    relevance: float = 0.0

def rank_signals(signals: list[Signal]) -> list[Signal]:
    return sorted(signals, key=lambda item: item.relevance, reverse=True)
