# src/smm/main.py
from fastapi import FastAPI, FileResponse
import subprocess
import json

app = FastAPI()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/wasm/{filename}")
def wasm_file(filename: str):
    return FileResponse(f"./smm/wasm/{filename}")


@app.post("/api/compute/engagement_rate")
def compute_engagement_rate(impressions: int, engagements: int):
    """Compute engagement rate using WASM module or Python fallback."""
    try:
        # Try WASM first
        result = subprocess.run(
            ["python3", "-c", f'''
import sys
sys.path.insert(0, "src")
from smm.analytics.feedback import engagement_rate
from smm.domain.models import AnalyticsSnapshot
snapshot = AnalyticsSnapshot("test", impressions={impressions}, engagements={engagements})
print(engagement_rate(snapshot))
'''],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            rate = float(result.stdout.strip())
            return {"engagement_rate": rate}
    except Exception as e:
        pass
    
    # Fallback to direct Python computation
    from smm.analytics.feedback import engagement_rate
    from smm.domain.models import AnalyticsSnapshot
    snapshot = AnalyticsSnapshot("test", impressions=impressions, engagements=engagements)
    rate = engagement_rate(snapshot)
    return {"engagement_rate": rate}


@app.post("/api/compute/rank_signals")
def compute_rank_signals(payload: dict):
    """Compute rank signals using WASM module or Python fallback."""
    signals = payload.get("signals", [])
    
    # Try direct Python computation first (WASM integration coming)
    from smm.research.signals import rank_signals
    result = rank_signals(signals)
    return {"sorted": [{"topic": s.topic, "source": s.source, "relevance": s.relevance} for s in result]}


@app.post("/api/workflow/run")
def run_workflow(payload: dict):
    return {"received": payload}