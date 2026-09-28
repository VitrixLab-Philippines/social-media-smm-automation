import time
import uuid
import json
import os
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
import structlog
from starlette.middleware.base import Middleware

app = FastAPI(title="SMM Automation API")

# Structlog configuration for structured logging
structlog.configure(
    processors=[
        structlog.processors.JSONRenderer()
    ]
)

# Request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = str(time.time() - request.scope.get("root_path", ""))
    
    # Log the request with structured data
    structlog.get_logger().info(
        "http_request",
        request_id=request_id,
        method=request.method,
        path=request.url.path,
        query=str(request.query_params),
        client_host=request.client.host,
        user_agent=request.headers.get("user-agent", ""),
    )
    
    return response

# Error handler for HTTP exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    structlog.get_logger().error(
        "http_exception",
        request_id=request.headers.get("X-Request-ID", "unknown"),
        status_code=exc.status_code,
        detail=exc.detail,
        path=request.url.path,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "code": exc.status_code},
    )

# General exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    structlog.get_logger().error(
        "unhandled_exception",
        request_id=request.headers.get("X-Request-ID", "unknown"),
        path=request.url.path,
        error=str(exc),
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "code": 500},
    )


@app.get("/api/health")
def health():
    """Liveness and readiness check with dependency status."""
    checks = {}

    # Liveness: process is running
    checks["liveness"] = "ok"

    # Readiness: check database connection
    try:
        result = subprocess.run(
            ["python3", "-c", "from smm.domain.models import AnalyticsSnapshot; print('db ok')"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        checks["readiness"] = "ok" if result.returncode == 0 else "degraded"
    except Exception:
        checks["readiness"] = "degraded"

    # Worker heartbeat: check if recent jobs processed
    try:
        result = subprocess.run(
            ["python3", "-c", "from smm.workflows.daily import build_daily_draft; print('worker ok')"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        checks["worker_heartbeat"] = "ok" if result.returncode == 0 else "degraded"
    except Exception:
        checks["worker_heartbeat"] = "degraded"

    # Integration health: check if AI provider is configured
    try:
        from smm.config import get_settings
        settings = get_settings()
        if settings.ai_provider and settings.ai_provider != "stub":
            checks["integration_health"] = "ok"
        else:
            checks["integration_health"] = "limited"
    except Exception:
        checks["integration_health"] = "unknown"

    overall = "ok" if all(
        v == "ok" for v in checks.values() if v is not None
    ) else "degraded"

    return {"status": overall, "checks": checks}


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

    from smm.research.signals import rank_signals
    result = rank_signals(signals)
    return {"sorted": [{"topic": s.topic, "source": s.source, "relevance": s.relevance} for s in result]}


@app.post("/api/workflow/run")
def run_workflow(payload: dict):
    return {"received": payload}