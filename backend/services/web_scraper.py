"""
Web Scraper Service - Fetch and process web content for AI context.
Provides search and content extraction capabilities.
"""

import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
from dataclasses import dataclass
from duckduckgo_search import DDGS
from config import get_settings


settings = get_settings()


@dataclass
class SearchResult:
    """Represents a search result with extracted content."""
    title: str
    url: str
    snippet: str
    content: Optional[str] = None


class WebScraperService:
    """Service for web searching and content extraction."""
    
    def __init__(self):
        self.timeout = settings.scrape_timeout
        self.max_results = settings.max_search_results
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    async def search(self, query: str, max_results: Optional[int] = None, college_id: str = "vidya") -> List[SearchResult]:
        """
        Search the web using DuckDuckGo with college-specific site filter.
        """
        results = []
        num_results = max_results or self.max_results
        
        # Determine strict site filter
        site_filter = "site:vidya.edu.in"
        if college_id == "mmdu":
            site_filter = "site:mmumullana.org"
        
        try:
            with DDGS() as ddgs:
                search_query = f"{query} {site_filter}"
                search_results = list(ddgs.text(
                    search_query,
                    max_results=num_results
                ))
                
                for result in search_results:
                    results.append(SearchResult(
                        title=result.get('title', ''),
                        url=result.get('href', ''),
                        snippet=result.get('body', '')
                    ))
        except Exception as e:
            print(f"Search error: {str(e)}")
            
        return results

    async def scrape_url(self, url: str) -> Optional[str]:
        """
        Scrape content from a URL.
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, headers=self.headers, follow_redirects=True)
                
                if response.status_code != 200:
                    return None
                
                soup = BeautifulSoup(response.text, 'lxml')
                
                # Remove unwanted elements
                for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe']):
                    element.decompose()
                
                # Extract main content
                main_content = soup.find('main') or soup.find('article') or soup.find('body')
                
                if main_content:
                    # Get text and clean it up
                    text = main_content.get_text(separator='\n', strip=True)
                    lines = [line.strip() for line in text.splitlines() if line.strip()]
                    text = '\n'.join(lines)
                    
                    # --- DEEP SCRAPING: Recursively scrape linked pages ---
                    # Generic domain extraction for filtering
                    from urllib.parse import urlparse, urljoin
                    base_domain = urlparse(url).netloc
                    
                    internal_links = []
                    for link in soup.find_all('a', href=True):
                        href = link.get('href', '')
                        if not href or href.startswith('#') or href.startswith('javascript:'):
                            continue
                            
                        full_url = urljoin(url, href)
                        
                        # Only follow links within the same domain
                        if base_domain in full_url:
                             if full_url != url and full_url not in internal_links:
                                 internal_links.append(full_url)

                    # Visit top 3 unique internal links
                    deep_content = ""
                    visited_count = 0
                    for link_url in list(set(internal_links))[:3]:
                        try:
                             # print(f"    ↳ Deep scraping linked page: {link_url}")
                             async with httpx.AsyncClient(timeout=5) as sub_client: 
                                 sub_resp = await sub_client.get(link_url, headers=self.headers, follow_redirects=True)
                                 if sub_resp.status_code == 200:
                                     sub_soup = BeautifulSoup(sub_resp.text, 'lxml')
                                     for el in sub_soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
                                         el.decompose()
                                     sub_main = sub_soup.find('main') or sub_soup.find('body')
                                     if sub_main:
                                         sub_text = sub_main.get_text(separator=' ', strip=True)
                                         deep_content += f"\n\n--- Linked Page: {link_url} ---\n{sub_text[:1500]}"
                                         visited_count += 1
                        except:
                            continue

                    full_content = (text[:5000] if len(text) > 5000 else text) + deep_content
                    return full_content
                    
                return None
        except Exception as e:
            print(f"Scrape error for {url}: {str(e)}")
            return None

    def is_university_related(self, query: str) -> bool:
        """Check if query is related to university context."""
        keywords = [
            'vidya', 'university', 'college', 'institute', 'campus',
            'admission', 'course', 'fee', 'placement', 'result', 'exam',
            'hostel', 'mess', 'canteen', 'library', 'lab', 'laboratory',
            'auditorium', 'ground', 'sport', 'building', 'block',
            'department', 'school', 'faculty', 'director', 'registrar',
            'meerut', 'delhi', 'ncr', 'address', 'contact', 'location',
            'btech', 'mtech', 'mba', 'bba', 'bca', 'llb', 'mca', 'diploma', 'polytechnic',
            'fashion', 'journalism', 'fine arts', 'phd',
            'mmdu', 'mmu', 'mullana', 'maharishi', 'markandeshwar', 'ambala', 'haryana'
        ]
        query_lower = query.lower()
        return any(k in query_lower for k in keywords)

    async def search_and_scrape(self, query: str, max_results: Optional[int] = None, college_id: str = "vidya") -> Dict:
        """
        Search the web and scrape content from top results.
        """
        # 1. Check Cache First
        from services.knowledge_service import knowledge_service
        cached = knowledge_service.search_cache(query, college_id=college_id)
        if cached:
            print(f"✨ Using cached {college_id} result for: {query}")
            return {
                "query": query,
                "sources": cached["sources"],
                "context": cached["context"],
                "cached": True
            }

        # 2. Relevance Check (Before External Search)
        if not self.is_university_related(query):
            print(f"⛔ Query '{query}' rejected as non-university related.")
            return {
                "query": query,
                "sources": [],
                "context": "QUERY_REJECTED: Please ask questions related to the university (Admissions, Courses, Campus, etc.).",
                "rejected": True
            }

        # 3. Perform Web Search (External)
        results = await self.search(query, max_results, college_id=college_id)
        
        # Fallback if search failed or returned no results
        if not results:
            print(f"⚠️ Search failed or no results. Using fallback to {college_id} homepage.")
            if college_id == "mmdu":
                 results.append(SearchResult(
                    title="MM(DU) Official Website",
                    url="https://www.mmumullana.org",
                    snippet="Official website of Maharishi Markandeshwar (Deemed to be University)."
                ))
            else:
                results.append(SearchResult(
                    title="Vidya University Official Website",
                    url="https://www.vidya.edu.in",
                    snippet="Official website of Vidya Knowledge Park / Vidya University, Meerut."
                ))
        
        # Scrape content from top results
        scraped_count = 0
        for result in results[:3]:  # Only scrape top 3
            content = await self.scrape_url(result.url)
            if content:
                result.content = content
                scraped_count += 1
                
                # SAVE TO CACHE (Knowledge Base) with College ID
                knowledge_service.add_entry(query, result.title, result.url, content, college_id=college_id)
        
        # Build combined context for AI
        context_parts = []
        sources = []
        
        for result in results:
            source_info = {
                "title": result.title,
                "url": result.url,
                "snippet": result.snippet
            }
            sources.append(source_info)
            
            if result.content:
                context_parts.append(f"Source: {result.title}\nURL: {result.url}\n\n{result.content[:2000]}")
        
        combined_context = "\n\n---\n\n".join(context_parts) if context_parts else None
        
        return {
            "query": query,
            "sources": sources,
            "context": combined_context,
            "scraped_count": scraped_count
        }

    async def scrape_university_page(self, url: str) -> Dict:
        """
        Specialized scraper for university websites.
        
        Args:
            url: University page URL
            
        Returns:
            Structured content from the page
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, headers=self.headers, follow_redirects=True)
                
                if response.status_code != 200:
                    return {"error": f"Failed to fetch: {response.status_code}"}
                
                soup = BeautifulSoup(response.text, 'lxml')
                
                # Extract structured information
                data = {
                    "url": url,
                    "title": soup.title.string if soup.title else "",
                    "headings": [],
                    "content": "",
                    "links": []
                }
                
                # Get headings
                for heading in soup.find_all(['h1', 'h2', 'h3']):
                    data["headings"].append({
                        "level": heading.name,
                        "text": heading.get_text(strip=True)
                    })
                
                # Get main content
                main = soup.find('main') or soup.find('article') or soup.find('body')
                if main:
                    for element in main(['script', 'style', 'nav', 'footer']):
                        element.decompose()
                    data["content"] = main.get_text(separator='\n', strip=True)[:5000]
                
                # Get important links
                for link in soup.find_all('a', href=True)[:20]:
                    href = link.get('href', '')
                    text = link.get_text(strip=True)
                    if text and len(text) > 3:
                        data["links"].append({"text": text, "href": href})
                
                return data
        except Exception as e:
            return {"error": str(e)}


# Singleton instance
web_scraper = WebScraperService()
