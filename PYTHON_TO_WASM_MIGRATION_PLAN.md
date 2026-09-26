# Python to WebAssembly Migration Plan

## Project Overview

SMM Automation — AI-assisted social media management with human approval gates.
Migration of pure compute Python functions to WebAssembly (WASM) for faster, more efficient computation.

## Current Stack

- **Python**: FastAPI-based SMM platform (16 source files, 5 test files)
- **Runtime**: CPython interpreter, FastAPI server
- **Build**: `pyproject.toml` with setuptools, `package.json` with `serve`
- **Deployment**: Vercel, GitHub Actions CI
- **No existing WASM infrastructure**

## Migration Strategy: Hybrid Approach

Migrate only **pure compute hot paths** to WASM using **Waspy** (Rust AOT compiler),
while keeping the remainder as FastAPI Python. This gives the best ROI with minimal risk.

### Why Waspy Over Alternatives

| Approach | Binary Size | Speedup | Coverage | Notes |
|----------|------------|---------|----------|-------|
| **Waspy** (recommended) | 0.2-6 KB | 2-5x faster than CPython | Typed subset | AOT compiled, no interpreter, self-contained |
| py2wasm | MBs | 3x faster than interpreted | Near-full Python | Embeds CPython runtime, larger binaries |
| Wasmer/Wasmtime | 2-25 MB | Near-native (with AOT) | Full Python | Runs existing Python without rewrites |
| Pyodide | ~25 MB | Slower | Full + scientific | Browser-only, not suitable for edge |

### Target Functions for Migration

| Function | Location | Why Migrate |
|----------|----------|-------------|
| `engagement_rate()` | `src/smm/analytics/feedback.py:3-6` | Simple division with zero-check. Pure computation, no side effects. High frequency in analytics endpoints. |
| `rank_signals()` | `src/smm/research/signals.py:9` | Sorting by relevance. Pure computation with list sorting. High frequency in workflow orchestration. |

### Implementation Architecture

```
Python Code (unchanged)
       │
       ├───► FastAPI endpoints (existing)
       │
       └───► WASM modules (new)
                   │
                   ├── engagement_rate.wasm  ← pure compute
                   └── rank_signals.wasm      ← sorting logic

JavaScript/TS Host:
       │
       ├── Instantiate WASM modules via WebAssembly.instantiate()
       │   → Call exported functions directly
       │   → Zero-copy for numeric types (f32, f64, i32, i64)
       │
       └── FastAPI calls WASM for compute-heavy operations
```

## Phase 1: Setup

### 1.1 Add Waspy Dependency

```bash
cargo add waspy
```

Create `src/smm/wasm/` directory and copy target Python files:

```bash
mkdir -p src/smm/wasm
cp src/smm/analytics/feedback.py src/smm/research/signals.py src/smm/wasm/
```

### 1.2 Create Rust Build Script (`src/smm/wasm/build.rs`)

```rust
use waspy::compile_python_to_wasm;
use std::fs;

fn main() {
    // Compile engagement_rate
    let engagement_rate_wasm = compile_python_to_wasm(
        fs::read_to_string("engagement_rate.py").unwrap()
    ).unwrap();
    fs::write("engagement_rate.wasm", &engagement_rate_wasm)?;

    // Compile rank_signals
    let rank_signals_wasm = compile_python_to_wasm(
        fs::read_to_string("rank_signals.py").unwrap()
    ).unwrap();
    fs::write("rank_signals.wasm", &rank_signals_wasm)?;
}
```

### 1.3 Update `Cargo.toml` (if new Rust crate)

```toml
[package]
name = "smm-wasm"
version = "0.1.0"
edition = "2021"

[dependencies]
waspy = "0.1"
```

### 1.4 Build WASM Modules

```bash
cd src/smm/wasm
cargo run --release
# Produces: engagement_rate.wasm, rank_signals.wasm
```

### 1.5 Serve WASM from FastAPI

Add to `src/smm/main.py`:

```python
from fastapi import FileResponse

@app.get("/wasm/{filename}")
def wasm_file(filename: str):
    return FileResponse(f"./smm/wasm/{filename}")
```

## Phase 2: JavaScript Interop

### 2.1 Load WASM Modules in frontend/JS

```javascript
async function loadWasmModules() {
    const engagementRateModule = await WebAssembly.instantiate(
        await fetch('/wasm/engagement_rate.wasm').then(r => r.arrayBuffer())
    );

    const rankSignalsModule = await WebAssembly.instantiate(
        await fetch('/wasm/rank_signals.wasm').then(r => r.arrayBuffer())
    );

    return { engagementRateModule, rankSignalsModule };
}
```

### 2.2 Call Exported Functions

```javascript
// engagement_rate: (impressions: number, engagements: number) => number
const rate = engagementRateModule.instance.exports.engagement_rate(
    { impressions: 1000, engagements: 50 }
);
// Expected: 0.05

// rank_signals: (signals: [{topic: string, source: string, relevance: number}]) => [{topic: string, source: string, relevance: number}]
const sorted = rankSignalsModule.instance.exports.rank_signals(
    [
        { topic: "social", source: "api", relevance: 0.8 },
        { topic: "tech", source: "web", relevance: 0.95 }
    ]
);
// Expected: sorted by relevance descending
```

### 2.3 Python-to-WASM Type Mapping

| Python Type | WASM Type | Notes |
|-------------|-----------|-------|
| `int` | `i32` or `i64` | Default: i32 for small values |
| `float` | `f32` or `f64` | Waspy uses f32 by default; annotate for f64 |
| `str` | Not directly supported | Use bytes encoding/decoding if needed |
| `list` | Vector of primitives | Supported for numeric types |
| `dict` | Not directly supported | Encode as parallel arrays if needed |

## Phase 3: FastAPI Integration

### 3.1 On-Demand WASM Computation (Recommended)

```python
from fastapi import HTTPException
import subprocess
import json

def compute_engagement_rate_wasm(impressions: int, engagements: int) -> float:
    """Call WASM module for engagement rate computation."""
    try:
        # In production, use proper JS/WASM runtime
        # For now, fall back to Python implementation
        from smm.analytics.feedback import engagement_rate
        from smm.domain.models import AnalyticsSnapshot
        return engagement_rate(AnalyticsSnapshot(
            platform="test",
            impressions=impressions,
            engagements=engagements
        ))
    except Exception:
        raise HTTPException(status_code=500, detail="WASM computation failed")
```

### 3.2 Cold Start Mitigation

- Load WASM modules at FastAPI startup using background tasks
- Cache instantiated modules in FastAPI state
- Use AOT compilation (`waspy --release`) for fastest cold starts

```python
# main.py startup
@app.on_event("startup")
async def startup():
    state.wasm_modules = await load_wasm_modules()
```

## Phase 4: Testing Strategy

### 4.1 Output Equivalence Tests

Verify WASM output matches Python output exactly:

```python
def test_engagement_rate_wasm_vs_python():
    from smm.domain.models import AnalyticsSnapshot
    from smm.analytics.feedback import engagement_rate
    
    # Test various inputs
    test_cases = [
        {"impressions": 1000, "engagements": 50},
        {"impressions": 0, "engagements": 0},
        {"impressions": 100, "engagements": 100},
        {"impressions": 5000, "engagements": 250},
    ]
    
    for case in test_cases:
        snapshot = AnalyticsSnapshot(
            platform="meta",
            impressions=case["impressions"],
            engagements=case["engagements"]
        )
        python_result = engagement_rate(snapshot)
        
        # TODO: Call WASM module and compare
        wasm_result = call_wasm_engagement_rate(case["impressions"], case["engagements"])
        
        assert python_result == wasm_result, f"Mismatch: {python_result} != {wasm_result}"
```

### 4.2 Existing Tests

All existing pytest tests should continue to pass:

```bash
pytest -q  # Run existing test suite
```

### 4.3 Performance Benchmarks

```python
import time
from smm.domain.models import AnalyticsSnapshot
from smm.analytics.feedback import engagement_rate

# Benchmark Python implementation
start = time.time()
for _ in range(10000):
    engagement_rate(AnalyticsSnapshot("test", 1000, 50))
python_time = time.time() - start

# Benchmark WASM implementation (when available)
# wasm_start = time.time()
# for _ in range(10000):
#     call_wasm_engagement_rate(1000, 50)
# wasm_time = time.time() - wasm_start

# print(f"Python: {python_time:.4f}s, Expected WASM: ~{python_time / 5:.4f}s (5x faster)")
```

## Performance Projections

| Metric | Before WASM | After WASM Migration | Improvement |
|--------|-------------|---------------------|-------------|
| `engagement_rate()` call | ~50μs (Python) | ~10μs (WASM) | **80% faster** |
| `rank_signals()` (100 signals) | ~200μs | ~50μs | **75% faster** |
| Cold start impact | Negligible (already FastAPI) | +5ms per module | Acceptable |
| Binary size impact | 5MB Python | +12KB WASM | **Negligible** |
| CPU utilization | Baseline | Reduced by ~40% | Better throughput |

### Annual Cost Savings (Projected)

For a platform handling 1M analytics calculations/month:

- **Current**: ~2.5 hours CPU time at $0.05/hour (small instances) = $0.12/month
- **After WASM**: ~0.5 hours CPU time = $0.024/month
- **Monthly savings**: ~$0.096
- **Annual savings**: ~$1.15

*Note: Absolute savings are modest for this use case, but the 5x speedup improves responsiveness and user experience.*

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| **WASM output differs from Python** | Rigorous output equivalence testing; feature flag to fall back to Python |
| **Type annotation gaps** | Ensure all migrated functions have PEP 484 type annotations |
| **Unsupported Python features** | Waspy supports: functions, control flow, classes with single inheritance, collections, exceptions, lambdas, comprehensions |
| **Binary size bloat** | Waspy produces 0.2-6 KB; strip unused modules with `--release` flag |
| **JavaScript interop bugs** | Test in multiple browsers/environments; use typed arrays for data transfer |

## Success Criteria

- [ ] WASM `engagement_rate()` produces identical output to Python for 100+ test cases
- [ ] WASM `rank_signals()` produces identical sorting for 100+ test cases
- [ ] FastAPI endpoint latency improved by ≥50% for compute-heavy requests
- [ ] Binary size increase < 1% (WASM modules are ~12KB vs 5MB Python)
- [ ] All existing pytest tests continue to pass
- [ ] Zero runtime errors in production deployment

## Next Steps

1. **Approve priority functions**: `engagement_rate()`, `rank_signals()`, or both?
2. **Integration approach**: On-demand per-request loading, or startup-time loading?
3. **Testing strategy**: Exact output equivalence tests, or performance benchmarks only?
4. **Build infrastructure**: Existing Rust project, or set up new `src/smm/wasm/` crate?

Please provide your preferences and I'll proceed with implementation.