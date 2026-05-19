import sys
import os
import threading
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import get_settings
from data import loader
from services import rag
from routers import auth, briefing, chat, alerts, farmers, retailers, scan, calculator, manager, route_planning, graph, visits, copilot, sync, agent

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    loader.load_all()
    # RAG init runs in background thread — server starts immediately
    # Chat queries gracefully return empty RAG context until init completes (~30s)
    threading.Thread(target=rag.init_rag, daemon=True).start()
    yield


app = FastAPI(
    title="AgroPilot API",
    description="AI-Guided Field Force Intelligence — Syngenta IITM Hackathon 2026",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(briefing.router)
app.include_router(chat.router)
app.include_router(alerts.router)
app.include_router(farmers.router)
app.include_router(retailers.router)
app.include_router(scan.router)
app.include_router(calculator.router)
app.include_router(manager.router)
app.include_router(route_planning.router)
app.include_router(graph.router)
app.include_router(visits.router)
app.include_router(copilot.router)
app.include_router(sync.router)
app.include_router(agent.router)


@app.get("/")
def health():
    return {
        "status": "ok",
        "app": "AgroPilot",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)
