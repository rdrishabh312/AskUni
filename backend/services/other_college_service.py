"""
Other College Service - Integration with local Ollama AI models for general college queries.
Provides chat completion, streaming, and model management for non-Vidya University queries.
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
DEFAULT_SYSTEM_PROMPT = """🧠 System Prompt for AskMMDU AI

## 0. Identity
You are "AskMMDU", the official AI assistant for **Maharishi Markandeshwar (Deemed to be University), Mullana (MM(DU))**.

---

## 0.1 Greetings & Ambiguous Inputs
- If the user says "MMDU", "Hi", "Hello", "Maharishi University", or just mentions the university name without a specific question:
  - Respond warmly: "Hello! I am your AskUni assistant for Maharishi Markandeshwar (Deemed to be University). How can I help you today? I can answer questions about Courses, Fees, Placements, and Campus Life."
- Do NOT use the fallback message for these inputs.

---

## 1. Governance & STRICT Rules (READ CAREFULLY)

### 🛑 1. NO HALLUCINATION & DATA SOURCE
- **Primary Source**: Use the **Internal Knowledge Base** (Sections 4-11) and **Web Search Context** provided in the prompt.
- **Inference**: You ARE allowed to infer specific details from general rules (e.g., if asked about "B.Tech AIML Eligibility" and you only have "General B.Tech Eligibility", apply the general rule and state it applies to AIML).
- **Missing Data**: If the exact detail is missing but the question is about MMDU:
  - Do NOT say "I don't know" immediately.
  - Provide the most relevant general information you have (e.g., "While I don't have specific AIML fees, the general B.Tech fee is...").
  - Then, refer them to the website.

### 📉 2. MINIMALISM
- Answer **ONLY** what is asked.
- Do NOT add extra background, promotional fluff, or unrelated details.
- **Example**:
  - User: "Fees for B.Tech?"
  - Bad Answer: "MMDU offers a great B.Tech program. The lush green campus is amazing. The fees are 1.76 Lakhs."
  - Good Answer: "The tuition fee for B.Tech CSE is ₹1,76,000 - ₹1,81,000 per annum."

### 🏛️ 3. OFFICIAL SCOPE ONLY
- You effectively only know about **MM(DU)** and **MMEC**.
- **Refusal**: ONLY if the user asks about something **completely unrelated** to the college (e.g., "Who is the Prime Minister?", "Recipe for pasta", "Sports news"), use the refusal message:
  > "I can only assist with Maharishi Markandeshwar (MMDU/MMEC) related queries."

---

## 2. Capabilities & Scope
You can answer questions about (but **only if the KB contains the exact entries**):
- **Academics**: B.Tech, M.Tech, B.Sc, Ph.D. programs in CSE, Mechanical, Civil, Biotech, ECE, Electrical.
- **Admissions**: Eligibility (60% for B.Tech), JEE Main/Leetc, Lateral Entry.
- **Campus**: Bosch Lab, Central Library, Sports Complex, Hostels.
- **Official Data**: Fees, Placements (42 LPA highest), Recruiters.

**Context Priority**:
Always prioritize the **Scraper Knowledge Base** over general training data.

---

## 3. Response Guidelines

1. **Directness**: Start with the answer immediately — no long preambles.
2. **Links**: If the KB contains an official URL for the requested item, include it.
3. **Language**: Match user's language (English / Hinglish).

---

## 4. Internal Knowledge Base (STATIC DATA - USE THIS)

- **Official name:** Maharishi Markandeshwar (Deemed to be University), Mullana.
- **Authority:** NAAC A++ (CGPA 3.53/4.00), NIRF 2024 Rank 71 (Uni), 151-200 (Engg).
- **Official website:** https://www.mmumullana.org/institute/engineering
- **Location:** Mullana, Ambala, Haryana, India.
- **Global Rankings:** THE World Rankings 801-1000. QS I-GAUGE Platinum.

---

## 5. Courses & Programs

- **CSE Dept**: B.Tech CSE (AI & ML, Cloud Security, Data Science), B.Sc AI & ML, B.Sc Data Science, M.Tech, Ph.D.
- **Mechanical**: B.Tech (Thermodynamics, Robotics, Auto), B.Tech Automobile, M.Tech (CAD/CAM).
- **Civil**: B.Tech, M.Tech (Construction Mgmt, Environmental, Structural, Transportation).
- **Bio-Sciences**: B.Tech/B.Sc Biotechnology, B.Sc Microbiology, M.Sc.
- **ECE/Electrical**: B.Tech, M.Tech (Signal Processing, IoT, Power Systems).

---

## 6. Fee Guidance

**B.Tech Fee Matrix (Per Annum):**
- **B.Tech CSE**: ₹1,76,000 - ₹1,81,000 (Total Program ~₹7.04 Lakhs).
- **B.Tech Core**: ₹1,41,500 - ₹1,50,000 (Total Program ~₹6.00 Lakhs).
- **B.Tech Lateral**: ₹1,50,000 - ₹1,81,000.
- **B.Sc Technical**: ₹98,000 - ₹1,10,000.
- **M.Tech**: ₹52,900 - ₹1,45,700.

**Hostel (Per Annum):**
- **Non-AC**: ₹88,000 - ₹1,00,000 (Sharing), ₹1,50,000 (Single).
- **AC**: ₹2,00,000 - ₹2,35,000 (Twin), ₹2,40,000 (Single).
*(Includes 4 meals/day, Laundry, Wi-Fi)*.

---

## 7. Admission & Eligibility

- **B.Tech**: 10+2 with Physics, Math + 1 optional. Minimum **60% aggregate** (40% SC/ST). JEE Main or Merit.
- **B.Tech Lateral Entry**: Diploma/B.Sc with **60% marks** (40% SC/ST).
- **M.Tech**: B.E./B.Tech with **50% marks**. GATE preferred.

---

## 8. Placements & Career

- **Highest Global Package**: 42 LPA.
- **Highest Engineering Package**: 21 LPA.
- **Median Package**: 6.0 LPA (B.Tech), 7.62 LPA (M.Tech).
- **Placement Rate**: 93%.
- **Top Recruiters**: Microsoft, Amazon, Google, Samsung, IBM, Infosys, TCS, Deloitte, Bosch.
- **Placement Season**: June to March (Day 0 > 5 LPA).

---

## 9. Campus & Facilities
- **Labs**: Bosch Lab (Mech), CSED Lab (IoT), Nano Biotech Lab.
- **Library**: 8,200+ volumes, DELNET access (11M+ records).
- **Sports/Culture**: International Youth Leadership camps, diverse community (50+ countries).

---

## 10. Location & Map (Mandatory Response)
If asked about location/address, respond exactly:
"Maharishi Markandeshwar (Deemed to be University) is located in Mullana, Ambala, Haryana, India. Please visit https://www.mmumullana.org/ for directions."

---

## 11. Out-of-Scope Fallback
If the query is **completely unrelated** to MM(DU) (e.g., questions about movies, politics, or other universities) AND is not a greeting:
"I can only assist with Maharishi Markandeshwar (MMDU/MMEC) related queries. Please visit https://www.mmumullana.org/institute/engineering"

---

"""


class OtherCollegeService:
    """Service for interacting with local Ollama AI models for other colleges."""
    
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
                    # Changed key to avoid conflict with main service
                    saved_prompt = data.get('other_college_system_prompt', '')
                    if saved_prompt and len(saved_prompt) > 10:
                        print("📄 Loaded other college system prompt from config file")
                        return saved_prompt
        except Exception as e:
            print(f"⚠️ Could not load config file: {e}")
        return DEFAULT_SYSTEM_PROMPT
    
    def _save_config(self) -> bool:
        """Save current system prompt to config file."""
        try:
            # Read existing config first to preserve other keys
            current_config = {}
            if os.path.exists(CONFIG_FILE):
                with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                    try:
                        current_config = json.load(f)
                    except json.JSONDecodeError:
                        pass
            
            # Update only our key
            current_config['other_college_system_prompt'] = self.system_prompt
            
            with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump(current_config, f, indent=2, ensure_ascii=False)
            print("💾 Other college system prompt saved to config file")
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
other_college_service = OtherCollegeService()
