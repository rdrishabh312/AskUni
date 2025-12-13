"""
Ollama Service - Integration with local Ollama AI models.
Provides chat completion, streaming, and model management.
"""

import json
import os
import ollama
from typing import AsyncGenerator, Optional, List, Dict, Any
from config import get_settings


settings = get_settings()

# Config file for persistent storage
CONFIG_FILE = os.path.join(os.path.dirname(__file__), "..", "ai_config.json")

# Default system prompt - can be updated via admin panel
DEFAULT_SYSTEM_PROMPT = """You are AskUni, an intelligent AI assistant designed specifically for university students and staff.

## Your Identity
- Name: AskUni
- Purpose: Help students with university-related questions
- Personality: Friendly, professional, supportive, and knowledgeable

## Your Capabilities
1. **Course Information**: Explain courses, prerequisites, credits, and schedules
2. **Admissions**: Guide through application processes, deadlines, and requirements
3. **Campus Life**: Information about events, clubs, facilities, and resources
4. **Academic Support**: Study tips, exam preparation, and learning resources
5. **Policies**: University rules, procedures, and guidelines

## Response Guidelines
1. **Be Accurate**: Only provide information you're confident about. If unsure, say so.
2. **Be Concise**: Give clear, direct answers. Use bullet points for lists.
3. **Be Helpful**: Anticipate follow-up questions and provide relevant details.
4. **Be Professional**: Maintain a friendly but professional tone.
5. **Use Formatting**: Use markdown for headers, lists, and emphasis.

## When Using Web Sources
- Summarize information clearly
- Mention the source when relevant
- Provide the most up-to-date information available

## Important
- Never make up information about specific dates, fees, or policies
- Always encourage students to verify critical information with official sources
- Be supportive and encouraging to students

Remember: You represent the university's commitment to student success!"""


class OllamaService:
    """Service for interacting with local Ollama AI models."""
    
    def __init__(self):
        self.client = ollama.Client(host=settings.ollama_host)
        self.model = settings.ollama_model
        self.system_prompt = self._load_config()
    
    def _load_config(self) -> str:
        """Load system prompt from config file, or return default."""
        try:
            if os.path.exists(CONFIG_FILE):
                with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    saved_prompt = data.get('system_prompt', '')
                    if saved_prompt and len(saved_prompt) > 10:
                        print("📄 Loaded system prompt from config file")
                        return saved_prompt
        except Exception as e:
            print(f"⚠️ Could not load config file: {e}")
        return DEFAULT_SYSTEM_PROMPT
    
    def _save_config(self) -> bool:
        """Save current system prompt to config file."""
        try:
            with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump({'system_prompt': self.system_prompt}, f, indent=2, ensure_ascii=False)
            print("💾 System prompt saved to config file")
            return True
        except Exception as e:
            print(f"⚠️ Could not save config file: {e}")
            return False
    
    def set_system_prompt(self, prompt: str) -> bool:
        """Update the system prompt/AI guidelines and persist to file."""
        if prompt and len(prompt) > 10:
            self.system_prompt = prompt
            self._save_config()
            return True
        return False
    
    def get_system_prompt(self) -> str:
        """Get the current system prompt."""
        return self.system_prompt

    async def chat(
        self,
        messages: List[Dict[str, str]],
        context: Optional[str] = None
    ) -> str:
        """
        Send a chat request to Ollama and get a complete response.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            context: Optional additional context from web scraping
            
        Returns:
            Complete response string from the AI
        """
        # Prepare messages with system prompt
        full_messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add context if available
        if context:
            full_messages.append({
                "role": "system",
                "content": f"Additional context from web sources:\n{context}"
            })
        
        full_messages.extend(messages)
        
        try:
            response = self.client.chat(
                model=self.model,
                messages=full_messages
            )
            return response['message']['content']
        except Exception as e:
            raise Exception(f"Ollama chat error: {str(e)}")

    async def chat_stream(
        self,
        messages: List[Dict[str, str]],
        context: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat responses from Ollama.
        
        Args:
            messages: List of message dictionaries
            context: Optional additional context
            
        Yields:
            Chunks of the response as they arrive
        """
        full_messages = [{"role": "system", "content": self.system_prompt}]
        
        if context:
            full_messages.append({
                "role": "system",
                "content": f"Additional context from web sources:\n{context}"
            })
        
        full_messages.extend(messages)
        
        try:
            stream = self.client.chat(
                model=self.model,
                messages=full_messages,
                stream=True
            )
            
            for chunk in stream:
                if 'message' in chunk and 'content' in chunk['message']:
                    yield chunk['message']['content']
        except Exception as e:
            yield f"\n\n[Error: {str(e)}]"

    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model."""
        try:
            return self.client.show(self.model)
        except Exception as e:
            return {"error": str(e)}

    def list_models(self) -> List[Dict[str, Any]]:
        """List all available Ollama models."""
        try:
            response = self.client.list()
            return response.get('models', [])
        except Exception as e:
            return [{"error": str(e)}]

    def health_check(self) -> Dict[str, Any]:
        """Check if Ollama is running and accessible."""
        try:
            models = self.list_models()
            return {
                "status": "healthy",
                "ollama_host": settings.ollama_host,
                "current_model": self.model,
                "available_models": len(models)
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "ollama_host": settings.ollama_host
            }

    def set_model(self, model_name: str) -> bool:
        """Change the active model."""
        try:
            # Verify model exists
            self.client.show(model_name)
            self.model = model_name
            return True
        except Exception:
            return False


# Singleton instance
ollama_service = OllamaService()

