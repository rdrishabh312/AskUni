from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Ollama Configuration
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "gemma3:latest"
    
    # App Configuration
    app_name: str = "AskUni AI Assistant"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # CORS Configuration
    frontend_url: str = "http://localhost:3000"
    
    # Web Scraping
    max_search_results: int = 5
    scrape_timeout: int = 10
    
    # Supabase (Database)
    supabase_url: str = ""
    supabase_key: str = ""
    pass
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
