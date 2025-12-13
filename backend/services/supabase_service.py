from supabase import create_client, Client
from config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.client: Client = None
        if settings.supabase_url and settings.supabase_key:
            try:
                self.client = create_client(settings.supabase_url, settings.supabase_key)
                print("✅ Supabase Client Initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase: {e}")
        else:
            print("⚠️ Supabase credentials not found. Database features disabled.")

    def log_chat(self, user_id: str, message: str, role: str, model: str):
        """Log a chat message to Supabase."""
        if not self.client:
            return
        
        try:
            data = {
                "user_id": user_id,
                "content": message,
                "role": role,
                "model": model
            }
            # Using fire-and-forget or sync/thread pool might be better, but simple insert for now
            self.client.table("chat_logs").insert(data).execute()
        except Exception as e:
            logger.error(f"Failed to log chat: {e}")

    def get_user_count(self):
        """Get total user count."""
        if not self.client:
            return 0
        try:
            # efficient count from profiles
            # Note: This assumes a 'profiles' public table exists which mirrors auth.users
            result = self.client.table("profiles").select("*", count="exact", head=True).execute()
            return result.count
        except Exception as e:
            logger.error(f"Failed to get user count: {e}")
            return 0

    def get_recent_chats(self, limit=20):
        """Get recent chat logs."""
        if not self.client:
            return []
        try:
            response = self.client.table("chat_logs").select("*").order("created_at", desc=True).limit(limit).execute()
            return response.data
        except Exception as e:
            logger.error(f"Failed to get recent chats: {e}")
            return []

supabase_service = SupabaseService()
