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



import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print(f"🚀 Starting {settings.app_name} v{settings.app_version}")
    print(f"📡 Ollama Host: {settings.ollama_host}")
    print(f"🤖 Default Model: {settings.ollama_model}")
    
    # Start Background Refresh Task
    asyncio.create_task(refresh_knowledge_base())
    
    yield
    # Shutdown
    print("👋 Shutting down AskUni Backend")


async def refresh_knowledge_base():
    """Background task to refresh knowledge base entries every 20 minutes."""
    from services.knowledge_service import knowledge_service
    from services.web_scraper import web_scraper
    
    print("⏰ Background Scraper Service Started (Interval: 20m)")
    
    while True:
        try:
            # Wait 20 minutes before next run (or run immediately on first loop? 
            # Better to wait initially or run? Let's wait 20m to avoid slowing startup)
            await asyncio.sleep(1200) 
            
            print("🔄 Auto-Refresh: Checking knowledge base for updates...")
            entries = knowledge_service.get_all_entries()
            count = 0
            for entry in entries:
                # Valid URL check
                if not entry['url'] or not entry['url'].startswith('http'):
                    continue
                    
                # Re-scrape
                try:
                    content = await web_scraper.scrape_url(entry['url'])
                    if content and len(content) > 100:
                        # Only update if content changed or just update timestamp
                        knowledge_service.update_entry(
                            entry_id=entry['id'],
                            content=content
                        )
                        count += 1
                except Exception as e:
                    print(f"⚠️ Failed to refresh {entry['url']}: {e}")
            
            if count > 0:
                print(f"✅ Auto-Refreshed {count} knowledge entries")
                
        except Exception as e:
            print(f"❌ Auto-Refresh Error: {e}")
            await asyncio.sleep(60) # Wait a bit on error before retrying


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
