# src/smm/main.py
from fastapi import FastAPI

app = FastAPI()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/workflow/run")
def run_workflow(payload: dict):
    return {"received": payload}