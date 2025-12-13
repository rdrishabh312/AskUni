"""
Chat Routes - API endpoints for chat functionality.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import json

from services.ollama_service import ollama_service
from services.ollama_service import ollama_service
from services.web_scraper import web_scraper
from services.supabase_service import supabase_service


router = APIRouter(prefix="/api/chat", tags=["Chat"])


class Message(BaseModel):
    """Chat message model."""
    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    messages: List[Message]
    enable_web_search: bool = False
    enable_web_search: bool = False
    search_query: Optional[str] = None
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    response: str
    sources: Optional[List[dict]] = None


class SearchRequest(BaseModel):
    """Request model for web search."""
    query: str
    max_results: Optional[int] = 5


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message and get an AI response.
    Optionally enables web search for context.
    """
    try:
        # Convert messages to dict format
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        
        context = None
        sources = None
        
        # If web search is enabled, get context
        if request.enable_web_search:
            # Use the last user message or provided query for search
            search_query = request.search_query
            if not search_query and messages:
                for m in reversed(messages):
                    if m["role"] == "user":
                        search_query = m["content"]
                        break
            
            if search_query:
                search_result = await web_scraper.search_and_scrape(search_query)
                context = search_result.get("context")
                sources = search_result.get("sources", [])
        
        # Get AI response
        response = await ollama_service.chat(messages, context)
        
        # Log to Supabase
        if request.user_id:
            # Log user message (last one)
            last_user_msg = next((m for m in reversed(messages) if m["role"] == "user"), None)
            if last_user_msg:
                supabase_service.log_chat(request.user_id, last_user_msg["content"], "user", ollama_service.model)
            
            # Log assistant response
            supabase_service.log_chat(request.user_id, response, "assistant", ollama_service.model)
        
        return ChatResponse(response=response, sources=sources)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """
    Stream chat responses in real-time.
    Returns Server-Sent Events (SSE).
    """
    async def generate():
        try:
            messages = [{"role": m.role, "content": m.content} for m in request.messages]
            
            context = None
            sources = []
            
            # Web search if enabled
            if request.enable_web_search:
                search_query = request.search_query
                if not search_query and messages:
                    for m in reversed(messages):
                        if m["role"] == "user":
                            search_query = m["content"]
                            break
                
                if search_query:
                    search_result = await web_scraper.search_and_scrape(search_query)
                    context = search_result.get("context")
                    sources = search_result.get("sources", [])
                    
                    # Send sources first
                    if sources:
                        yield f"data: {json.dumps({'type': 'sources', 'data': sources})}\n\n"
                        sources_sent = True
            
            # Stream response
            full_response = ""
            async for chunk in ollama_service.chat_stream(messages, context):
                if chunk:
                    full_response += chunk
                    yield f"data: {json.dumps({'response': chunk, 'sources': sources if not sources_sent else None})}\n\n"
                    sources_sent = True # Mark sources as sent if they were included with the first chunk
            
            # Log complete interaction
            if request.user_id:
                # Log user message
                last_user_msg = next((m for m in reversed(messages) if m["role"] == "user"), None)
                if last_user_msg:
                    supabase_service.log_chat(request.user_id, last_user_msg["content"], "user", ollama_service.model)
                
                # Log assistant response
                if full_response:
                    supabase_service.log_chat(request.user_id, full_response, "assistant", ollama_service.model)
            
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'data': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.post("/search")
async def search(request: SearchRequest):
    """
    Search the web and return results with optional content.
    """
    try:
        result = await web_scraper.search_and_scrape(
            request.query,
            request.max_results
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/scrape")
async def scrape_url(url: str):
    """
    Scrape content from a specific URL.
    """
    try:
        content = await web_scraper.scrape_url(url)
        if content:
            return {"url": url, "content": content}
        else:
            raise HTTPException(status_code=404, detail="Could not scrape content")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
