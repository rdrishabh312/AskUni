"""
AskUni AI Assistant - FastAPI Backend
Main application entry point with CORS and routing configuration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import get_settings
from routes import chat, admin


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print(f"🚀 Starting {settings.app_name} v{settings.app_version}")
    print(f"📡 Ollama Host: {settings.ollama_host}")
    print(f"🤖 Default Model: {settings.ollama_model}")
    yield
    # Shutdown
    print("👋 Shutting down AskUni Backend")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="AI-powered university assistant with Ollama integration",
    version=settings.app_version,
    lifespan=lifespan
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(chat.router)
app.include_router(admin.router)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs_url": "/docs",
        "endpoints": {
            "chat": "/api/chat",
            "chat_stream": "/api/chat/stream",
            "search": "/api/chat/search",
            "admin": "/api/admin",
            "health": "/api/admin/health"
        }
    }


@app.get("/health")
async def health():
    """Simple health check endpoint."""
    from services.ollama_service import ollama_service
    ollama_health = ollama_service.health_check()
    return {
        "api": "healthy",
        "ollama": ollama_health.get("status", "unknown"),
        "model": ollama_health.get("current_model", "unknown")
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
