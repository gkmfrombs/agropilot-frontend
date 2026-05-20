from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router.scanner import router as scanner_router


# Initialize config to load environment and logging first
import config 

from router.chat import router as chat_router
from router.auth import router as auth_router
from router.graph import router as graph_router
from router.briefing import router as briefing_router
from router.alerts import router as alerts_router
from router.route import router as route_router
from router.calculator import router as calculator_router
from router.manager import router as manager_router
from router.entities import router as entities_router

app = FastAPI(
    title="Agri-Edge LangGraph Co-Pilot",
    description="Intelligent routing API for Syngenta GraphRAG and Agronomy Assistance",
    version="1.0.0"
)

# CORS Configuration for React Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(graph_router)
app.include_router(scanner_router)
app.include_router(briefing_router)
app.include_router(alerts_router)
app.include_router(route_router)
app.include_router(calculator_router)
app.include_router(manager_router)
app.include_router(entities_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
