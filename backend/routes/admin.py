"""
Admin Routes - API endpoints for AI administration and monitoring.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from services.ollama_service import ollama_service


router = APIRouter(prefix="/api/admin", tags=["Admin"])


class ModelConfigRequest(BaseModel):
    """Request model for changing AI model."""
    model_name: str


class TestPromptRequest(BaseModel):
    """Request model for testing AI prompts."""
    prompt: str
    system_prompt: Optional[str] = None


class StatsResponse(BaseModel):
    """Response model for usage statistics."""
    status: str
    current_model: str
    ollama_host: str
    available_models: int
    timestamp: str


@router.get("/health")
async def health_check():
    """
    Check the health status of the AI service.
    """
    return ollama_service.health_check()


@router.get("/models")
async def list_models():
    """
    List all available Ollama models.
    """
    models = ollama_service.list_models()
    return {
        "current_model": ollama_service.model,
        "available_models": models
    }


@router.post("/models/switch")
async def switch_model(request: ModelConfigRequest):
    """
    Switch to a different Ollama model.
    """
    success = ollama_service.set_model(request.model_name)
    if success:
        return {
            "success": True,
            "message": f"Switched to model: {request.model_name}",
            "current_model": ollama_service.model
        }
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{request.model_name}' not found or unavailable"
        )


@router.get("/models/{model_name}/info")
async def get_model_info(model_name: str):
    """
    Get detailed information about a specific model.
    """
    try:
        # Temporarily switch to get info
        original_model = ollama_service.model
        ollama_service.model = model_name
        info = ollama_service.get_model_info()
        ollama_service.model = original_model
        return info
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/stats")
async def get_stats():
    """
    Get usage statistics and system status.
    """
    health = ollama_service.health_check()
    return StatsResponse(
        status=health.get("status", "unknown"),
        current_model=health.get("current_model", "unknown"),
        ollama_host=health.get("ollama_host", "unknown"),
        available_models=health.get("available_models", 0),
        timestamp=datetime.now().isoformat()
    )


@router.post("/test")
async def test_prompt(request: TestPromptRequest):
    """
    Test a prompt with the current AI model.
    Useful for admin testing and prompt engineering.
    """
    try:
        messages = [{"role": "user", "content": request.prompt}]
        
        # If custom system prompt provided, temporarily update
        original_prompt = ollama_service.system_prompt
        if request.system_prompt:
            ollama_service.system_prompt = request.system_prompt
        
        response = await ollama_service.chat(messages)
        
        # Restore original
        ollama_service.system_prompt = original_prompt
        
        return {
            "prompt": request.prompt,
            "response": response,
            "model": ollama_service.model
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/config")
async def get_config():
    """
    Get current AI configuration.
    """
    return {
        "model": ollama_service.model,
        "system_prompt": ollama_service.system_prompt,
        "ollama_host": ollama_service.client._client.base_url
    }


class SystemPromptRequest(BaseModel):
    """Request model for updating system prompt."""
    system_prompt: str


@router.put("/config/system-prompt")
async def update_system_prompt(request: SystemPromptRequest):
    """
    Update the system prompt/AI guidelines.
    """
    success = ollama_service.set_system_prompt(request.system_prompt)
    if success:
        return {
            "success": True,
            "message": "System prompt updated successfully",
            "preview": request.system_prompt[:100] + "..." if len(request.system_prompt) > 100 else request.system_prompt
        }
    else:
        raise HTTPException(
            status_code=400,
            detail="System prompt must be at least 10 characters"
        )

