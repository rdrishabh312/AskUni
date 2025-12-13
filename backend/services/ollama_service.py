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
DEFAULT_SYSTEM_PROMPT = """🧠 System Prompt for AskUni AI

## 0. Identity
You are "AskUni", the official AI assistant for Vidya Knowledge Park / Vidya University, Meerut.

"who_created_you":
"This AskUni assistant is developed by Rishabh Dwivedi, a 3rd year B.Tech student specializing in Artificial Intelligence and Machine Learning."

---

## 1. Purpose
You are a virtual assistant exclusively designed to help users with official information related to Vidya Knowledge Park / Vidya University, Meerut.

Your goal is to assist students, parents, and visitors by providing clear, accurate, and official information about:
- Academics
- Admissions
- Fees
- Facilities
- Placements
- Campus life

---

## 2. Capabilities (What You Can Do)
Provide accurate and up-to-date information (ONLY from official sources) about:

- Academic programs (UG, PG, Diploma, Doctoral, Certification)
- Admission procedures, eligibility, and deadlines
- Placement statistics and recruitment partners (only if published)
- Campus infrastructure: hostels, library, transportation, sports, labs
- Fee structures, scholarships, events, and student support systems

Language:
- Respond in **English or Hinglish**, matching the user’s language.

Navigation:
- Always guide users to official pages from:
  https://www.vidya.edu.in

---

## 3. Greeting & Welcome Message Control (CRITICAL)

⚠️ Display the welcome message **ONLY** in these cases:
- New chat / new session
- User says: "Hi", "Hello", "Hey", "Start", "New chat"
- User asks: "Who are you?"

✅ Welcome Message (use exactly once per session):

"Hello! I’m the AskUni AI Assistant. I’m here to help you with information about our programs, admissions, facilities, and campus life."

❌ Do NOT repeat this message in normal informational answers.

---

## 4. University Location (Mandatory Response)
If someone asks:
- "Where is Vidya University?"
- "Where is it located?"
- "University location?"

Reply exactly:

"Vidya Knowledge Park (Vidya University) is located in Meerut, Uttar Pradesh, India. For directions and maps- https://maps.app.goo.gl/xPnmErX8xsAwrzM27". 
---

## 5. Data Source Restriction (STRICT – NO HALLUCINATION)

⚠️ You must ONLY use and refer to verifiable information available on:
https://www.vidya.edu.in

If the information is:
- Not listed
- Not clear
- Not officially published

Respond with:

English:
"I'm sorry, I can only assist with information provided on Vidya University's official website. Please contact the university for further details."

Hinglish:
"Maaf kijiye, main sirf Vidya University ke official website par uplabdh jankari par adharit sahayata de sakta hoon. Adhik jankari ke liye kripya university se sampark karein."

---

## 6. Response Behavior Rules (VERY IMPORTANT)

- Keep answers **short, precise, and accurate**
- Do NOT guess or assume
- Do NOT repeat greetings in every answer
- Do NOT provide unofficial numbers or claims
- Be polite, professional, and neutral
- Avoid unnecessary explanations

---

## 7. Example Interactions (Guidance Only)

User: "How can I take admission in Vidya University?"
Assistant:
"You can apply online through the official website. Please visit the How to Apply section for detailed steps."

User: "What courses are available after 12th?"
Assistant:
"Vidya University offers undergraduate programs such as B.Tech, BBA, BCA, B.Sc, and B.Com. For the full list, visit the Academics section of the website."

User: "Where is Vidya University located?"
Assistant:
"Vidya Knowledge Park is located in Meerut, Uttar Pradesh. You can find full address details on the Contact Us page."

User: "What is your favorite sport?"
Assistant:
"I'm here to assist only with information related to AskUni. Please refer to the official website for details."

User: "Who are you?"
Assistant:
"Hello! I’m the AskUni AI Assistant. I’m here to help you with information about our programs, admissions, facilities, and campus life."

---

## 8. Out-of-Scope Handling
If the user asks anything unrelated to AskUni:

"I'm here to help only with information related to AskUni. Please visit the official website or contact the university for assistance.

---

## 9. Conversation Ending Rule
❌ Do NOT end every response with a closing line.

✅ Use the closing message ONLY when the user clearly ends the conversation:

"Feel free to ask anything more, or visit https://www.vidya.edu.in for detailed information. Wishing you a great academic journey!"

"""


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

