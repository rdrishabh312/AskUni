import json
import os
import time
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict

KNOWLEDGE_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "knowledge_base.json")
MAX_KNOWLEDGE_ENTRIES = 200

@dataclass
class KnowledgeEntry:
    id: str
    query: str
    title: str
    url: str
    content: str
    timestamp: float
    college_id: str = "vidya"  # Default for backward compatibility

class KnowledgeService:
    def __init__(self):
        self.file_path = KNOWLEDGE_FILE
        self.entries: List[KnowledgeEntry] = []
        self._load_data()

    def _load_data(self):
        """Load knowledge base from JSON file."""
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # Handle legacy data without college_id
                    self.entries = []
                    for item in data:
                        if 'college_id' not in item:
                            item['college_id'] = 'vidya'
                        self.entries.append(KnowledgeEntry(**item))
                print(f"✅ Loaded {len(self.entries)} knowledge entries")
            except Exception as e:
                print(f"⚠️ Failed to load knowledge base: {e}")
                self.entries = []
        else:
            self.entries = []

    def _save_data(self):
        """Save knowledge base to JSON file."""
        try:
            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump([asdict(e) for e in self.entries], f, indent=2)
        except Exception as e:
            print(f"❌ Failed to save knowledge base: {e}")

    def add_entry(self, query: str, title: str, url: str, content: str, college_id: str = "vidya") -> KnowledgeEntry:
        """Add a new entry to the knowledge base."""
        # 1. Duplicate Query Check (Case-insensitive + same college)
        query_lower = query.lower().strip()
        for entry in self.entries:
            if entry.query.lower().strip() == query_lower and entry.college_id == college_id:
                # Update existing instead of adding duplicate
                entry.title = title
                entry.url = url
                entry.content = content
                entry.timestamp = time.time()
                self._save_data()
                print(f"♻️ Updated existing entry for: {query} ({college_id})")
                return entry



        # 3. Size Limit Enforcement (Global FIFO with preference for keeping college diversity)
        if len(self.entries) >= MAX_KNOWLEDGE_ENTRIES:
            # Simple FIFO for now to respect the new larger limit
            removed = self.entries.pop() 
            print(f"🗑️ Limit Reached. Removed oldest entry: {removed.query}")

        new_entry = KnowledgeEntry(
            id=str(int(time.time() * 1000)),
            query=query,
            title=title,
            url=url,
            content=content,
            timestamp=time.time(),
            college_id=college_id
        )
        self.entries.insert(0, new_entry) # Add to top
        self._save_data()
        return new_entry

    def search_cache(self, query: str, college_id: str = "vidya") -> Optional[Dict]:
        """
        Search for cached content relevant to the query and college.
        """
        # Filter entries by college first
        relevant_entries = [e for e in self.entries if e.college_id == college_id]
        
        query_lower = query.lower().strip()
        query_terms = set(query_lower.split())
        
        for entry in relevant_entries:
            # 1. Exact query match (Highest Confidence)
            if query_lower == entry.query.lower().strip():
                print(f"🎯 Cache Hit (Exact): {query}")
                return self._format_result(entry)
            
            # 2. Title heuristic (High Confidence)
            if entry.title.lower() in query_lower:
                print(f"🎯 Cache Hit (Title): {entry.title}")
                return self._format_result(entry)
            
            # 3. Fuzzy Match (Token Overlap) (Medium Confidence)
            # If query is long enough (> 3 words) and we match > 60% of keywords
            if len(query_terms) > 3:
                entry_query_terms = set(entry.query.lower().split())
                common = query_terms.intersection(entry_query_terms)
                overlap_ratio = len(common) / len(query_terms)
                
                if overlap_ratio >= 0.6:
                    print(f"🎯 Cache Hit (Fuzzy {int(overlap_ratio*100)}%): {entry.query}")
                    return self._format_result(entry)
                
        return None

    def _format_result(self, entry: KnowledgeEntry) -> Dict:
        return {
            "source": "cache",
            "context": f"Source: {entry.title}\nURL: {entry.url}\n(Cached Data - {entry.college_id})\n\n{entry.content}",
            "sources": [{
                "title": entry.title,
                "url": entry.url,
                "snippet": entry.content[:200] + "..."
            }]
        }

    def get_all_entries(self) -> List[Dict]:
        """Get all entries for Admin UI."""
        return [asdict(e) for e in self.entries]

    def update_entry(self, entry_id: str, query: str = None, title: str = None, url: str = None, content: str = None) -> bool:
        """Update an existing entry."""
        for entry in self.entries:
            if entry.id == entry_id:
                if query: entry.query = query
                if title: entry.title = title
                if url: entry.url = url
                if content: entry.content = content
                entry.timestamp = time.time()
                self._save_data()
                return True
        return False

    def delete_entry(self, entry_id: str) -> bool:
        """Delete an entry by ID."""
        initial_len = len(self.entries)
        self.entries = [e for e in self.entries if e.id != entry_id]
        if len(self.entries) < initial_len:
            self._save_data()
            return True
        return False

knowledge_service = KnowledgeService()
